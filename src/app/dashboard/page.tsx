//import { auth } from "@/app/api/auth/[...nextauth]/auth"
//import { redirect } from "next/navigation"
//import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import RecentOrders from "@/components/ecommerce/RecentOrders" 
//import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
//import { useSession } from "next-auth/react";
export default async function DashboardPage() {
  //const session = await auth()
  // const { data: session } =  useSession(); // Obtiene la sesión
  
  // if (!session) {
  //   redirect("/login")
  // }

  return (
    
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <RecentOrders />
          {/* <EcommerceMetrics /> */}
  
          {/* <MonthlySalesChart /> */}
        </div>
  
       
  
        <div className="col-span-12">
          {/* <StatisticsChart /> */}
        </div>
  
        <div className="col-span-12 xl:col-span-5">
          {/* <DemographicCard /> */}
        </div>
  
        <div className="col-span-12 xl:col-span-12">
        </div>
      </div>
    );
    // <div className="min-h-screen bg-gray-100">
    //   <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    //     <div className="px-4 py-6 sm:px-0">
    //       <h1 className="text-3xl font-bold text-gray-900">
    //         Welcome to your Dashboard
    //       </h1>
    //       <div className="mt-4">
    //         <p className="text-lg text-gray-600">
    //           You are logged in as: {session.user?.email}
    //         </p>
    //         <p className="text-lg text-gray-600">
    //           Role: {session.user?.role}
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
 
}