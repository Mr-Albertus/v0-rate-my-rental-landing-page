import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function LogoutButton() {
  async function logout() {
    "use server"

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/logout`, {
      method: "POST",
    })

    if (response.ok) {
      redirect("/login")
    }
  }

  return (
    <form action={logout}>
      <Button type="submit" variant="outline">
        Sign Out
      </Button>
    </form>
  )
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>You are successfully logged in to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {session.email}
              </p>
              <p>
                <strong>User ID:</strong> {session.userId}
              </p>
              <p>
                <strong>Session expires:</strong> {new Date(session.expiresAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
