import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STATE_RANK } from "@/lib/lead-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRank = STATE_RANK[user.state];
    const allVideos = await prisma.mentorshipVideo.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // Filter videos based on rank
    // UPDATE: User requested all videos to be available to both old and new users
    // const allowedVideos = allVideos.filter(video => {
    //     const videoRank = STATE_RANK[video.minState];
    //     return userRank >= videoRank;
    // });
    const allowedVideos = allVideos;

    return NextResponse.json(allowedVideos);
  } catch (error) {
    console.error("Video fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
