import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to your Dashboard
          </h1>
          <div className="mt-4">
            <p className="text-lg text-gray-600">
              You are logged in as: {session.user?.email}
            </p>
            <p className="text-lg text-gray-600">
              Role: {session.user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}