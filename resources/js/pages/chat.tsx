import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chat dengan AI',
        href: '/chat',
    },
];

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'Halo! Saya adalah asisten AI Anda. Ada yang bisa saya bantu?',
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: messages.length + 1,
            text: input,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate AI response (replace with actual AI integration)
        setTimeout(() => {
            const aiMessage: Message = {
                id: messages.length + 2,
                text: 'Terima kasih atas pesan Anda. Saya sedang memproses permintaan Anda...',
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat dengan AI" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
                        <MessageCircle className="h-10 w-10" />
                        Chat dengan AI
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Tanyakan apa saja kepada asisten AI Anda.
                    </p>
                </div>

                <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Obrolan</CardTitle>
                        <CardDescription>
                            Mulai percakapan dengan AI
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-0">
                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg px-6 py-3 ${
                                                message.sender === 'user'
                                                    ? 'bg-primary text-primary-foreground font-bold'
                                                    : 'bg-muted text-muted-foreground font-bold'
                                            }`}
                                        >
                                            <p className="text-base">{message.text}</p>
                                            <p className="text-sm opacity-80 mt-1">
                                                {message.timestamp.toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted text-muted-foreground rounded-lg px-6 py-3 max-w-[80%]">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    <div className="w-3 h-3 bg-current rounded-full animate-bounce"></div>
                                                    <div className="w-3 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-3 h-3 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                                <span className="text-base font-bold">AI sedang mengetik...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="border-t p-6">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Ketik pesan Anda..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isLoading}
                                    className="flex-1 text-lg py-3"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isLoading}
                                    size="lg"
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
