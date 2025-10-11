"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Crown, Star, UserCircle2, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const getRankColor = (rank: number) => {
  if (rank === 1) return "text-yellow-500";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-amber-700";
  return "text-muted-foreground";
}

type LeaderboardSchool = { rank: number; name: string; points: number; location: string };
type LeaderboardStudent = { rank: number; name: string; points: number; class: string };

export default function LeaderboardPage() {
  const [schoolBoard, setSchoolBoard] = useState<LeaderboardSchool[]>([]);
  const [mySchoolStudents, setMySchoolStudents] = useState<LeaderboardStudent[]>([]);
  const [userSchool, setUserSchool] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');

  useEffect(() => {
    const load = async () => {
      // Get current user info
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("school, role")
          .eq("user_id", sessionData.session.user.id)
          .single();
        if (userData) {
          setUserSchool(userData.school);
          setUserRole(userData.role);
        }
      }

      // Get all schools leaderboard
      const schoolResponse = await fetch('/api/leaderboard');
      if (schoolResponse.ok) {
        const schoolResult = await schoolResponse.json();
        setSchoolBoard(schoolResult.leaderboard || []);
      }

      // Get my school students leaderboard
      const studentResponse = await fetch('/api/leaderboard?type=students');
      if (studentResponse.ok) {
        const studentResult = await studentResponse.json();
        setMySchoolStudents(studentResult.leaderboard || []);
      }
    };
    load();
  }, []);
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <Trophy className="w-10 h-10" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2">See which schools are leading the charge in eco-action!</p>
      </header>

      <Tabs defaultValue="my-school" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary">
          <TabsTrigger value="my-school">My School</TabsTrigger>
          <TabsTrigger value="all-schools">All Schools</TabsTrigger>
        </TabsList>

        <TabsContent value="my-school">
          <Card>
            <CardHeader>
              <CardTitle>My School Leaderboard</CardTitle>
              <CardDescription>
                {userSchool ? `See how students from ${userSchool} rank against each other in eco-action!` : 'Individual student rankings from your school.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mySchoolStudents.length > 0 ? (
                    mySchoolStudents.map((student) => (
                      <TableRow key={student.rank}>
                        <TableCell className="font-medium text-center">
                          <div className={`flex items-center justify-center ${getRankColor(student.rank)}`}>
                            {student.rank === 1 ? <Crown className="w-6 h-6"/> : student.rank}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <UserCircle2 className="w-8 h-8 text-muted-foreground"/>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 font-semibold text-primary">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {student.points.toLocaleString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No student data available for your school.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-schools">
          <Card>
            <CardHeader>
              <CardTitle>All Schools Leaderboard</CardTitle>
              <CardDescription>The aggregate scores of all schools participating in eco-action.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center">Rank</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Total Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schoolBoard.map((school) => (
                    <TableRow key={school.rank}>
                      <TableCell className="font-medium text-center">
                        <div className={`flex items-center justify-center ${getRankColor(school.rank)}`}>
                          {school.rank === 1 ? <Crown className="w-6 h-6"/> : school.rank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserCircle2 className="w-8 h-8 text-muted-foreground"/>
                          <span className="font-medium">{school.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{school.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 font-semibold text-primary">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {school.points.toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
