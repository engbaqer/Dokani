import {
    Card,
    
   
} from "@/components/ui/card"
// import { Link } from "react-router-dom"
import Img1 from "../../../public/icons_552559.svg"
import Img2 from "../../../public/icons_552545.svg"
import Image from "next/image";





export default function DashboardPage() {
    return (
        <div className="flex items-center justify-center h-screen w-full sm:flex-row flex-col  gap-15 ">
           
            <Card className="w-50 flex items-center justify-center cursor-pointer">
                <Image
                alt="."
                    src={Img1} // replace with your image path
                width={100}
                height={100}
                />
              <h2 className="font-bold">المنتجات</h2>
            </Card>
                
            <Card className="w-50 flex items-center justify-center cursor-pointer">
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
