"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/request";
import { useGlobalState } from "../context/GlobalState";
import { useRouter } from "next/navigation";
export default function CreateStore() {
    const { logo, setLogo, storeName, setStoreName } = useGlobalState();
    const [isLoading, setIsLoading] = useState(false);
    // const token = localStorage.getItem("jwt")
const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!storeName || !logo) return;
        setIsLoading(true);
        const tooken = localStorage.getItem("jwt");
        

        const formData = new FormData();
        formData.append("store_name", storeName);
        if (logo) {
            formData.append("logo", logo);  // logo is a File object from input
        }

        try {
            const result = await apiRequest("store/createStore", {
                method: "POST",
                body: formData,        // Pass FormData here
                token: tooken,
                isFormData: true       // Inform apiRequest not to stringify or set JSON headers
            });

            console.log("Store created successfully:", result);
router.push(`/dashboard`);
        } catch (error) {
            console.error("Error creating store:", error);
        } finally {
            setIsLoading(false);
        }
    };

    
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">إنشاء متجر جديد</CardTitle>
                <CardDescription>أدخل اسم المتجر وارفع شعاراً واضحاً.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-2">
                        <Label htmlFor="storeName">اسم المتجر</Label>
                        <Input
                            id="storeName"
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            autoComplete="organization"
                            required
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="logo">شعار المتجر</Label>
                        <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setLogo(e.target.files[0])}
                            required
                        />
                        <p className="text-xs text-muted-foreground">يدعم PNG و JPG حتى 5MB.</p>
                    </div>
                    <CardFooter className="flex-col gap-3 p-0">
                        <Button type="submit" className="w-full" disabled={isLoading || !storeName || !logo}>
                            {isLoading ? "جاري إنشاء المتجر..." : "إنشاء متجر"}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
