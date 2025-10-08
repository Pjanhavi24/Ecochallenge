"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Sprout, Star, Youtube } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { placeholderImages } from '@/lib/placeholder-images';

export default function TaskFeed() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchActiveChallenges = async () => {
      // Fetch user's submissions to get submitted challenge_ids
      const { data: submissions } = await supabase
        .from('submissions')
        .select('challenge_id')
        .eq('user_id', user.id);

      const submittedChallengeIds = submissions?.map(s => s.challenge_id) || [];

      // Fetch all challenges not submitted by the user
      const { data: allChallenges } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      const activeChallenges = allChallenges?.filter(challenge => !submittedChallengeIds.includes(challenge.challenge_id)) || [];
      setChallenges(activeChallenges);
    };

    fetchActiveChallenges();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">Active Tasks</h1>
        <p className="text-muted-foreground mt-2">Complete these available tasks, earn points, and save the planet!</p>
      </header>

      {challenges.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-muted-foreground">All tasks completed!</h2>
          <p className="text-muted-foreground mt-2">You've submitted evidence for all available tasks. Check back later for new challenges!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((task) => {
          const taskImage = placeholderImages.find(p => p.id === task.imageId);
          return (
            <Card key={task.challenge_id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {taskImage && (
                <div className="relative w-full h-48">
                  <Image
                    src={taskImage.imageUrl}
                    alt={task.title}
                    fill
                    className="object-cover"
                    data-ai-hint={taskImage.imageHint}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{task.title}</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {task.points} PTS
                  </Badge>
                </CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Sprout className="w-4 h-4 mr-2 text-primary" />
                  <span>Category: {task.category}</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                {task.tutorialUrl && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href={task.tutorialUrl} target="_blank">
                      <Youtube className="mr-2 h-4 w-4" />
                      Watch Tutorial
                    </Link>
                  </Button>
                )}
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={`/student/submit/${task.challenge_id}`}>Complete Task</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        </div>
      )}
    </div>
  );
}
