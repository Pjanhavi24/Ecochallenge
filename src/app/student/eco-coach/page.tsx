'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Sparkles, User, Bot } from 'lucide-react';
import { askEcoCoach } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type FormValues = z.infer<typeof formSchema>;

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

export default function EcoCoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  const onSubmit = async (data: FormValues) => {
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: data.message };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    form.reset();

    // Prepare history for the API call
    const history = messages.map((msg) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    try {
      const stream = await askEcoCoach(history, data.message);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';
      
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'model', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = accumulatedResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      const errorMessage = 'Sorry, I had trouble connecting. Please try again.';
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1].role === 'model') {
           newMessages[newMessages.length - 1].content = errorMessage;
        } else {
           newMessages.push({ id: crypto.randomUUID(), role: 'model', content: errorMessage });
        }
        return newMessages;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl h-[calc(100vh-10rem)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-3xl">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Eco-Coach
          </CardTitle>
          <CardDescription>Ask me anything about ecology, conservation, and sustainability!</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {message.role === 'model' && (
                    <Avatar className="w-8 h-8 border-2 border-primary">
                      <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn('max-w-[75%] rounded-lg p-3 text-sm', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                    <p>{message.content}</p>
                  </div>
                   {message.role === 'user' && (
                    <Avatar className="w-8 h-8">
                       <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isStreaming && messages[messages.length - 1].role === 'user' && (
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
                <Button type="submit" disabled={isStreaming} size="icon">
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
