"use client"
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { apiRequest } from "@/lib/request";

export default function OrderForm({ storeId, productId, unitPrice, onSuccess }) {
    const [quantity, setQuantity] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const totalPrice = useMemo(() => (Number(quantity || 0) * Number(unitPrice || 0)), [quantity, unitPrice]);

    const submitOrder = async (e) => {
        e.preventDefault();
        if (!quantity || !phoneNumber) return;
        setLoading(true);
        try {
            const payload = {
                store_id: Number(storeId),
                product_id: Number(productId),
                quantity: Number(quantity),
                unit_price: Number(unitPrice),
                phone_number: phoneNumber
            };
            await apiRequest("order/create", { method: "POST", body: payload });
            if (onSuccess) onSuccess();
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submitOrder} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="quantity">الكمية</Label>
                    <Input
                        id="quantity"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="05XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">الإجمالي</span>
                <span className="font-semibold"> ${totalPrice} IQ</span>
            </div>
            <CardFooter className="p-0">
                <Button type="submit" className="w-full" disabled={loading || !quantity || !phoneNumber}>
                    {loading ? "جاري إرسال الطلب..." : "إرسال الطلب"}
                </Button>
            </CardFooter>
        </form>
    );
}


