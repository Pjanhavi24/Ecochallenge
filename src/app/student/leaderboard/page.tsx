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
type AllStudentsEntry = { rank: number; name: string; points: number; class: string; school: string; profile_image_url?: string };

export default function LeaderboardPage() {
  const [schoolBoard, setSchoolBoard] = useState<LeaderboardSchool[]>([]);
  const [mySchoolStudents, setMySchoolStudents] = useState<LeaderboardStudent[]>([]);
  const [allStudents, setAllStudents] = useState<AllStudentsEntry[]>([]);
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

      // Get all students leaderboard
      const allStudentsResponse = await fetch('/api/leaderboard?type=all_students');
      if (allStudentsResponse.ok) {
        const allStudentsResult = await allStudentsResponse.json();
        setAllStudents(allStudentsResult.leaderboard || []);
      }
    };
    load();
  }, []);
  const topScorer = allStudents.length > 0 ? allStudents[0] : null;

  const getRandomTagline = () => {
    const taglines = [
      "ECO WARRIOR",
      "GREEN CHAMPION",
      "EARTH HERO",
      "PLANET PROTECTOR",
      "SUSTAINABILITY STAR",
      "NATURE'S LEADER",
      "GREEN GOER",
      "ECO LEGEND",
      "EARTH DEFENDER",
      "GREEN GUARDIAN"
    ];
    return taglines[Math.floor(Math.random() * taglines.length)];
  };

  const currentTagline = topScorer ? getRandomTagline() : "ECO WARRIOR";

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
            <Trophy className="w-10 h-10" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-2">See which schools are leading the charge in eco-action!</p>
        </div>
        {topScorer && (
          <div className="relative flex items-center gap-4 bg-gradient-to-r from-green-400/20 via-primary/20 to-green-400/20 rounded-xl p-6 border-2 border-primary/30 shadow-lg animate-pulse">
            {/* Eco warrior tree animations */}
            <div className="absolute -top-3 -left-4 text-green-500 animate-bounce" style={{animationDelay: '0s'}}>🌳</div>
            <div className="absolute -top-2 -right-3 text-green-600 animate-bounce" style={{animationDelay: '0.5s'}}>🌲</div>
            <div className="absolute -bottom-2 -left-5 text-green-400 animate-bounce" style={{animationDelay: '1s'}}>🌿</div>
            <div className="absolute -bottom-3 -right-4 text-green-500 animate-bounce" style={{animationDelay: '1.5s'}}>🌳</div>

            {/* Sparkle effects */}
            <div className="absolute -top-2 -left-2 w-4 h-4 text-yellow-400 animate-ping">✨</div>
            <div className="absolute -top-1 -right-1 w-3 h-3 text-primary animate-pulse">⭐</div>
            <div className="absolute -bottom-1 -left-3 w-3 h-3 text-yellow-500 animate-bounce">✨</div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium mb-1">🌟 {currentTagline} 🌟</p>
              <p className="text-lg font-bold text-primary mb-1">{topScorer.name}</p>
              <p className="text-sm font-semibold text-green-600">{topScorer.points.toLocaleString()} points</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-primary/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary/50 shadow-md">
              {topScorer.profile_image_url ? (
                <img
                  src={topScorer.profile_image_url}
                  alt={topScorer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Crown className="w-10 h-10 text-primary animate-bounce" />
              )}
            </div>
          </div>
        )}
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
          <Tabs defaultValue="schools" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="schools">Schools Ranking</TabsTrigger>
              <TabsTrigger value="all-students">All Students Ranking</TabsTrigger>
            </TabsList>

            <TabsContent value="schools">
              <Card>
                <CardHeader>
                  <CardTitle>Schools Leaderboard</CardTitle>
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

            <TabsContent value="all-students">
              <Card>
                <CardHeader>
                  <CardTitle>All Students Leaderboard</CardTitle>
                  <CardDescription>Ranking of all students from all schools based on their eco-action points.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] text-center">Rank</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allStudents.length > 0 ? (
                        allStudents.map((student) => (
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
                            <TableCell>{student.school}</TableCell>
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
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No student data available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
