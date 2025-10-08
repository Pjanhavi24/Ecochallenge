"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Profile = {
  user_id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
};

type Stats = {
  submissionsReviewed: number;
  approvedCount: number;
  rejectedCount: number;
  challengesCreated: number;
};

export default function TeacherProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string>("");
  const [stats, setStats] = useState<Stats>({
    submissionsReviewed: 0,
    approvedCount: 0,
    rejectedCount: 0,
    challengesCreated: 0,
  });

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError("");
      // Check session
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        router.replace("/login");
        return;
      }

      const authUserId = session.user.id;

      // Fetch profile
      const { data: profileRow, error: profileError } = await supabase
        .from("users")
        .select("user_id, name, email, role")
        .eq("user_id", authUserId)
        .single();

      if (profileError) {
        if (!isMounted) return;
        setError(profileError.message);
        setLoading(false);
        return;
      }

      if (!isMounted) return;
      const p = profileRow as Profile;
      setProfile(p);

      // Load stats
      // Submissions reviewed (where reviewed_by is this teacher, but since we set to null, perhaps count all approved/rejected)
      // For now, since reviewed_by is null, perhaps count total submissions or something
      // Since teacher approves, perhaps count approved submissions
      const { data: subs } = await supabase
        .from("submissions")
        .select("status");

      const approvedCount = subs?.filter(s => s.status === 'approved').length || 0;
      const rejectedCount = subs?.filter(s => s.status === 'rejected').length || 0;
      const submissionsReviewed = approvedCount + rejectedCount;

      // Challenges created (if teacher created them, but currently no creator field)
      const challengesCreated = 0; // Placeholder

      setStats({
        submissionsReviewed,
        approvedCount,
        rejectedCount,
        challengesCreated,
      });

      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const avatarSeed = useMemo(() => profile?.name ?? "teacher", [profile?.name]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Loading profile...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
            <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${avatarSeed}`} alt={profile.name} />
            <AvatarFallback>{profile.name?.charAt(0) ?? "T"}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">{profile.name}</CardTitle>
          <CardDescription>{profile.email}</CardDescription>
          <Badge variant="secondary" className="mt-2">Teacher</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-center">
              <div className="text-sm text-blue-800">Submissions Reviewed</div>
              <div className="text-2xl font-bold text-blue-900">{stats.submissionsReviewed}</div>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-center">
              <div className="text-sm text-green-800">Approved</div>
              <div className="text-2xl font-bold text-green-900">{stats.approvedCount}</div>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-center">
              <div className="text-sm text-red-800">Rejected</div>
              <div className="text-2xl font-bold text-red-900">{stats.rejectedCount}</div>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 text-center">
              <div className="text-sm text-purple-800">Challenges Created</div>
              <div className="text-2xl font-bold text-purple-900">{stats.challengesCreated}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}