import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LeadState } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const videos = await prisma.mentorshipVideo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const thumbnail = formData.get("thumbnail") as string;
    const minStateRaw = formData.get("minState") as string;
    const videoFile = formData.get("videoFile") as File;

    if (!title || !videoFile) {
      return NextResponse.json({ error: "Title and Video File are required" }, { status: 400 });
    }

    // Validate minState if provided
    let state: LeadState = "CLIENT";
    if (minStateRaw && Object.values(LeadState).includes(minStateRaw as LeadState)) {
        state = minStateRaw as LeadState;
    }

    // Handle File Upload
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${videoFile.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/videos");
    
    // Ensure directory exists
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        console.error("Error creating directory", e);
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const videoUrl = `/uploads/videos/${filename}`;

    const video = await prisma.mentorshipVideo.create({
      data: {
        title,
        description,
        url: videoUrl,
        thumbnail,
        minState: state,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("Create video error:", error);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}
