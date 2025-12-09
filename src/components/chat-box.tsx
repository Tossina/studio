import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const messages = [
    { user: "Player 2", text: "Nice hand!", avatar: "https://picsum.photos/seed/avatar2/32/32" },
    { user: "Player 4", text: "You got lucky!", avatar: "https://picsum.photos/seed/avatar4/32/32" },
    { user: "Player 1", text: "Thanks!", avatar: "https://picsum.photos/seed/avatar1/32/32" },
    { user: "Player 5", text: "I should have folded pre-flop.", avatar: "https://picsum.photos/seed/avatar5/32/32" },
];

export function ChatBox() {
  return (
    <div className="flex flex-col h-full max-h-96 lg:max-h-full">
        <div className="p-4 border-b">
            <h4 className="font-semibold">Table Chat</h4>
        </div>
        <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className="flex items-start gap-2">
                         <Avatar className="h-8 w-8 border">
                            <AvatarImage src={msg.avatar} />
                            <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{msg.user}</p>
                            <p className="text-sm text-muted-foreground">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
        <div className="p-4 border-t">
            <div className="flex gap-2">
                <Input placeholder="Type a message..." />
                <Button variant="ghost" size="icon" className="text-primary hover:text-primary">
                    <Send />
                </Button>
            </div>
        </div>
    </div>
  );
}
