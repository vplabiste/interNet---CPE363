
'use client';

import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Search, Paperclip, ArrowLeft, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDistanceToNowStrict } from 'date-fns';

const mockConversations = [
    { id: 'student1', name: 'Maria Dela Cruz', avatar: 'https://picsum.photos/seed/student1/100/100', type: 'student', lastMessage: { messageText: "I'm very interested in the position.", timestamp: new Date(Date.now() - 1000 * 60 * 5) } },
    { id: 'student2', name: 'Juanito Santos', avatar: 'https://picsum.photos/seed/student2/100/100', type: 'student', lastMessage: { messageText: 'When is the deadline for the application?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) } },
];

const mockMessages: Record<string, any[]> = {
    'student1': [
        { id: 1, sender: 'them', text: 'Hi, I have a question about the Software Engineer Intern role.' },
        { id: 2, sender: 'me', text: 'Hello Maria! I can help with that. What would you like to know?' },
        { id: 3, sender: 'them', text: "I'm very interested in the position." },
    ],
    'student2': [
        { id: 1, sender: 'them', text: 'When is the deadline for the application?' },
    ]
};

const ConversationButton = ({ convo, selected, onSelect }: { convo: any, selected: boolean, onSelect: (convo: any) => void }) => {
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    const lastMessage = convo.lastMessage;
    const lastMessageText = lastMessage ? lastMessage.messageText : "No messages yet";

    return (
         <button 
            key={convo.id} 
            onClick={() => onSelect(convo)}
            className={cn("w-full text-left p-3 pr-4 rounded-lg flex items-center gap-3 transition-colors",
                selected ? 'bg-muted' : 'hover:bg-muted/50'
            )}
        >
            <Avatar>
                <AvatarImage src={convo.avatar} />
                <AvatarFallback>{getInitials(convo.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <p className="font-semibold truncate">{convo.name}</p>
                    {lastMessage?.timestamp && (
                        <p className="text-xs text-muted-foreground shrink-0 ml-2">
                           {formatDistanceToNowStrict(lastMessage.timestamp, { addSuffix: true })}
                        </p>
                    )}
                </div>
                <p className={cn("text-sm text-muted-foreground truncate")}>
                  {lastMessageText}
                </p>
            </div>
        </button>
    )
}

export default function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const isMobile = useIsMobile();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const conversations = mockConversations;
    const messagesLoading = false;
    const usersLoading = false;

    const currentChatMessages = useMemo(() => {
        if (!selectedConversation) return [];
        return messages;
    }, [selectedConversation, messages]);

    const handleSelectConversation = (convo: any) => {
        setSelectedConversation(convo);
        setMessages(mockMessages[convo.id] || []);
        setSearchTerm('');
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const newMsg = { id: Date.now(), sender: 'me', text: newMessage.trim() };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
    }
    
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

     useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
     }, [currentChatMessages]);

    const filteredConversations = useMemo(() => {
        if (!conversations) return [];
        const lowercasedFilter = searchTerm.toLowerCase();
        return conversations.filter(c => c.name.toLowerCase().includes(lowercasedFilter));
    }, [searchTerm, conversations]);

    const ConversationList = () => (
         <div className="w-full h-full flex flex-col">
             <CardHeader>
                <CardTitle>Conversations</CardTitle>
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
                     {(messagesLoading || usersLoading) && (
                         <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                         </div>
                     )}
                     {!messagesLoading && !usersLoading && filteredConversations.length > 0 && (
                        filteredConversations.map(convo => (
                           <ConversationButton 
                                key={convo.id}
                                convo={convo} 
                                selected={selectedConversation?.id === convo.id} 
                                onSelect={handleSelectConversation}
                            />
                        ))
                     )}
                      {!messagesLoading && !usersLoading && filteredConversations.length === 0 && (
                         <p className="p-4 text-sm text-center text-muted-foreground">No conversations found.</p>
                      )}
                </div>
            </ScrollArea>
        </div>
    );
    
    const ChatPanel = () => (
        <div className="w-full h-full flex flex-col">
            {selectedConversation ? (
                <>
                    <div className="p-4 border-b flex items-center gap-3">
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
                            {currentChatMessages.map(msg => (
                                 <div key={msg.id} className={cn('flex items-end gap-2', msg.sender === 'me' ? 'justify-end' : 'justify-start')}>
                                    {msg.sender !== 'me' && <Avatar className="h-8 w-8"><AvatarImage src={selectedConversation.avatar} /><AvatarFallback>{getInitials(selectedConversation.name)}</AvatarFallback></Avatar>}
                                    <div className={cn(
                                        'p-3 rounded-lg max-w-md',
                                        msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-background border'
                                    )}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-background">
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
             <Card className="h-[calc(100vh-10rem)]">
                {selectedConversation ? <ChatPanel /> : <ConversationList />}
             </Card>
        )
    }

  return (
    <Card className="h-[calc(100vh-10rem)] flex">
      <div className="w-full md:w-1/3 border-r flex flex-col">
        <ConversationList />
      </div>
      <div className="hidden md:flex w-2/3 flex-col">
        <ChatPanel />
      </div>
    </Card>
  );
}

    