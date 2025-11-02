'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pointer } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <div className="font-sans flex flex-col justify-center  items-center min-h-screen p-8 pb-20 gap-16 sm:px-30">
      <div
        className="max-w-xl text-center opacity-0 animate-fadeInUp"
        dir="rtl"
      >
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          دكّاني.... تجارتك أسهل وأذكى
        </h1>
        <p className="text-2xl mb-2 text-[#0B1225] font-medium	 ">
          أنشئ متجرك الإلكتروني في دقائق، وأدر منتجاتك بحلول رقميَّة متكاملة
          تشمل الدفع، وإدارة المخزون، والتسويق
        </p>
        <p className="text-2xl text-[#0B1225] font-medium	">
          كل ذلك بسهولة وسرعة، لأن نجاحك ما يحتاج تعقيد.
        </p>
      </div>

      <div className="flex gap-5">
        <Button className="cursor-pointer sm:w-54 h-15 text-2xl rounded-2xl text-[#ffff] ">
          تسوق
        </Button>
        <Button  className="cursor-pointer sm:w-60 h-15 text-2xl rounded-2xl text-[#ffff] " onClick={() => router.push('/registration')}>
          انشاء متجرك الخاص
        </Button>
      </div>
    </div>
  );
}
