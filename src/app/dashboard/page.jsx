'use client'
import {
    Card,
    
   
} from "@/components/ui/card"
// import { Link } from "react-router-dom"
import Img1 from "../../../public/icons_552559.svg"
import Img2 from "../../../public/icons_552545.svg"
import Image from "next/image";
import { useRouter } from "next/navigation";




export default function DashboardPage() {

const router = useRouter();
    return (
       
        <div className="flex items-center justify-center h-screen w-full sm:flex-row flex-col  gap-15 ">
           
            <Card onClick={() => router.push("/dashboard/products")} className="w-50 flex items-center justify-center cursor-pointer hover:bg-gray-100">
                <Image
                alt="."
                    src={Img1} // replace with your image path
                width={100}
                height={100}
                />
              <h2 className="font-bold">المنتجات</h2>
            </Card>
                
            <Card onClick={() => router.push("/dashboard/orders")} className="w-50 flex items-center justify-center cursor-pointer hover:bg-gray-100">
                <Image
                alt="."
                    src={Img2} // replace with your image path
                width={100}
                height={100}
                />
              <h2 className="font-bold">الطلبات</h2>
            </Card>
        </div>
      
    );
}
