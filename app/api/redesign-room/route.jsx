import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { storage, ID } from "@/config/appwriteConfig";
import { db } from "@/config/db";
import { AiGeneratedImage } from "@/config/schema";

export async function POST(req) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageUrl, roomType, designType, additionalReq, userEmail } = await req.json();
  const prompt = `A ${roomType} with a ${designType} style interior. ${additionalReq || ""}`;

  try {
    const output = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!output.ok) {
      throw new Error(`Hugging Face API Error: ${output.statusText}`);
    }

    const buffer = await output.arrayBuffer();
    const fileBlob = new Blob([buffer], { type: "image/png" });
    const fileId = ID.unique();
    const uploadedFile = await storage.createFile(
      process.env.NEXT_APPWRITE_BUCKET_ID,
      fileId,
      fileBlob
    );

    const previewUrl = storage.getFilePreview(
      process.env.NEXT_APPWRITE_BUCKET_ID,
      uploadedFile.$id
    ).href;

    await db.insert(AiGeneratedImage).values({
      roomType,
      designType,
      orgImage: imageUrl,
      aiImage: previewUrl,
      userEmail,
    });

    return NextResponse.json({ result: previewUrl });

  } catch (e) {
    console.error("Hugging Face Error:", e);
    return NextResponse.json({ error: e?.message || "Something went wrong." }, { status: 500 });
  }
}
