import { Users } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user } = await req.json();

    const userInfo = await db
      .select()
      .from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

    if (userInfo.length === 0) {
      const saveResult = await db.insert(Users).values({
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        imageUrl: user?.imageUrl,
      }).returning();

      return NextResponse.json({ result: saveResult[0] });
    }

    return NextResponse.json({ result: userInfo[0] });
  } catch (e) {
    console.error("Error in POST /api:", e);
    return NextResponse.json({ error: e.message || "Something went wrong" }, { status: 500 });
  }
}
