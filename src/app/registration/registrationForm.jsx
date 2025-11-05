"use client";
import { useState } from "react";
import { useGlobalState } from "./context/GlobalState";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/request";
import { useRouter } from "next/navigation";
export default function RegistrationForm() {
    const { userName, setUserName, email, setEmail, password, setPassword } = useGlobalState();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userName || !email || !password) return;
        setIsLoading(true);
        const payload = 
            {
                name: userName,
                email: email,
                password: password
            }
        ;
        try {
            const result = await apiRequest("users/register", {
                method: "POST",
                body: payload,
            });

            console.log("Registration successful:", result);
            localStorage.setItem("jwt", result.token);
            router.push(`/registration/greatStore`);
        } catch (error) {
            console.error("Error registering:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">إنشاء حساب جديد</CardTitle>
                <CardDescription>قم بإدخال بياناتك لبدء استخدام المنصة.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-2">
                        <Label htmlFor="username">اسم المستخدم</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="أحمد علي"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            autoComplete="name"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
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
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <CardFooter className="flex-col gap-3 p-0">
                        <Button type="submit" className="w-full" disabled={isLoading || !userName || !email || !password}>
                            {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            لديك حساب بالفعل؟
                            <a href="/login" className="px-1 underline underline-offset-4">تسجيل الدخول</a>
                        </p>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
