import { lessons } from '@/lib/data';
import { notFound } from 'next/navigation';
import LessonDetailPageContent from './content';

export default async function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = lessons.find(l => l.id.toString() === id);

  if (!lesson) {
    notFound();
  }

  return <LessonDetailPageContent lesson={lesson} />;
}
