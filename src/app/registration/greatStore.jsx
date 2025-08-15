"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/request";
import { useGlobalState } from "./context/GlobalState";

export default function CreateStore() {
    const { logo, setLogo, storeName, setStoreName } = useGlobalState();
    
    // const token = localStorage.getItem("jwt")

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tooken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTc1NTAxMjIwNX0.-8bnn9DIce_VRrCedziJBxpFxMj_N4LCreO9FeFL8eM";

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
        } catch (error) {
            console.error("Error creating store:", error);
        }
    };

    
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>إنشاء متجر جديد</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="storeName">اسم المتجر</Label>
                            <Input
                                id="storeName"
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="logo">شعار المتجر</Label>
                            <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setLogo(e.target.files[0])}
                                required
                            />
                        </div>
                    </div>
                    <CardFooter className="flex-col gap-2 mt-4">
                        <Button type="submit" className="w-full">
                            إنشاء متجر
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
