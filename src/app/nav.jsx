'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();
return(
    <nav className="bg-white fixed shadow-md py-4 px-6  w-screen" dir="rtl">
          <div className="container mx-auto flex flex-row justify-between items-center">
            <div className="flex justify-center items-center flex-row">
              {" "}
              <Image
                src="/dokkani-logo.svg"
                alt="Dokkani Logo"
                width={50}
                height={50}
              />
              <p
                className="text-xl font-bold "
                style={{ color: "lab(32 -1.69 -39.12)" }}
              >
                دكّا<span className="text-orange-400">ني</span>
              </p>
            </div>

            <div>
              <Button className="bg-orange-300 text-black font-bold cursor-pointer" onClick={() => router.push('/login')}>
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </nav>
)


}