import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bird, Send, User, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";

const SupportPage = () => {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Welcome to Treasure Trove! I'm Pippy the Parrot. How can I help you today with trading goods on uncharted waters?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            setMessages(prev => [...prev, {
                role: "assistant",
                content: data.message
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I apologize, but I encountered an error. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex items-center justify-center h-[80vh] bg-gradient-to-br from-blue-50 to-purple-50">
            <Card className="w-full max-w-4xl h-[70vh] flex flex-col shadow-lg border-0">
                <CardContent className="flex flex-col h-full p-0">
                    <div className="flex items-center space-x-3 p-6 bg-black rounded-t-xl">
                        <Avatar className="w-12 h-12 ring-2 ring-primary/20 ring-offset-2">
                            <AvatarFallback className="bg-primary/20">
                                <Bird className="w-6 h-6 text-white" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold bg-white bg-clip-text text-transparent">
                                Pippy Support
                            </h2>
                            <p className="text-sm text-muted-foreground text-white">Always here to help</p>
                        </div>
                    </div>

                    <Separator />

                    <ScrollArea className="flex-1 px-6">
                        <div className="space-y-6 py-6">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className="flex items-start max-w-[80%] space-x-3">
                                        {message.role === "assistant" && (
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="bg-primary/20">
                                                    <Bird className="w-5 h-5 text-primary" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={`rounded-2xl p-4 ${message.role === "user"
                                                ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                                                : "bg-muted/50 border shadow-sm"
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                        </div>
                                        {message.role === "user" && (
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    <User className="w-5 h-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    <div className="p-6 bg-gradient-to-r from-background to-muted/50">
                        <div className="flex items-center space-x-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                disabled={isLoading}
                                className="flex-1 bg-background/80 backdrop-blur border-muted-foreground/20"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                size="icon"
                                className="rounded-full h-10 w-10 bg-black hover:bg-primary"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SupportPage;