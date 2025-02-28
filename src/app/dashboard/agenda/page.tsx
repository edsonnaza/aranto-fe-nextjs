//import { auth } from "@/app/api/auth/[...nextauth]/--auth"
//import { redirect } from "next/navigation"
 import Calendar from "@/components/calendar/Calendar";
export default async function Agenda() {
 // const session = await auth()
  
  

  return (
    
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <Calendar /> 
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
   
 
}