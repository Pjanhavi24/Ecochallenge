import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { lessons } from '@/lib/data';
import { BookOpen, Clock } from 'lucide-react';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

export default function LessonsPage() {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <BookOpen className="w-10 h-10" />
          Eco Lessons
        </h1>
        <p className="text-muted-foreground mt-2">Learn, grow, and become an eco-champion!</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => {
          const lessonImage = placeholderImages.find(p => p.id === lesson.imageId);
          return (
            <Card key={lesson.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
               {lessonImage && (
                 <div className="relative w-full h-48">
                   <Image
                     src={lessonImage.imageUrl}
                     alt={lesson.title}
                     fill
                     className="object-cover"
                     data-ai-hint={lessonImage.imageHint}
                   />
                 </div>
               )}
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
                <CardDescription>{lesson.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-primary" />
                    {lesson.category}
                  </span>
                   <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-primary" />
                    {lesson.duration} min read
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={`/student/lessons/${lesson.id}`}>Start Lesson</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
