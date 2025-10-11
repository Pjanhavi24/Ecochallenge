"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Sprout, Star, Youtube, Filter, Target } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { placeholderImages } from '@/lib/placeholder-images';
import Earth3D from '@/components/Earth3D';

export default function TaskFeed() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const categories = useMemo(() => {
    const CHALLENGE_CATEGORIES = [
      'Biodiversity',
      'Waste Management',
      'Energy Conservation',
      'Water Conservation',
      'Plastic Reduction',
      'Community',
      'Festival Eco-Challenge',
      'Air Quality',
      'Climate Change',
      'Soil Management',
      'Forestry',
      'Marine Conservation',
      'Lifestyle',
      'Policy',
      'Cultural Learning',
      'Personal Development'
    ];
    return ['all', ...CHALLENGE_CATEGORIES];
  }, []);

  const filteredChallenges = useMemo(() => {
    if (selectedCategory === 'all') return challenges;
    return challenges.filter(c => c.category === selectedCategory);
  }, [selectedCategory, challenges]);

  useEffect(() => {
    setVisibleCards(new Set());
  }, [selectedCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setTimeout(() => {
                setVisibleCards((prev) => new Set([...prev, index]));
              }, index * 100);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredChallenges]);

  return (
    <>
      <Earth3D />
      <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-6 shadow-lg">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-300 dark:to-blue-300 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            Active Tasks
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow-md">
            Complete these available tasks, earn points, and save the planet! Take action and make a difference.
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-muted-foreground">All tasks completed!</h2>
            <p className="text-muted-foreground mt-2">You've submitted evidence for all available tasks. Check back later for new challenges!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
            {filteredChallenges.map((task, index) => {
             const taskImage = placeholderImages.find(p => p.id === task.imageId);
             const isVisible = visibleCards.has(index);
             return (
               <Card
                 key={task.challenge_id}
                 ref={(el) => { cardRefs.current[index] = el; }}
                 className={`group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 ease-out transform ${
                   isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
                 } bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-900 shadow-xl`}
               >
                 {taskImage && (
                   <div className="relative w-full h-48 overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 z-10" />
                     <Image
                       src={taskImage.imageUrl}
                       alt={task.title}
                       fill
                       className="object-cover group-hover:scale-105 transition-transform duration-500"
                       data-ai-hint={taskImage.imageHint}
                     />
                   </div>
                 )}
                 <div className="p-6">
                   <div className="flex items-start justify-between mb-4">
                     <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border border-green-200 dark:border-green-700">
                       {task.category}
                     </Badge>
                     <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700">
                       <Star className="w-4 h-4 text-yellow-500" />
                       {task.points} PTS
                     </Badge>
                   </div>
                   <CardTitle className="text-xl mb-3 text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                     {task.title}
                   </CardTitle>
                   <CardDescription className="text-sm mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
                     {task.description}
                   </CardDescription>
                   <div className="flex gap-2">
                     {task.tutorialUrl && (
                       <Button asChild variant="outline" className="flex-1">
                         <Link href={task.tutorialUrl} target="_blank">
                           <Youtube className="mr-2 h-4 w-4" />
                           Tutorial
                         </Link>
                       </Button>
                     )}
                     <Button asChild className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                       <Link href={`/student/submit/${task.challenge_id}`}>Complete Task</Link>
                     </Button>
                   </div>
                 </div>
               </Card>
             );
           })}
           </div>
         )}
       </div>
     </div>
   </>
 );
}
