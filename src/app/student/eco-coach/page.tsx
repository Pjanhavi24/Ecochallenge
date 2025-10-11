'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Sparkles, User, Bot, Trash2, BookText, SpellCheck, Languages, PenSquare, FileEdit, Mic } from 'lucide-react';
import { askEcoCoach, askTeacherBot } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type FormValues = z.infer<typeof formSchema>;

type Message = {
  role: 'user' | 'model';
  content: string;
};

type BotMode = 'eco' | 'teacher';

// SpeechRecognition type might not be on the window object by default
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function EcoCoachPage() {
  const [ecoMessages, setEcoMessages] = useState<Message[]>([]);
  const [teacherMessages, setTeacherMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [botMode, setBotMode] = useState<BotMode>('eco');
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const messages = botMode === 'eco' ? ecoMessages : teacherMessages;
  const setMessages = botMode === 'eco' ? setEcoMessages : setTeacherMessages;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableView = scrollAreaRef.current.querySelector('div');
      if (scrollableView) {
        scrollableView.scrollTop = scrollableView.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const clearChat = () => {
    setMessages([]);
  };

  const onSubmit = async (data: FormValues) => {
    const userMessage: Message = { role: 'user', content: data.message };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    form.reset();

    const history = messages.map((msg) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    try {
      const response = botMode === 'eco' ? await askEcoCoach(history, data.message) : await askTeacherBot(history, data.message);
      setMessages((prev) => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      console.error('Error streaming response:', error);
      const errorMessage = 'Sorry, I had trouble connecting. Please try again.';
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1].role === 'model') {
           newMessages[newMessages.length - 1].content = errorMessage;
        } else {
           newMessages.push({ role: 'model', content: errorMessage });
        }
        return newMessages;
      });
    } finally {
      setIsStreaming(false);
    }
  };
  
  const handleToolClick = async (tool: 'summarize' | 'grammar' | 'translate' | 'write' | 'rewrite') => {
    const messageContent = form.getValues('message');
    if (!messageContent) return;

    let command = '';
    switch(tool) {
        case 'summarize':
            command = 'Summarize the following: ';
            break;
        case 'grammar':
            command = 'Check the grammar of the following: ';
            break;
        case 'translate':
            command = 'Translate the following text to your preferred language: ';
            break;
        case 'write':
            command = 'Write original and engaging text about the following topic: ';
            break;
        case 'rewrite':
            command = 'Improve the following content with alternative options: ';
            break;
    }
    
    const fullMessage = command + `\n\n"${messageContent}"`;

    const userMessage: Message = { role: 'user', content: fullMessage };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    form.reset();

    const history = messages.map((msg) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    try {
      const response = await askTeacherBot(history, fullMessage);
      setMessages((prev) => [...prev, { role: 'model', content: response }]);
    } catch (error) {
       console.error('Error getting response:', error);
       const errorMessage = 'Sorry, I had trouble connecting. Please try again.';
       setMessages((prev) => [...prev, { role: 'model', content: errorMessage }]);
    } finally {
        setIsStreaming(false);
    }
  }

  const handleMicClick = () => {
    if (!window.isSecureContext) {
      toast({
        variant: 'destructive',
        title: 'Secure Context Required',
        description: 'Speech recognition requires a secure connection (HTTPS). Please access the site via HTTPS.',
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Speech recognition is not supported in your browser.',
      });
      return;
    }

    if (!recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            form.setValue('message', transcript);
        };

        recognition.onerror = (event: any) => {
            let description = `Could not recognize speech. Error: ${event.error}`;
            if (event.error === 'network') {
                description = "Speech recognition failed due to a network issue. This can happen in restricted environments or with a poor connection.";
            } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
           
                description = "Microphone access was denied. Please allow microphone access in your browser settings to use this feature.";
            }

            toast({
                variant: 'destructive',
                title: 'Speech Recognition Error',
                description,
            });
            setIsRecording(false);
        };
        recognitionRef.current = recognition;
    }


    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl h-[calc(100vh-10rem)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="relative">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                variant={botMode === 'eco' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBotMode('eco')}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Eco-Coach
              </Button>
              <Button
                variant={botMode === 'teacher' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBotMode('teacher')}
                className="flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Teacher Bot
              </Button>
            </div>
            <CardTitle className="flex items-center justify-center gap-2 text-3xl">
              <Sparkles className="w-8 h-8 text-primary" />
              {botMode === 'eco' ? 'AI Eco-Coach' : 'AI Teacher Bot'}
            </CardTitle>
            <CardDescription>
              {botMode === 'eco'
                ? 'Ask me anything about ecology, conservation, and sustainability!'
                : 'Ask me anything about academic subjects and get help with your studies!'
              }
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="absolute top-4 right-4 h-8 w-8 p-0"
            disabled={messages.length === 0}
          >
            <Trash2 className="w-3 h-3" />
            <span className="sr-only">Clear Chat</span>
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4 h-full overflow-y-auto" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {message.role === 'model' && (
                    <Avatar className="w-8 h-8 border-2 border-primary">
                      <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn('max-w-[75%] rounded-lg p-3 text-sm whitespace-pre-wrap', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                    <p>{message.content}</p>
                  </div>
                   {message.role === 'user' && (
                    <Avatar className="w-8 h-8">
                       <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isStreaming && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex items-start gap-3 justify-start">
                     <Avatar className="w-8 h-8 border-2 border-primary">
                      <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                     <div className="bg-secondary rounded-lg p-3 flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                     </div>
                  </div>
               )}
            </div>
          </ScrollArea>
          <div className="mt-auto pt-4">
            {botMode === 'teacher' && (
                <div className="flex flex-wrap gap-2 mb-2">
                    <Button variant="outline" size="sm" onClick={() => handleToolClick('summarize')} disabled={isStreaming || !form.watch('message')}>
                        <BookText className="mr-2 h-4 w-4" /> Summarize
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToolClick('grammar')} disabled={isStreaming || !form.watch('message')}>
                        <SpellCheck className="mr-2 h-4 w-4" /> Check Grammar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToolClick('translate')} disabled={isStreaming || !form.watch('message')}>
                        <Languages className="mr-2 h-4 w-4" /> Translate
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToolClick('write')} disabled={isStreaming || !form.watch('message')}>
                        <PenSquare className="mr-2 h-4 w-4" /> Write
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToolClick('rewrite')} disabled={isStreaming || !form.watch('message')}>
                        <FileEdit className="mr-2 h-4 w-4" /> Rewrite
                    </Button>
                </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Ask about composting, saving water, etc." {...field} disabled={isStreaming} autoComplete="off"/>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isStreaming || !form.watch('message')} size="icon">
                  {isStreaming ? <Loader2 className="animate-spin" /> : <Send />}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    