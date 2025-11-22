import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { MessageCircle, Send, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios'; // Pastikan axios diimport

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
    isError?: boolean; // Tambahan untuk handling error visual
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: 'Halo! Saya adalah asisten AI Anda. Saya bisa membantu mengatur jadwal kuliah, tugas, dan kegiatan organisasi. Ada yang bisa saya bantu?',
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Ref untuk auto-scroll ke bawah saat ada pesan baru
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input;
        setInput(''); // Kosongkan input segera
        setIsLoading(true);

        // 1. Tampilkan pesan user di UI
        const userMessage: Message = {
            id: Date.now(), // Gunakan timestamp agar ID unik
            text: userText,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            // 2. Kirim request ke Backend Laravel (/chat/send)
            // Laravel akan meneruskan ke FastAPI -> Gemini -> Database RAG
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await axios.post('/chat/send', {
                message: userText
            }, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            // 3. Tampilkan balasan AI
            const aiMessage: Message = {
                id: Date.now() + 1,
                text: response.data.reply || 'Maaf, saya tidak mendapatkan respon.',
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
            
            // Tampilkan pesan error jika gagal
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: 'Maaf, terjadi kesalahan saat menghubungi server AI. Pastikan service Python (FastAPI) sudah berjalan.',
                sender: 'ai',
                timestamp: new Date(),
                isError: true,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
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
            <div className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-64px)]"> {/* Set height agar bisa scroll */}
                <div className="mb-2">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
                        <MessageCircle className="h-10 w-10" />
                        Chat dengan AI
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Tanyakan tentang jadwal kuliah, tugas, atau organisasi Anda.
                    </p>
                </div>

                <Card className="flex-1 flex flex-col overflow-hidden shadow-lg border-t-4 border-t-primary">
                    <CardHeader className="bg-muted/20 pb-4">
                        <CardTitle className="flex items-center gap-2">
                            Asisten Akademik
                            <span className="text-xs font-normal px-2 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">
                                Online
                            </span>
                        </CardTitle>
                        <CardDescription>
                            Didukung oleh Gemini AI & Data Akademik Anda
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                        {/* Area Chat Scrollable */}
                        <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
                            <div className="space-y-6">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[85%] lg:max-w-[75%] rounded-2xl px-6 py-4 shadow-sm ${
                                                message.sender === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : message.isError 
                                                        ? 'bg-red-100 text-red-800 border border-red-200 rounded-tl-none'
                                                        : 'bg-white dark:bg-muted border border-slate-100 dark:border-slate-800 text-foreground rounded-tl-none'
                                            }`}
                                        >
                                            {/* Markdown-like rendering untuk list */}
                                            <div className="text-base leading-relaxed whitespace-pre-wrap">
                                                {message.isError && <AlertCircle className="w-5 h-5 inline mr-2 -mt-1" />}
                                                {message.text}
                                            </div>
                                            <p className={`text-xs mt-2 ${
                                                message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                                            } text-right`}>
                                                {message.timestamp.toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Loading Indicator */}
                                {isLoading && (
                                    <div className="flex justify-start animate-pulse">
                                        <div className="bg-muted/50 text-muted-foreground rounded-2xl rounded-tl-none px-6 py-4 max-w-[80%] border border-transparent">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce"></div>
                                                    <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                                <span className="text-sm font-medium">Sedang menganalisis data Anda...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-background border-t">
                            <div className="flex gap-3 max-w-5xl mx-auto">
                                <Input
                                    placeholder="Contoh: Kapan deadline tugas saya yang paling dekat?"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    disabled={isLoading}
                                    className="flex-1 text-base py-6 shadow-sm focus-visible:ring-primary"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isLoading}
                                    size="lg"
                                    className="h-auto px-6 shadow-md hover:shadow-lg transition-all"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-center text-xs text-muted-foreground mt-2">
                                AI dapat membuat kesalahan. Mohon periksa kembali informasi penting.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}