//import { auth } from "@/app/api/auth/[...nextauth]/auth"
//import { redirect } from "next/navigation"
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import RecentOrders from "@/components/ecommerce/RecentOrders" 
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import DemographicCard from "@/components/ecommerce/DemographicCard";
//import { useSession } from "next-auth/react";
export default async function DashboardPage() {
  //const session = await auth()
  // const { data: session } =  useSession(); // Obtiene la sesión
  
  // if (!session) {
  //   redirect("/login")
  // }

  return (
    
    <div className="grid grid-cols-12 gap-4 md:gap-6">
    <div className="col-span-12 space-y-6 xl:col-span-7">
      <EcommerceMetrics />

      <MonthlySalesChart />
    </div>

    <div className="col-span-12 xl:col-span-5">
      <MonthlyTarget />
    </div>

    <div className="col-span-12">
      <StatisticsChart />
    </div>

    <div className="col-span-12 xl:col-span-5">
      <DemographicCard />
    </div>

    <div className="col-span-12 xl:col-span-7">
      <RecentOrders />
    </div>
  </div>
    );
    
 
}