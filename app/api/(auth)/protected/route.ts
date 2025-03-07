import { auth } from "@/auth"

export async function GET() {
  const session = await auth();
  
  if (session) {
    return Response.json({ data: "Protected data", user: session.user })
  }

  return Response.json({ message: "Not authenticated" }, { status: 401 })
}
