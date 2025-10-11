'use client';

import { useEffect, useState } from "react";
import type { Submission } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Eye, ThumbsDown, ThumbsUp, Sparkles } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
// API routes used instead of direct Supabase access

const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
  switch (status) {
    case 'approved':
      return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'pending':
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
};


export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        // Get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          console.error('No session found');
          return;
        }

        const response = await fetch('/api/submissions');
        if (response.ok) {
          const { submissions } = await response.json();
          // Map the data to match the component's expected format
          const mapped = submissions.map((s: any) => ({
            id: s.submission_id,
            studentName: s.users?.name || (s.user_id ? 'Student ' + s.user_id.substring(0, 8) + '…' : 'Unknown'),
            taskTitle: s.challenge?.title || 'Challenge',
            status: (s.status ?? 'pending').toLowerCase(),
            imageUrl: s.image_url || '',
            description: s.description || '',
            notes: s.notes,
            aiAnalysis: 'Auto-analysis available',
          }));
          setSubmissions(mapped);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch submissions:', response.status, errorText);
          // If it's a server error, set empty submissions
          if (response.status >= 500) {
            setSubmissions([]);
          }
        }
      } catch (error) {
        console.error('Error loading submissions:', error);
      }
    };
    load();
  }, []);

  const handleReview = (submission: Submission) => {
    setSelectedSubmission(submission);
    setFeedbackNotes(submission.notes || "");
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    const newStatus = status;

    try {
      // Ensure we have a logged-in user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        toast({ variant: 'destructive', title: 'Not signed in', description: 'Please sign in as a teacher.' });
        return;
      }
      const userId = sessionData.session.user.id;

      // Update the submission via API
      const response = await fetch('/api/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: id,
          status: newStatus,
          reviewed_by: null,  // Temporarily set to null until column is fixed
          notes: feedbackNotes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({ variant: 'destructive', title: 'Update failed', description: errorData.error || 'Failed to update submission' });
        return;
      }

      setSubmissions(submissions.map(sub =>
        sub.id === id ? { ...sub, status: status, notes: feedbackNotes } : sub
      ));
      toast({ title: `Submission ${status}`, description: `The submission has been ${status}.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Update failed', description: 'Unexpected error occurred' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Submissions</CardTitle>
        <CardDescription>Review and validate student-submitted evidence for eco-tasks.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.studentName}</TableCell>
                <TableCell>{submission.taskTitle}</TableCell>
                <TableCell>{getStatusBadge(submission.status)}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleReview(submission)}>
                        <Eye className="mr-2 h-4 w-4"/> Review
                      </Button>
                    </DialogTrigger>
                    {selectedSubmission && selectedSubmission.id == submission.id && (
                      <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Review Submission: {submission.taskTitle}</DialogTitle>
                          <DialogDescription>By {submission.studentName}</DialogDescription>
                        </DialogHeader>
                        <div className="grid md:grid-cols-2 gap-6 py-4">
                          <div className="space-y-4">
                             <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                {submission.imageUrl ? (
                                  <Image src={submission.imageUrl} alt={`Submission for ${submission.taskTitle}`} fill className="object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No image</div>
                                )}
                             </div>
                             <div>
                              <h4 className="font-semibold">Student's Description</h4>
                              <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-md mt-1">{submission.description}</p>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                                <h4 className="font-semibold text-accent flex items-center gap-2"><Sparkles className="h-5 w-5"/> AI-Powered Analysis</h4>
                                <p className="text-sm text-accent-foreground/80 mt-2">{submission.aiAnalysis}</p>
                             </div>
                             <div>
                              <h4 className="font-semibold">Feedback Notes (Optional)</h4>
                              <Textarea
                                placeholder="Provide feedback to the student..."
                                value={feedbackNotes}
                                onChange={(e) => setFeedbackNotes(e.target.value)}
                              />
                             </div>
                          </div>
                        </div>
                        <DialogFooter className="sm:justify-between">
                          <div className="flex gap-2">
                             <DialogClose asChild>
                               <Button variant="destructive" onClick={() => handleStatusUpdate(submission.id, 'rejected')}>
                                 <ThumbsDown className="mr-2 h-4 w-4" /> Reject
                               </Button>
                             </DialogClose>
                             <DialogClose asChild>
                               <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(submission.id, 'approved')}>
                                 <ThumbsUp className="mr-2 h-4 w-4" /> Approve
                               </Button>
                             </DialogClose>
                          </div>
                           <DialogClose asChild>
                              <Button type="button" variant="secondary">Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
