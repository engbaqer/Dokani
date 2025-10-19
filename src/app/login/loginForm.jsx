"use client";

// ==================="this context from registration file"==========================
import { useGlobalState } from "../registration/context/GlobalState";
// ==================="this context from registration file"==========================

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/request";

export default function LoginForm() {
    const { email, setEmail, password, setPassword } = useGlobalState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            email: email,
            password: password
        };
        console.log("Payload:", payload);
        try {
            const result = await apiRequest("users/login", {
                method: "POST",
                body: payload,
            });

            console.log("Login successful:", result);

            // Example: save token to localStorage
            if (result.token) {
                localStorage.setItem("jwt", result.token);
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>تسجيل الدخول</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
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
                            <a 
                                href="#"
                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                                نسيت كلمة المرور؟
                            </a>
                        </div>
                    </div>
                    <CardFooter className="flex-col gap-2 mt-4">
                        <Button type="submit" className="w-full">
                            تسجيل الدخول
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
