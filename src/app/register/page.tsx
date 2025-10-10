"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    class: "",
    school: "",
  });
  const [schoolOptions, setSchoolOptions] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    async function loadSchools() {
      try {
        const res = await fetch('/api/schools?limit=1000')
        const data = await res.json()
        const schools = (data.schools ?? []).map((s: any) => ({ id: s.id, name: s.name }))
        setSchoolOptions(schools)
      } catch (e) {
        setSchoolOptions([])
      }
    }
    loadSchools()
  }, [])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    // Validation
    if (role === "student" && !form.school) {
      setError("Please select your school");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Create auth user (Supabase manages password securely)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
  
      if (signUpError) throw signUpError;
  
      const userId = data.user?.id;
  
      // 2️⃣ Store extra profile info in `users` table
      // Upsert without ON CONFLICT (works even if no unique constraint)
      const { data: existingUser, error: fetchUserError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchUserError) throw fetchUserError;

      let insertError = null as any;
      if (existingUser) {
        const { error } = await supabase
          .from("users")
          .update({
            name: form.name,
            email: form.email,
            phone: form.phone,
            role,
            class: role === "student" ? form.class : null,
            school: form.school,
          })
          .eq("user_id", userId);
        insertError = error;
      } else {
        const { error } = await supabase.from("users").insert([
          {
            user_id: userId,
            name: form.name,
            email: form.email,
            phone: form.phone,
            role,
            class: role === "student" ? form.class : null,
            school: form.school,
          },
        ]);
        insertError = error;
      }
  
      if (insertError) throw insertError;

      // 3️⃣ If teacher, also create entry in `teachers` table
      if (role === "teacher") {
        const { data: existingTeacher, error: fetchTeacherError } = await supabase
          .from("teachers")
          .select("user_id")
          .eq("user_id", userId)
          .maybeSingle();
        if (fetchTeacherError) throw fetchTeacherError;

        let teacherInsertError = null as any;
        if (existingTeacher) {
          const { error } = await supabase
            .from("teachers")
            .update({
              name: form.name,
              email: form.email,
              phone: form.phone,
              school: form.school || null,
            })
            .eq("user_id", userId);
          teacherInsertError = error;
        } else {
          const { error } = await supabase
            .from("teachers")
            .insert([
              {
                user_id: userId,
                name: form.name,
                email: form.email,
                phone: form.phone,
                school: form.school || null,
              },
            ]);
          teacherInsertError = error;
        }
        if (teacherInsertError) throw teacherInsertError;
      }
  
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          Register for Eco Challenge 🌱
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-black">Register as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-black"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-black">Full Name</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-black"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-black"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-black">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-black"
              placeholder="+91 9876543210"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-black">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-black"
              placeholder="••••••••"
            />
          </div>

          {/* Class (only for students) */}
          {role === "student" && (
            <div>
              <label className="block text-sm font-medium text-black">Class</label>
              <select
                name="class"
                value={form.class}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-black"
                >
                  <option value="">Select Class</option>
                  <option value="3th">3th Grade</option>
                  <option value="4th">4th Grade</option>
                  <option value="5th">5th Grade</option>
                  <option value="6th">6th Grade</option>
                  <option value="7th">7th Grade</option>
                  <option value="8th">8th Grade</option>
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
            </div>
          )}

          {/* School (for both student/teacher, but optional for teacher) */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              School {role === "student" && <span className="text-red-500">*</span>}
            </label>
            <select
              name="school"
              value={form.school}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-black"
            >
              <option value="">Select school</option>
              {schoolOptions.map((s) => (
                <option key={`school-${s.id}`} value={s.name}>{s.name}</option>
              ))}
            </select>
            {role === "student" && !form.school && (
              <p className="text-red-500 text-sm mt-1">Please select your school</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 text-black"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-black">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-medium">Login</a>
        </p>
      </div>
    </div>
  );
}
