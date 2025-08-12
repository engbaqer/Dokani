"use client"; // Required if you're using React hooks

import { useGlobalState } from "./context/GlobalState";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegistrationForm() {
    const { userName, setUserName, email, setEmail, password, setPassword } = useGlobalState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = { userName, email, password };

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Failed to register");
            }

            const result = await res.json();
            console.log("✅ Registered successfully:", result);

        } catch (error) {
            console.error("❌ Registration failed:", error);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>انشاء حساب خاص بك</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="username">اسم المستخدم</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="ahmed ali"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">البريد الالكتروني</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <CardFooter className="flex-col gap-2 mt-4">
                        <Button type="submit" className="w-full">
                            انشاء حساب
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
