import { db } from "@/configs/db";
import { ImageToCodeTable } from "@/configs/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, imageUrl, model, uid, email } = await req.json();

  const result = await db
    .insert(ImageToCodeTable)
    .values({
      description: description,
      imageUrl: imageUrl,
      model: model,
      uid: uid,
      createdBy: email,
    })
    .returning({ id: ImageToCodeTable.id });
  return NextResponse.json(result);
}
