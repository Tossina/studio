import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ProfilePage() {
    const userAvatar = PlaceHolderImages.find((img) => img.id === "avatar-1");

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 font-headline">My Profile</h1>
            <div className="grid gap-10 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <Avatar className="w-24 h-24 mb-4">
                                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="PlayerOne" />}
                                <AvatarFallback>P1</AvatarFallback>
                            </Avatar>
                            <CardTitle>PlayerOne</CardTitle>
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
                                <Input id="username" defaultValue="PlayerOne" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="player@example.com" />
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
