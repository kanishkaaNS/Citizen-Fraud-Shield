import { getStats } from "@/lib/supabase";

export async function GET() {
  try {
    const stats = await getStats();
    return Response.json(stats);
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return Response.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
