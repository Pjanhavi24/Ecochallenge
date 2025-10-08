'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Challenge {
  challenge_id: string;
  title: string;
  description: string;
  category: string;
  points: number;
  image_url?: string;
  tutorial_url?: string;
  created_at: string;
}

export default function TaskManagementPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', category: '', points: '' });
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges');
      const data = await response.json();
      setChallenges(data.challenges || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load challenges.' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (editingChallenge) {
      setEditingChallenge({ ...editingChallenge, [id]: value });
    } else {
      setNewChallenge({ ...newChallenge, [id]: value });
    }
  };

  const handleCreateOrUpdateChallenge = async () => {
    try {
      const formData = editingChallenge || newChallenge;
      const method = editingChallenge ? 'PUT' : 'POST';
      const body = editingChallenge
        ? { ...editingChallenge, challenge_id: editingChallenge.challenge_id }
        : formData;

      const response = await fetch('/api/challenges', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('API response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.error || `Failed to save challenge (${response.status})`);
      }

      toast({
        title: editingChallenge ? "Challenge Updated" : "Challenge Created",
        description: `"${formData.title}" has been ${editingChallenge ? 'updated' : 'added'}.`
      });

      setNewChallenge({ title: '', description: '', category: '', points: '' });
      setEditingChallenge(null);
      fetchChallenges(); // Refresh the list
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save challenge.' });
    }
  };

  const handleDeleteChallenge = async (challenge_id: string) => {
    try {
      const response = await fetch(`/api/challenges?challenge_id=${challenge_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete challenge');
      }

      const challengeToDelete = challenges.find(c => c.challenge_id === challenge_id);
      toast({
        variant: 'destructive',
        title: "Challenge Deleted",
        description: `"${challengeToDelete?.title}" has been removed.`,
      });
      fetchChallenges(); // Refresh the list
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete challenge.' });
    }
  };

  const handleEditClick = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingChallenge(null);
  }

  const currentForm = editingChallenge || newChallenge;
  const isFormValid = currentForm.title && currentForm.description && currentForm.category && currentForm.points;


  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>{editingChallenge ? "Edit Challenge" : "Create New Challenge"}</CardTitle>
            <CardDescription>{editingChallenge ? "Modify the details of this challenge." : "Design a new challenge for your students."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Challenge Title</Label>
              <Input id="title" placeholder="e.g., Community Cleanup" value={currentForm.title} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the challenge for students." value={currentForm.description} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g., Waste Management" value={currentForm.category} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Eco-Points</Label>
              <Input id="points" type="number" placeholder="e.g., 100" value={currentForm.points} onChange={handleInputChange} />
            </div>
            <div className="flex gap-2">
              {editingChallenge && <Button variant="secondary" onClick={handleCancelEdit} className="w-full">Cancel</Button>}
              <Button onClick={handleCreateOrUpdateChallenge} disabled={!isFormValid} className="w-full">
                {editingChallenge ? "Save Changes" : "Create Challenge"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Challenges</CardTitle>
            <CardDescription>A list of all currently available challenges.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                 <TableHeader>
                     <TableRow>
                     <TableHead>Title</TableHead>
                     <TableHead>Category</TableHead>
                     <TableHead>Points</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                     </TableRow>
                 </TableHeader>
                 <TableBody>
                     {challenges.map((challenge) => (
                     <TableRow key={challenge.challenge_id}>
                         <TableCell className="font-medium">{challenge.title}</TableCell>
                         <TableCell>{challenge.category}</TableCell>
                         <TableCell>{challenge.points}</TableCell>
                         <TableCell className="text-right space-x-2">
                             <Button variant="ghost" size="icon" onClick={() => handleEditClick(challenge)}>
                                 <Edit className="h-4 w-4" />
                             </Button>
                             <AlertDialog>
                               <AlertDialogTrigger asChild>
                                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                   <Trash2 className="h-4 w-4" />
                                 </Button>
                               </AlertDialogTrigger>
                               <AlertDialogContent>
                                 <AlertDialogHeader>
                                   <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                   <AlertDialogDescription>
                                     This action cannot be undone. This will permanently delete the challenge "{challenge.title}".
                                   </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                                   <AlertDialogAction onClick={() => handleDeleteChallenge(challenge.challenge_id)} className="bg-destructive hover:bg-destructive/90">
                                     Delete
                                   </AlertDialogAction>
                                 </AlertDialogFooter>
                               </AlertDialogContent>
                             </AlertDialog>
                         </TableCell>
                     </TableRow>
                     ))}
                 </TableBody>
                 </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
