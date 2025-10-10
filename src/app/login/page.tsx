"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Admin flow routes to admin login page
      if (role === "admin") {
        setLoading(false);
        router.push("/admin/login");
        return;
      }
      // 1️⃣ Sign in with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const userId = data.user?.id;
      if (!userId) throw new Error("Login failed");

      // 2️⃣ Fetch user profile; if missing, create it based on selected role
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (!profile) {
        const defaultName = data.user?.user_metadata?.name || (data.user?.email?.split("@")[0] ?? "User");
        const { error: upsertError } = await supabase
          .from("users")
          .upsert(
            [
              {
                user_id: userId,
                name: defaultName,
                email: data.user?.email ?? "",
                phone: null,
                role,
                class: role === "student" ? null : null,
                school: null,
              },
            ],
            { onConflict: "user_id" }
          );
        if (upsertError) throw upsertError;

        // If teacher, ensure a row exists in teachers table too
        if (role === "teacher") {
          const { error: teacherUpsertError } = await supabase
            .from("teachers")
            .upsert(
              [
                {
                  user_id: userId,
                  name: defaultName,
                  email: data.user?.email ?? "",
                  phone: null,
                  school: null,
                },
              ],
              { onConflict: "user_id" }
            );
          if (teacherUpsertError) throw teacherUpsertError;
        }
      } else {
        if (profile.role !== role) {
          throw new Error(`Role mismatch. You are logged in as ${profile.role}`);
        }
      }

      // 3️⃣ Success → redirect to role-based dashboard
      if (role === "teacher") {
        router.push("/teacher/submissions");
      } else {
        router.push("/student/profile");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md text-black">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          Eco Challenge 🌍
        </h1>

        {/* Admin quick access inside card */}
        <div className="flex justify-end mb-2 text-xs">
          <a href="/admin" className="text-green-700 hover:underline">Admin</a>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-black">Login as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-black"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 text-black"
              placeholder="you@example.com"
              suppressHydrationWarning={true}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-black">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 pr-10 text-black"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a 
            href="/forgot-password" 
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Forgot your password?
          </a>
        </div>

        <p className="mt-4 text-sm text-center text-black">
          Don't have an account?{" "}
          <a href="/register" className="text-green-600 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
}
