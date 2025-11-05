"use client";

// ==================="this context from registration file"==========================
import { useGlobalState } from "../registration/context/GlobalState";
import { useStateOfAllProject } from "../context/useStateOfAllProject";
// ==================="this context from registration file"==========================
import {useState} from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/request";
import { useRouter } from "next/navigation";
export default function LoginForm() {
    const { email, setEmail, password, setPassword } = useGlobalState();
    const {  setImgUrl, setNameOfStore  } = useStateOfAllProject();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;
        setIsLoading(true);
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
            // Example: save token to localStorage
            try {
                const dataOFStore = await apiRequest("store/getUserStores", {
                    method: "GET",
                    token: result.token,
                }); console.log("User stores data:", dataOFStore)

                setImgUrl(dataOFStore[0].logo_url || "");
                setNameOfStore(dataOFStore[0].store_name || "");
               
            } catch (err) { console.log(err); }
            localStorage.setItem("jwt", result.token);
            router.push("/dashboard");
            console.log("Login successful:", result);
        } catch (error) {
            console.error("Error logging in:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
                <CardDescription>مرحباً بعودتك! الرجاء إدخال بيانات حسابك.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
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
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <a
                                href="#"
                                className="text-xs underline-offset-4 hover:underline text-muted-foreground"
                            >
                                نسيت كلمة المرور؟
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <CardFooter className="flex-col gap-3 p-0">
                        <Button type="submit" className="w-full" disabled={isLoading || !email || !password}>
                            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            لا تملك حساباً؟
                            <a href="/registration" className="px-1 underline underline-offset-4">إنشاء حساب</a>
                        </p>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
