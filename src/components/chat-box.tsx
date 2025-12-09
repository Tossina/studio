import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const messages = [
    { user: "Rary", text: "Bien joué Soa !", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjUyNDQyOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080", isSelf: false },
    { user: "Soa", text: "Merci, j'ai eu de la chance au turn.", avatar: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2NTIzMzE2N3ww&ixlib=rb-4.1.0&q=80&w=1080", isSelf: false },
    { type: 'system', text: "Le croupier mélange les cartes..."},
    { user: "Moi", text: "Allez, on relance !", avatar: "https://images.unsplash.com/photo-1525186402429-b4ff38bedec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjBoYXBweXxlbnwwfHx8fDE3NjUyNDY1NTF8MA&ixlib=rb-4.1.0&q=80&w=1080", isSelf: true },
];

export function ChatBox() {
  return (
    <div className="flex flex-col h-full bg-card">
        <ScrollArea className="flex-grow p-4">
            <div className="space-y-4 text-sm">
                <p className="text-center text-muted-foreground text-xs">Bienvenue sur la table DagoPoker #402. Bonne chance !</p>
                {messages.map((msg, index) => {
                    if (msg.type === 'system') {
                        return (
                            <div key={index} className="text-center my-2">
                                <p className="text-red-400/80 text-xs italic">
                                    <span className="animate-pulse mr-2">•</span>{msg.text}
                                </p>
                            </div>
                        )
                    }
                    return (
                        <div key={index} className="flex items-start gap-2">
                            <Avatar className="h-5 w-5 border-none mt-0.5">
                                <AvatarImage src={msg.avatar} />
                                <AvatarFallback>{msg.user?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className={`font-semibold text-xs ${msg.isSelf ? 'text-primary' : 'text-muted-foreground'}`}>{msg.user}</p>
                                <p className="text-sm text-foreground -mt-0.5">{msg.text}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
        <div className="p-2 border-t bg-secondary">
            <div className="relative">
                <Input placeholder="Écrire un message..." className="bg-input pr-10 h-10 border-0" />
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                    <Send />
                </Button>
            </div>
             <div className="flex gap-2 mt-2">
                <Button size="sm" variant="secondary" className="text-xs h-7">Bien joué</Button>
                <Button size="sm" variant="secondary" className="text-xs h-7">Dommage</Button>
                <Button size="sm" variant="secondary" className="text-xs h-7">Vite svp</Button>
            </div>
        </div>
    </div>
  );
}
