'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { lessons } from '@/lib/data';
import { BookOpen, Clock, Play, Filter } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';
import { useEffect, useRef, useState, useMemo } from 'react';
import Earth3D from '@/components/Earth3D';

export default function LessonsPage() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const categories = useMemo(() => {
    const LESSON_CATEGORIES = [
      'Waste Management',
      'Biodiversity',
      'Water Conservation',
      'Climate Change',
      'Plastic Reduction',
      'Community',
      'Air Quality',
      'Energy Conservation',
      'Wildlife Conservation',
      'Soil Management',
      'Forestry',
      'Marine Conservation',
      'Sustainable Living',
      'Environmental Impact Assessment',
      'Festival Eco-Challenge',
      'Personal Development',
      'Cultural Learning'
    ];
    return ['all', ...LESSON_CATEGORIES];
  }, []);

  const filteredLessons = useMemo(() => {
    if (selectedCategory === 'all') return lessons;
    return lessons.filter(l => l.category === selectedCategory);
  }, [selectedCategory]);

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
              }, index * 100); // Stagger by 100ms
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
  }, []);

  return (
    <>
      <Earth3D />
      <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
            Eco Lessons
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Embark on a journey of discovery. Learn, grow, and become an eco-champion through interactive lessons designed to inspire change.
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
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

        <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          {filteredLessons.map((lesson, index) => {
            const lessonImage = placeholderImages.find(p => p.id === lesson.imageId);
            const isVisible = visibleCards.has(index);
            return (
              <Card
                key={lesson.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className={`group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 ease-out transform ${
                  isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
                } bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 hover:bg-white dark:hover:bg-gray-900`}
              >
                {lessonImage && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 z-10" />
                    <Image
                      src={lessonImage.imageUrl}
                      alt={lesson.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      data-ai-hint={lessonImage.imageHint}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      {lesson.category}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {lesson.duration} min
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="text-sm mb-6 leading-relaxed">
                    {lesson.summary}
                  </CardDescription>
                  <Button asChild className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Link href={`/student/lessons/${lesson.id}`} className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Start Lesson
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}
