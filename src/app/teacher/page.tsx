'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { Users, FileText, CheckCircle, Clock, Trophy } from 'lucide-react';

type Stats = {
  totalSubmissions: number;
  approvedSubmissions: number;
  pendingSubmissions: number;
  totalStudents: number;
  totalChallenges: number;
};

export default function TeacherDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalSubmissions: 0,
    approvedSubmissions: 0,
    pendingSubmissions: 0,
    totalStudents: 0,
    totalChallenges: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get submissions stats
        const { data: submissions } = await supabase
          .from('submissions')
          .select('status');

        const totalSubmissions = submissions?.length || 0;
        const approvedSubmissions = submissions?.filter(s => s.status === 'approved').length || 0;
        const pendingSubmissions = submissions?.filter(s => s.status === 'pending').length || 0;

        // Get total students
        const { data: students } = await supabase
          .from('users')
          .select('user_id', { count: 'exact' })
          .eq('role', 'student');

        const totalStudents = students?.length || 0;

        // Get total challenges
        const { data: challenges } = await supabase
          .from('challenges')
          .select('challenge_id', { count: 'exact' });

        const totalChallenges = challenges?.length || 0;

        setStats({
          totalSubmissions,
          approvedSubmissions,
          pendingSubmissions,
          totalStudents,
          totalChallenges,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Overview of student activity and challenge management</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">Evidence submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedSubmissions}</div>
            <p className="text-xs text-muted-foreground">Successfully validated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingSubmissions}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Challenge Overview
            </CardTitle>
            <CardDescription>Available challenges for students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChallenges}</div>
            <p className="text-sm text-muted-foreground">Active eco-challenges</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
