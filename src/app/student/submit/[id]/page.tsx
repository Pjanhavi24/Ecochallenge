'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { tasks } from '@/lib/data';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { handleEvidenceSubmission } from './actions';
import Image from 'next/image';
import { supabase } from "@/lib/supabaseClient";

const formSchema = z.object({
  description: z.string().min(10, "Please provide a more detailed description.").max(500),
  photo: z.any().refine(file => file?.length == 1, "A photo is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SubmitEvidencePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { toast } = useToast();
  const [challenge, setChallenge] = useState<any | null>(null);
  const params = useParams();
  const router = useRouter();
  const id = typeof (params as any).id === 'string' ? (params as any).id : Array.isArray((params as any).id) ? (params as any).id[0] : '';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      photo: undefined,
    }
  });

  // Load challenge by UUID from Supabase
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('challenge_id', id)
        .maybeSingle();
      if (!isMounted) return;
      if (error || !data) {
        toast({ variant: 'destructive', title: 'Challenge not found', description: 'Returning to tasks.' });
        router.push('/student/tasks');
        return;
      }
      setChallenge(data);
    })();
    return () => {
      isMounted = false;
    };
  }, [id, router, toast]);
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setAnalysisResult(null);

    const file = data.photo[0];
    if (file.size > 4 * 1024 * 1024) { // 4MB limit for GenAI
        toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload an image smaller than 4MB.",
        });
        setIsSubmitting(false);
        return;
    }

    try {
      if (!challenge) {
        throw new Error('Challenge not loaded yet. Please wait and try again.');
      }
      // Get current user id for submission
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        throw new Error('You must be logged in.');
      }
      const studentId = session.user.id;

      const result = await handleEvidenceSubmission({
        description: data.description,
        photoDataUri: preview as string,
        studentId,
        challengeId: id,
      } as any);
      if (result.error) {
        throw new Error(result.error);
      }
      setAnalysisResult(result.analysis || 'Analysis complete.');
      toast({
        title: "Submission Successful!",
        description: "Your evidence has been submitted for review.",
        className: "bg-primary text-primary-foreground",
      });
      form.reset();
      setPreview(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setPreview(null);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
          <CardHeader>
          <CardTitle>Submit Evidence for: {challenge?.title ?? '...'}</CardTitle>
          <CardDescription>Upload a photo and describe your activity to earn {challenge?.points ?? '...'} points.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Photo Evidence</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handlePhotoChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {preview && (
                      <div className="mt-4 relative w-full h-64 rounded-md overflow-hidden border">
                        <Image src={preview} alt="Image preview" fill style={{ objectFit: 'contain' }} />
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I planted a mango sapling in my grandma's garden today!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting || !challenge}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting & Analyzing...
                  </>
                ) : (
                  "Submit for Points"
                )}
              </Button>
            </form>
          </Form>

          {analysisResult && (
             <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Automated Analysis Result
                </h4>
                <p className="mt-2 text-sm">{analysisResult}</p>
                <p className="mt-3 text-xs text-muted-foreground">A teacher will review this analysis and your submission to award points.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}