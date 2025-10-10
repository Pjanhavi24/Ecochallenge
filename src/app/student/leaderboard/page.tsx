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

export default function LeaderboardPage() {
  const [schoolBoard, setSchoolBoard] = useState<LeaderboardSchool[]>([]);
  const [classBoard, setClassBoard] = useState<LeaderboardSchool[]>([]);
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

      // Get leaderboard data from API
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const result = await response.json();
        const schools = result.leaderboard || [];
        setSchoolBoard(schools);
        // For now mirror to class tab
        setClassBoard(schools);
      }
    };
    load();
  }, [userSchool]);
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <Trophy className="w-10 h-10" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2">See which schools are leading the charge in eco-action!</p>
      </header>

      <Tabs defaultValue="school" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary">
          <TabsTrigger value="school">All Schools</TabsTrigger>
          <TabsTrigger value="class">Top Schools</TabsTrigger>
        </TabsList>
        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle>School Leaderboard</CardTitle>
              <CardDescription>The top schools leading in eco-action based on total student points.</CardDescription>
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
        <TabsContent value="class">
           <Card>
             <CardHeader>
               <CardTitle>Top Performing Schools</CardTitle>
               <CardDescription>The highest scoring schools in the competition.</CardDescription>
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
                   {classBoard.slice(0, 10).map((school) => (
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
