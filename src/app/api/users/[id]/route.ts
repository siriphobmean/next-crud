import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// เปลี่ยน type definition ให้เป็น Promise
type Params = { params: Promise<{ id: string }> };

// GET user by id
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params; // await params ก่อนใช้งาน
    const user = await prisma.user.findUnique({ 
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // ไม่เอา password
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// UPDATE user
export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params; // await params ก่อนใช้งาน
    const { name, email, role, password } = await req.json();
    
    // สร้าง update data
    const updateData: any = { name, email, role };
    
    // เพิ่ม password ถ้ามี
    if (password && password.trim() !== "") {
      updateData.password = password;
    }
    
    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // ไม่ return password
      }
    });
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating user:", error);
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params; // await params ก่อนใช้งาน
    
    await prisma.user.delete({ 
      where: { id: Number(id) } 
    });
    
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}