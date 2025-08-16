import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: { id: string } };

// GET user by id
export async function GET(req: Request, { params }: Params) {
  const user = await prisma.user.findUnique({ where: { id: Number(params.id) } });
  return NextResponse.json(user);
}

// UPDATE user
export async function PUT(req: Request, { params }: Params) {
  const { name, email, role } = await req.json();
  const updated = await prisma.user.update({
    where: { id: Number(params.id) },
    data: { name, email, role },
  });
  return NextResponse.json(updated);
}

// DELETE user
export async function DELETE(req: Request, { params }: Params) {
  await prisma.user.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: "Deleted successfully" });
}