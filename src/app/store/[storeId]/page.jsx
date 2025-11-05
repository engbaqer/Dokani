"use client"
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/request";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

export default function StorePage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const storeId = params.storeId;
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

    useEffect(() => {
        let mounted = true;
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                // Backend returns ALL items for the store; we'll paginate client-side
                const data = await apiRequest(`product/getProductsByStore/store/${storeId}`);
                if (mounted) {
                    const list = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
                    setItems(list);
                    setTotal(list.length);
                }
            } catch (e) {
                if (mounted) {
                    setItems([]);
                    setTotal(0);
                }
            } finally {
                if (mounted) setIsLoading(false);
            }
        };
        fetchItems();
        return () => { mounted = false };
    }, [storeId, pageFromUrl]);

    const goToPage = (pageNum) => {
        const next = Math.min(Math.max(1, pageNum), totalPages);
        const qs = new URLSearchParams(searchParams.toString());
        qs.set("page", String(next));
        router.push(`?${qs.toString()}`);
    };

    return (
        <div className=" mx-auto  min-h-screen w-full bg-gray-50 p-5 pt-22" dir="rtl">
            <Card className="max-w-6xl mx-auto">
                <CardHeader className="text-center">
                    {/* <CardTitle className="text-xl"> </CardTitle> */}
                    
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-10">جاري التحميل...</div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">لا توجد منتجات متاحة.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                            {items
                                .slice((pageFromUrl - 1) * PAGE_SIZE, (pageFromUrl) * PAGE_SIZE)
                                .map((item) => (
                                <Card key={item.id} className="flex flex-col overflow-hidden">
                                    { (item.image_url) && (
                                        <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                                            <img
                                                src={ `${process.env.NEXT_PUBLIC_API_URL}${item.image_url }`}
                                                alt={ "product"}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
                                        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">السعر</span>
                                            <span className="font-medium">{item.price}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-between">
                                        <Button size="sm" onClick={() => router.push(`/store/${storeId}/item/${item.id}`)}>تفاصيل</Button>
                                        <Button variant="outline" size="sm" onClick={() => router.push(`/store/${storeId}/item/${item.id}?view=order`)}>اطلب الآن</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="justify-between">
                    <div className="text-sm text-muted-foreground">الصفحة {pageFromUrl} من {totalPages}</div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" disabled={pageFromUrl <= 1} onClick={() => goToPage(pageFromUrl - 1)}>السابق</Button>
                        <Button size="sm" variant="outline" disabled={pageFromUrl >= totalPages} onClick={() => goToPage(pageFromUrl + 1)}>التالي</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}


