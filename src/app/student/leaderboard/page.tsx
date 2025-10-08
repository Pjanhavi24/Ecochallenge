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

type LeaderboardUser = { rank: number; name: string; points: number; school: string | null };

export default function LeaderboardPage() {
  const [schoolBoard, setSchoolBoard] = useState<LeaderboardUser[]>([]);
  const [classBoard, setClassBoard] = useState<LeaderboardUser[]>([]);
  const [userSchool, setUserSchool] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [showGlobal, setShowGlobal] = useState(false);

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
          setShowGlobal(false); // Start with school view
        }
      }

      // Get leaderboard data
      let query = supabase
        .from("users")
        .select("name, points, school")
        .order("points", { ascending: false })
        .limit(50);

      // If not showing global and we have user school, filter by school
      if (!showGlobal && userSchool) {
        query = query.eq("school", userSchool);
      }

      const { data, error } = await query;
      if (!error && data) {
        const mapped = data.map((u, idx) => ({
          rank: idx + 1,
          name: (u as any).name as string,
          points: ((u as any).points ?? 0) as number,
          school: ((u as any).school ?? null) as string | null,
        }));
        setSchoolBoard(mapped);
        // For now mirror to class tab; can be filtered by class later
        setClassBoard(mapped);
      }
    };
    load();
  }, [showGlobal, userSchool]);
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <Trophy className="w-10 h-10" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2">See who's leading the charge in eco-action!</p>
        {userRole === 'teacher' && (
          <div className="mt-4">
            <Button
              variant={showGlobal ? "default" : "outline"}
              onClick={() => setShowGlobal(!showGlobal)}
            >
              {showGlobal ? "Show School Only" : "Show All Schools"}
            </Button>
          </div>
        )}
      </header>

      <Tabs defaultValue="school" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary">
          <TabsTrigger value="school">School Wide</TabsTrigger>
          <TabsTrigger value="class">My Class</TabsTrigger>
        </TabsList>
        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>Greenwood High vs. Oceanview Middle</CardTitle>
              <CardDescription>The top eco-warriors across all participating schools.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schoolBoard.map((user) => (
                    <TableRow key={user.rank}>
                      <TableCell className="font-medium text-center">
                        <div className={`flex items-center justify-center ${getRankColor(user.rank)}`}>
                          {user.rank === 1 ? <Crown className="w-6 h-6"/> : user.rank}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserCircle2 className="w-8 h-8 text-muted-foreground"/>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.school ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 font-semibold text-primary">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {user.points.toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="class">
           <Card>
            <CardHeader>
              <CardTitle>Class 8A Rankings</CardTitle>
              <CardDescription>How you stack up against your classmates.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center">Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classBoard.map((user) => (
                    <TableRow key={user.rank}>
                      <TableCell className="font-medium text-center">
                        <div className={`flex items-center justify-center ${getRankColor(user.rank)}`}>
                          {user.rank === 1 ? <Crown className="w-6 h-6"/> : user.rank}
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-3">
                          <UserCircle2 className="w-8 h-8 text-muted-foreground"/>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 font-semibold text-primary">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {user.points.toLocaleString()}
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
