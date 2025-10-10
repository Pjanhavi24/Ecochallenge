"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Profile = {
  user_id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  points?: number;
  profile_image_url?: string;
  class?: string;
  school?: string;
};

type Submission = {
  submission_id: string;
  challenge: { title: string };
  status: string;
  created_at: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string>("");
  const [stats, setStats] = useState<{ points: number; submissions: number; approved: number }>({ points: 0, submissions: 0, approved: 0 });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ class: "", school: "" });
  const [schoolOptions, setSchoolOptions] = useState<{ id: number; name: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSchools() {
      try {
        const res = await fetch('/api/schools?limit=1000')
        const data = await res.json()
        const schools = (data.schools ?? []).map((s: any) => ({ id: s.id, name: s.name }))
        setSchoolOptions(schools)
      } catch (e) {
        setSchoolOptions([])
      }
    }
    loadSchools()
  }, [])

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError("");
      // Check session
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        router.replace("/login");
        return;
      }

      const authUserId = session.user.id;

      // Fetch profile - select only columns that exist in your users table
      const { data: profileRow, error: profileError } = await supabase
        .from("users")
        .select("user_id,name,email,role,points,profile_image_url,class,school")
        .eq("user_id", authUserId)
        .single();

      if (profileError) {
        if (!isMounted) return;
        setError(profileError.message);
        setLoading(false);
        return;
      }

      if (!isMounted) return;
      const p = profileRow as Profile;
      setProfile(p);
      setEditForm({ class: p.class || "", school: p.school || "" });

      // Load submission stats and list (if table exists)
      const { data: subs, error: subsError } = await supabase
        .from("submissions")
        .select("status, submission_id, challenge:challenges(title), created_at")
        .eq("user_id", authUserId);

      if (!subsError && Array.isArray(subs)) {
        const submissionsCount = subs.length;
        const approved = subs.filter((s: any) => (s.status ?? '').toLowerCase() === 'approved').length;
        setStats({ points: (p.points ?? 0) as number, submissions: submissionsCount, approved });
        setSubmissions(subs as unknown as Submission[]);
      } else {
        setStats({ points: (p.points ?? 0) as number, submissions: 0, approved: 0 });
        setSubmissions([]);
      }
      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const avatarSeed = useMemo(() => profile?.name ?? "user", [profile?.name]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from('users')
        .update({ class: editForm.class || null, school: editForm.school || null })
        .eq('user_id', profile.user_id);
      if (error) throw error;
      setProfile(prev => prev ? { ...prev, class: editForm.class || undefined, school: editForm.school || undefined } : null);
      setIsEditing(false);
      toast({ title: "Profile updated", description: "Your class and school have been updated." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
      });
      return;
    }

    setSelectedFile(file);
    setCropModalOpen(true);
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imageRef || !selectedFile) return;

    setUploading(true);
    setCropModalOpen(false);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      const scaleX = imageRef.naturalWidth / imageRef.width;
      const scaleY = imageRef.naturalHeight / imageRef.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      ctx.drawImage(
        imageRef,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );

      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Failed to create blob');

        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${profile?.user_id}_${Date.now()}.${fileExt}`;
        const filePath = `profile-photos/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('student_and_teachers_pfp')
          .upload(filePath, blob);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('student_and_teachers_pfp')
          .getPublicUrl(filePath);

        const publicUrl = data.publicUrl;

        // Update user profile
        const { error: updateError } = await supabase
          .from('users')
          .update({ profile_image_url: publicUrl })
          .eq('user_id', profile?.user_id);

        if (updateError) throw updateError;

        // Update local state
        setProfile(prev => prev ? { ...prev, profile_image_url: publicUrl } : null);

        toast({
          title: "Profile photo updated",
          description: "Your profile photo has been successfully updated.",
        });
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload profile photo. Please try again.",
      });
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setCompletedCrop(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Loading profile...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
            <AvatarImage
              src={profile.profile_image_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${avatarSeed}`}
              alt={profile.name}
              style={{ objectFit: 'contain' }}
            />
            <AvatarFallback>{profile.name?.charAt(0) ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="mb-4">
            <Button
              variant="outline"
              disabled={uploading}
              onClick={() => document.getElementById('profile-photo')?.click()}
            >
              {uploading ? "Uploading..." : "Change Profile Photo"}
            </Button>
            <Input
              id="profile-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>
          <CardTitle className="text-3xl">{profile.name}</CardTitle>
          <CardDescription>{profile.email}</CardDescription>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Class:</span>
              <span className="text-sm">{profile.class || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">School:</span>
              <span className="text-sm">{profile.school || "Not set"}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit Class & School
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
              <div className="text-sm text-emerald-800">Points</div>
              <div className="text-2xl font-bold text-emerald-900">{stats.points?.toLocaleString?.() ?? stats.points}</div>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-center">
              <div className="text-sm text-blue-800">Submissions</div>
              <div className="text-2xl font-bold text-blue-900">{stats.submissions}</div>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-center">
              <div className="text-sm text-amber-800">Approved</div>
              <div className="text-2xl font-bold text-amber-900">{stats.approved}</div>
            </div>
          </div>
          <div className="mt-6">
            <Collapsible open={showSubmissions} onOpenChange={setShowSubmissions}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  {showSubmissions ? 'Hide' : 'Show'} My Submissions ({stats.submissions})
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-2">
                {submissions.length === 0 ? (
                  <p className="text-muted-foreground">No submissions yet.</p>
                ) : (
                  submissions.map((sub) => (
                    <Card key={sub.submission_id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{sub.challenge?.title || 'Unknown Challenge'}</h4>
                          <p className="text-sm text-muted-foreground">
                            Submitted on {new Date(sub.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={sub.status === 'approved' ? 'default' : sub.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {sub.status}
                        </Badge>
                      </div>
                    </Card>
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>

      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Your Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedFile && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
              >
                <img
                  ref={(ref) => setImageRef(ref)}
                  src={URL.createObjectURL(selectedFile)}
                  alt="Crop preview"
                  style={{ maxHeight: '400px' }}
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCropComplete} disabled={!completedCrop}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class & School</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-class">Class</Label>
              <Select value={editForm.class} onValueChange={(value) => setEditForm({ ...editForm, class: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Not set</SelectItem>
                  <SelectItem value="9th">9th Grade</SelectItem>
                  <SelectItem value="10th">10th Grade</SelectItem>
                  <SelectItem value="11th">11th Grade</SelectItem>
                  <SelectItem value="12th">12th Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-school">School</Label>
              <Select value={editForm.school} onValueChange={(value) => setEditForm({ ...editForm, school: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select School" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Not set</SelectItem>
                  {schoolOptions.map((s) => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
