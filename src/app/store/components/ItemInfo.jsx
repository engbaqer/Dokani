"use client"
import { CardDescription } from "@/components/ui/card";

export default function ItemInfo({ item }) {
    if (!item) return null;
    return (
        <div className="space-y-6">
            {(item.image_url || item.logo || item.image || item.imageUrl) && (
                <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-md">
                    <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${item.image_url }`}
                        alt={item.name || "product"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            )}
            <div className="space-y-1">
                <div className="text-lg font-semibold">{item.name}</div>
                <CardDescription>{item.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">السعر: </span>
                <span className="font-medium">{item.price}  IQ</span>
            </div>
        </div>
    );
}


