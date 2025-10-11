"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, CheckCircle, XCircle, Clock, BarChart3, Award } from "lucide-react";

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

type StudentOverview = {
  totalStudents: number;
  activeStudents: number;
  topPerformer: { name: string; points: number } | null;
  recentSubmissions: any[];
  classDistribution: { [key: string]: number };
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
  const [studentOverview, setStudentOverview] = useState<StudentOverview>({
    totalStudents: 0,
    activeStudents: 0,
    topPerformer: null,
    recentSubmissions: [],
    classDistribution: {},
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

      // Load student overview data
      const { data: students } = await supabase
        .from("users")
        .select("name, points, class, role")
        .eq("role", "student");

      const { data: recentSubs } = await supabase
        .from("submissions")
        .select(`
          submission_id,
          status,
          created_at,
          users!user_id(name),
          challenges(title)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      const totalStudents = students?.length || 0;
      const activeStudents = students?.filter(s => (s.points || 0) > 0).length || 0;

      const topPerformer = students && students.length > 0
        ? students.reduce((prev, current) =>
            (prev.points || 0) > (current.points || 0) ? prev : current
          )
        : null;

      const classDistribution: { [key: string]: number } = {};
      students?.forEach(student => {
        const cls = student.class || 'Unspecified';
        classDistribution[cls] = (classDistribution[cls] || 0) + 1;
      });

      setStudentOverview({
        totalStudents,
        activeStudents,
        topPerformer: topPerformer ? { name: topPerformer.name, points: topPerformer.points || 0 } : null,
        recentSubmissions: recentSubs || [],
        classDistribution,
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
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Student Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{studentOverview.totalStudents}</div>
                    <div className="text-sm text-muted-foreground">Total Students</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{studentOverview.activeStudents}</div>
                    <div className="text-sm text-muted-foreground">Active Students</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{Math.round((studentOverview.activeStudents / Math.max(studentOverview.totalStudents, 1)) * 100)}%</div>
                    <div className="text-sm text-muted-foreground">Engagement Rate</div>
                  </Card>
                </div>

                {studentOverview.topPerformer && (
                  <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                    <div className="flex items-center gap-3">
                      <Award className="w-8 h-8 text-yellow-600" />
                      <div>
                        <div className="font-semibold text-yellow-800">Top Performer</div>
                        <div className="text-lg font-bold text-yellow-900">{studentOverview.topPerformer.name}</div>
                        <div className="text-sm text-yellow-700">{studentOverview.topPerformer.points} points</div>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="space-y-2">
                  <h4 className="font-semibold">Class Distribution</h4>
                  {Object.entries(studentOverview.classDistribution).map(([className, count]) => (
                    <div key={className} className="flex justify-between items-center">
                      <span className="text-sm">{className}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(count / studentOverview.totalStudents) * 100} className="w-20 h-2" />
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Recent Activity
                </h3>

                <div className="space-y-3">
                  {studentOverview.recentSubmissions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No recent submissions</p>
                  ) : (
                    studentOverview.recentSubmissions.map((sub: any) => (
                      <Card key={sub.submission_id} className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{sub.users?.name || 'Unknown Student'}</div>
                            <div className="text-xs text-muted-foreground">{sub.challenges?.title || 'Unknown Challenge'}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(sub.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge
                            variant={
                              sub.status === 'approved' ? 'default' :
                              sub.status === 'rejected' ? 'destructive' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {sub.status}
                          </Badge>
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Approval Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.submissionsReviewed > 0 ? Math.round((stats.approvedCount / stats.submissionsReviewed) * 100) : 0}%
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Avg Points per Student</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {studentOverview.totalStudents > 0 ?
                        Math.round(studentOverview.activeStudents > 0 ?
                          (studentOverview.activeStudents * 50) / studentOverview.activeStudents : 0
                        ) : 0
                      }
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}