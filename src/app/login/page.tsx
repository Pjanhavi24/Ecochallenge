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
    <div className="min-h-screen flex">
      {/* Left side - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full p-16 text-white">
            <div className="animate-float">
              <div className="text-8xl mb-8 opacity-20">🌍</div>
            </div>
            <h1 className="font-heading text-5xl font-bold mb-6 leading-tight">
              Eco<br/>Challenge
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-md text-center font-light">
              Gamified environmental education for the next generation of sustainability leaders.
            </p>
            <div className="mt-12 flex space-x-8 text-sm text-slate-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">10K+</div>
                <div>Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">500+</div>
                <div>Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50+</div>
                <div>Schools</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-12">
            <div className="text-6xl mb-4 animate-float">🌍</div>
            <h1 className="font-heading text-4xl font-bold text-green-900 mb-2">
              EcoChallenge
            </h1>
            <p className="text-slate-600 font-light">
              Environmental education reimagined
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover-lift">
            <div className="mb-8">
              <h2 className="font-heading text-3xl font-semibold text-green-900 mb-2">
                Welcome back
              </h2>
              <p className="text-slate-600 font-light">
                Sign in to continue your sustainability journey
              </p>
            </div>

            {/* Admin quick access */}
            <div className="flex justify-end mb-6">
              <a
                href="/admin"
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200 font-medium"
              >
                Admin Access
              </a>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  I am a
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 text-green-900 bg-white"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {/* Email */}
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 text-green-900 bg-white"
                  placeholder="you@school.edu"
                  suppressHydrationWarning={true}
                />
              </div>

              {/* Password */}
              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 text-green-900 bg-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="animate-scale-in bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md animate-slide-up"
                style={{ animationDelay: '0.4s' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <a
                href="/forgot-password"
                className="text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium text-sm"
              >
                Forgot your password?
              </a>
            </div>

            <div className="mt-6 text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <p className="text-slate-600 text-sm">
                New to EcoChallenge?{" "}
                <a
                  href="/register"
                  className="text-green-700 font-semibold hover:text-green-600 transition-colors duration-200"
                >
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
