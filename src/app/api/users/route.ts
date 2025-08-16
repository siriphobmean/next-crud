import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all users
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// CREATE user
export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();
  const newUser = await prisma.user.create({
    data: { name, email, password, role },
  });
  return NextResponse.json(newUser, { status: 201 });
}