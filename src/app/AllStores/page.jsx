"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/request";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStateOfAllProject } from "../context/useStateOfAllProject";

const PAGE_SIZE = 20;

function AllStoresInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
    const {  setImgUrl, setNameOfStore  } = useStateOfAllProject();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(stores.length / PAGE_SIZE));

  useEffect(() => {
    getStores();
  }, [page]);

  async function getStores() {
    setLoading(true);
    try {
      const data = await apiRequest("store/getAllStores");
      setStores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load stores:", err);
      setStores([]);
    } finally {
      setLoading(false);
    }
  }

  function goToPage(num) {
    const next = Math.min(Math.max(1, num), totalPages);
    const qs = new URLSearchParams(searchParams.toString());
    qs.set("page", next);
    router.push(`?${qs.toString()}`);
  }

  return (
    <div className="mx-auto min-h-screen w-full bg-gray-50 p-5 pt-22" dir="rtl">
      <Card className="max-w-6xl mx-auto">
        <CardContent>
          {loading ? (
            <div className="text-center py-10">جاري التحميل...</div>
          ) : stores.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              لا توجد متاجر متاحة.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores
                .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                .map((store) => (
                  <Card key={store.id} className="flex flex-col overflow-hidden">
                    {store.logo_url && (
                      <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${store.logo_url}`}
                          alt={store.store_name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-base line-clamp-1">
                        {store.store_name}
                      </CardTitle>
                    </CardHeader>
                    <CardFooter className="justify-end">
                      <Button
                        size="sm"
                        onClick={() =>{setImgUrl(store.logo_url); setNameOfStore(store.store_name); router.push(`/store/${store.id}`)}}
                      >
                        عرض المتجر
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-between">
          <div className="text-sm text-muted-foreground">
            الصفحة {page} من {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              السابق
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
            >
              التالي
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AllStoresPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">جاري التحميل...</div>}>
      <AllStoresInner />
    </Suspense>
  );
}
