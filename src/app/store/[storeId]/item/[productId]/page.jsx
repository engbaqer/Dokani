"use client"
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/request";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ItemInfo from "@/app/store/components/ItemInfo";
import OrderForm from "@/app/store/components/OrderForm";

export default function ItemDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const storeId = params.storeId;
    const productId = params.productId;

    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const unitPrice = useMemo(() => (item?.price ?? 0), [item]);
    const view = searchParams.get("view") === "order" ? "order" : "details";

    useEffect(() => {
        let mounted = true;
        const fetchItem = async () => {
            setIsLoading(true);
            try {
                // Fetch product by id per backend
                const data = await apiRequest(`product/getProductById/${productId}`);
                if (mounted) setItem(data);
            } catch (e) {
                if (mounted) setItem(null);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };
        fetchItem();
        return () => { mounted = false };
    }, [productId]);

    const switchView = (next) => {
        const qs = new URLSearchParams(searchParams.toString());
        if (next === "details") qs.delete("view"); else qs.set("view", "order");
        router.push(`?${qs.toString()}`);
    }

    return (
        <div className="h-screen flex justify-center items-center w-full  p-6 " dir="rtl">
            <Card className="max-w-3xl mx-auto w-full">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{view === "order" ? "طلب المنتج" : "تفاصيل المنتج"}</CardTitle>
                    <CardDescription>{view === "order" ? "أدخل بياناتك لإرسال الطلب." : ""}</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-10">جاري التحميل...</div>
                    ) : !item ? (
                        <div className="text-center py-10 text-muted-foreground">لم يتم العثور على المنتج.</div>
                    ) : (
                        <div className="space-y-6">
                            {view === "order" ? (
                                <OrderForm storeId={storeId} productId={productId} unitPrice={unitPrice} onSuccess={() => router.back()} />
                            ) : (
                                <ItemInfo item={item} />
                            )}
                        </div>
                    )}
                </CardContent>
            
            </Card>
        </div>
    );
}


