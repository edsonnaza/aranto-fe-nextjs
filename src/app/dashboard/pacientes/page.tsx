//import { auth } from "@/app/api/auth/[...nextauth]/--auth"
//import { redirect } from "next/navigation"
 import PacienteTable from "@/components/pacientes/PacienteTable";
export default async function DashboardPage() {
 // const session = await auth()
  
  

  return (
    
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <PacienteTable /> 
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