
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft, Search, Paperclip } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';


const conversations = [
    { id: '1', name: 'Tech Innovators Inc.', lastMessage: 'Sounds great, we will...', avatar: 'https://picsum.photos/seed/comp1/100/100', unread: 2 },
    { id: '2', name: 'Future Solutions LLC', lastMessage: 'Can you send over your...', avatar: 'https://picsum.photos/seed/comp2/100/100', unread: 0 },
    { id: '3', name: 'Cebu Institute of Technology', lastMessage: 'Your application is confirmed.', avatar: 'https://picsum.photos/seed/sch1/100/100', unread: 0 },
];

const initialMessages: Record<string, any[]> = {
    '1': [
        { id: 1, sender: 'them', text: 'Hi there! We have reviewed your application and would like to schedule a brief call.' },
        { id: 2, sender: 'me', text: 'That sounds great! I am available tomorrow afternoon.' },
        { id: 3, sender: 'them', text: 'Perfect. Does 2 PM work for you?' },
    ],
    '2': [
        { id: 1, sender: 'them', text: 'Can you send over your portfolio? We are impressed with your resume.' },
    ],
    '3': [
        { id: 1, sender: 'them', text: 'Your application to Cebu Institute of Technology has been confirmed by the registrar.' },
        { id: 2, sender: 'me', text: 'Thank you for the update!' },
    ]
};

export default function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const isMobile = useIsMobile();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    
    const handleSelectConversation = (convo: any) => {
        setSelectedConversation(convo);
        setMessages(initialMessages[convo.id] || []);
        convo.unread = 0;
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConversation) {
            setMessages([...messages, { id: Date.now(), sender: 'me', text: newMessage.trim() }]);
            setNewMessage('');
        }
    };
    
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const filteredConversations = useMemo(() => {
        return conversations.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const ConversationList = () => (
         <div className="w-full h-full flex flex-col">
             <CardHeader className="p-4">
                <CardTitle className="text-xl">Messages</CardTitle>
                <CardDescription>Your conversations with companies and schools.</CardDescription>
                 <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search chats..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <ScrollArea className="flex-1">
                <div className="space-y-1 p-2">
                    {filteredConversations.map(convo => (
                        <button 
                            key={convo.id} 
                            onClick={() => handleSelectConversation(convo)}
                            className={cn("w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors",
                                selectedConversation?.id === convo.id ? 'bg-muted' : 'hover:bg-muted/50'
                            )}
                        >
                            <Avatar>
                                <AvatarImage src={convo.avatar} />
                                <AvatarFallback>{getInitials(convo.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{convo.name}</p>
                                <p className={cn("text-sm text-muted-foreground truncate", convo.unread > 0 && "font-bold text-foreground")}>{convo.lastMessage}</p>
                            </div>
                            {convo.unread > 0 && (
                                <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">
                                    {convo.unread}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
    
    const ChatPanel = () => (
        <div className="w-full h-full flex flex-col">
            {selectedConversation ? (
                <>
                    <div className="p-3 border-b flex items-center gap-3">
                        {isMobile && (
                            <Button variant="ghost" size="icon" className="mr-2" onClick={() => setSelectedConversation(null)}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                         <Avatar>
                            <AvatarImage src={selectedConversation.avatar} />
                            <AvatarFallback>{getInitials(selectedConversation.name)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold">{selectedConversation.name}</h3>
                    </div>
                    <ScrollArea className="flex-1 p-4 bg-muted/20" viewportRef={scrollAreaRef}>
                        <div className="space-y-4">
                            {messages.map(msg => (
                                 <div key={msg.id} className={cn('flex items-end gap-2', msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                                     {msg.sender !== 'me' && <Avatar className="h-8 w-8"><AvatarImage src={selectedConversation.avatar} /><AvatarFallback>{getInitials(selectedConversation.name)}</AvatarFallback></Avatar>}
                                    <div className={cn(
                                        'p-3 rounded-lg max-w-[80%] md:max-w-md',
                                        msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-background border'
                                    )}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-2 md:p-4 border-t bg-background">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <Button type="button" variant="ghost" size="icon">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Input 
                                placeholder="Type a message..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                autoComplete="off"
                                className="flex-1"
                            />
                            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <p>Select a conversation to start chatting.</p>
                </div>
            )}
        </div>
    );
    
    if (isMobile) {
        return (
             <Card className="h-[calc(100svh_-_8rem)] w-full">
                {selectedConversation ? <ChatPanel /> : <ConversationList />}
             </Card>
        )
    }

    return (
        <Card className="h-[calc(100vh_-_8rem)] flex">
          <div className="w-full md:w-1/3 border-r flex flex-col">
            <ConversationList />
          </div>
          <div className="hidden md:flex w-2/3 flex-col">
            <ChatPanel />
          </div>
        </Card>
    );
}
