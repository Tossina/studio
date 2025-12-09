'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 font-headline">My Profile</h1>
            <div className="grid gap-10 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <Avatar className="w-24 h-24 mb-4">
                                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{user.displayName || 'PlayerOne'}</CardTitle>
                            <CardDescription>$1,250.00</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">Upload New Avatar</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Update your account details here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" defaultValue={user.displayName || "PlayerOne"} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={user.email || ""} readOnly />
                            </div>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password for security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Update Password</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
