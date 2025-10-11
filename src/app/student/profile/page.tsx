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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Leaf, Award, TrendingUp, Users } from "lucide-react";

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
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestForm, setRequestForm] = useState({ class: "", school: "" });
  const [schoolOptions, setSchoolOptions] = useState<{ id: number; name: string }[]>([]);
  const [pendingRequest, setPendingRequest] = useState<any>(null);
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
      setRequestForm({ class: p.class || "", school: p.school || "" });

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

      // Load pending school change request
      const { data: requestData, error: requestError } = await supabase
        .from("school_change_requests")
        .select("*")
        .eq("user_id", authUserId)
        .eq("status", "pending")
        .maybeSingle();

      if (!requestError && requestData) {
        setPendingRequest(requestData);
      } else {
        setPendingRequest(null);
      }
      setLoading(false);
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const avatarSeed = useMemo(() => profile?.name ?? "user", [profile?.name]);

  // Calculate achievements and progress
  const getAchievements = () => {
    const achievements = [];
    const points = stats.points || 0;
    const approved = stats.approved || 0;

    if (points >= 100) achievements.push({ name: "Eco Starter", icon: "🌱", description: "Earned 100 points" });
    if (points >= 500) achievements.push({ name: "Green Warrior", icon: "🌿", description: "Earned 500 points" });
    if (points >= 1000) achievements.push({ name: "Planet Protector", icon: "🌍", description: "Earned 1000 points" });
    if (approved >= 5) achievements.push({ name: "Consistent Contributor", icon: "⭐", description: "5 approved submissions" });
    if (approved >= 10) achievements.push({ name: "Eco Champion", icon: "🏆", description: "10 approved submissions" });
    if (stats.submissions > 0 && approved / stats.submissions >= 0.8) achievements.push({ name: "Quality Focus", icon: "🎯", description: "80% approval rate" });

    return achievements;
  };

  const getEcoImpact = () => {
    const approved = stats.approved || 0;
    // Rough estimates for environmental impact
    return {
      co2Saved: approved * 2.5, // kg of CO2 saved per approved submission
      treesEquivalent: Math.floor(approved * 2.5 / 20), // 1 tree absorbs ~20kg CO2 per year
      waterSaved: approved * 50, // liters of water saved
      energySaved: approved * 5 // kWh of energy saved
    };
  };

  const achievements = getAchievements();
  const ecoImpact = getEcoImpact();

  const handleSubmitRequest = async () => {
    if (!profile) return;
    try {
      const classValue = requestForm.class === "not-set" ? null : requestForm.class || null;
      const schoolValue = requestForm.school === "not-set" ? null : requestForm.school || null;
      const { error } = await supabase
        .from('school_change_requests')
        .insert({
          user_id: profile.user_id,
          requested_class: classValue,
          requested_school: schoolValue,
          status: 'pending'
        });
      if (error) throw error;
      setIsRequesting(false);
      setPendingRequest({ requested_class: classValue, requested_school: schoolValue, status: 'pending' });
      toast({ title: "Request submitted", description: "Your change request has been submitted for approval." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Request failed", description: error.message });
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
    setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    setCompletedCrop(null);
    setImageRef(null);
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
      // Reset the file input to allow selecting the same file again
      const input = document.getElementById('profile-photo') as HTMLInputElement;
      if (input) input.value = '';
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
            <Button variant="outline" size="sm" onClick={() => setIsRequesting(true)} disabled={!!pendingRequest}>
              {pendingRequest ? `Request Pending (${pendingRequest.status})` : 'Request Change'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="impact">Eco Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
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

              {/* Progress Tracking */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Progress Goals
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Next 100 Points</span>
                      <span>{Math.min(stats.points || 0, 100)}/100</span>
                    </div>
                    <Progress value={Math.min(((stats.points || 0) % 100), 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Approval Rate</span>
                      <span>{stats.submissions > 0 ? Math.round((stats.approved / stats.submissions) * 100) : 0}%</span>
                    </div>
                    <Progress value={stats.submissions > 0 ? (stats.approved / stats.submissions) * 100 : 0} className="h-2" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Your Achievements ({achievements.length})
                </h3>
                {achievements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No achievements yet. Keep participating to unlock badges!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <Card key={index} className="p-4 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h4 className="font-semibold text-primary">{achievement.name}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Your Environmental Impact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🌳</div>
                      <div>
                        <div className="text-2xl font-bold text-green-800">{ecoImpact.treesEquivalent}</div>
                        <div className="text-sm text-green-600">Trees Worth of CO₂ Absorbed</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">💧</div>
                      <div>
                        <div className="text-2xl font-bold text-blue-800">{ecoImpact.waterSaved.toLocaleString()}</div>
                        <div className="text-sm text-blue-600">Liters of Water Saved</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-orange-50 border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">⚡</div>
                      <div>
                        <div className="text-2xl font-bold text-orange-800">{ecoImpact.energySaved}</div>
                        <div className="text-sm text-orange-600">kWh of Energy Saved</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-red-50 border-red-200">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🌫️</div>
                      <div>
                        <div className="text-2xl font-bold text-red-800">{ecoImpact.co2Saved.toFixed(1)}</div>
                        <div className="text-sm text-red-600">kg of CO₂ Reduced</div>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Impact calculated based on approved eco-challenges completed
                </div>
              </div>
            </TabsContent>
          </Tabs>
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

      <Dialog open={isRequesting} onOpenChange={setIsRequesting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Class & School Change</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="request-class">Requested Class</Label>
              <Select value={requestForm.class} onValueChange={(value) => setRequestForm({ ...requestForm, class: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="not-set" value="not-set">Not set</SelectItem>
                  <SelectItem key="9th" value="9th">9th Grade</SelectItem>
                  <SelectItem key="10th" value="10th">10th Grade</SelectItem>
                  <SelectItem key="11th" value="11th">11th Grade</SelectItem>
                  <SelectItem key="12th" value="12th">12th Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="request-school">Requested School</Label>
              <Select value={requestForm.school} onValueChange={(value) => setRequestForm({ ...requestForm, school: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select School" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="not-set" value="not-set">Not set</SelectItem>
                  {schoolOptions.map((s) => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequesting(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
