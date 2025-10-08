'use client';

import type { Lesson } from '@/lib/types';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function LessonDetailPageContent({ lesson }: { lesson: Lesson }) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);
  const { toast } = useToast();

  const quiz = lesson.quiz[0]; // Assuming one question per lesson for simplicity

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnswer) {
      toast({
        variant: 'destructive',
        title: 'No answer selected',
        description: 'Please choose an option before submitting.',
      });
      return;
    }

    if (selectedAnswer === quiz.answer) {
      setQuizResult('correct');
      toast({
        title: 'Correct!',
        description: 'Great job! You earned 20 points.',
        className: 'bg-primary text-primary-foreground',
      });
    } else {
      setQuizResult('incorrect');
      toast({
        variant: 'destructive',
        title: 'Not quite!',
        description: 'Try again. The correct answer is highlighted.',
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary">{lesson.title}</h1>
          <p className="text-muted-foreground mt-2">{lesson.summary}</p>
        </header>

        {lesson.videoUrl && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center text-primary hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold">Watch Video on YouTube</p>
                  <p className="text-sm text-muted-foreground">Click to open in new tab</p>
                </div>
              </a>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardContent className="prose dark:prose-invert max-w-none p-6 text-lg">
            {lesson.content}
          </CardContent>
        </Card>

        <Separator className="my-12" />

        <Card>
          <CardHeader>
            <CardTitle>Quick Quiz!</CardTitle>
            <CardDescription>Test your knowledge and earn extra points.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuizSubmit}>
              <div className="space-y-4">
                <p className="font-semibold">{quiz.question}</p>
                <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer || ''}>
                  {quiz.options.map((option) => {
                    const isCorrect = option === quiz.answer;
                    const isSelected = option === selectedAnswer;
                    
                    let itemClass = "";
                    if (quizResult && isCorrect) itemClass = "bg-green-100 dark:bg-green-900/30 border-green-500";
                    if (quizResult === 'incorrect' && isSelected) itemClass = "bg-red-100 dark:bg-red-900/30 border-red-500";
                    
                    return (
                      <Label
                        key={option}
                        className={`flex items-center space-x-3 p-4 rounded-md border transition-all ${itemClass}`}
                      >
                        <RadioGroupItem value={option} id={option} />
                        <span>{option}</span>
                         {quizResult === 'correct' && isSelected && isCorrect && <CheckCircle className="ml-auto h-5 w-5 text-green-600" />}
                         {quizResult === 'incorrect' && isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-600" />}
                      </Label>
                    );
                  })}
                </RadioGroup>
                <Button type="submit" disabled={!!quizResult} className="w-full">
                  {quizResult ? 'Answer Submitted' : 'Submit Answer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
