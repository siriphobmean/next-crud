import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // ไม่เอา password เพื่อความปลอดภัย
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// CREATE user
export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: { 
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        password, 
        role: role || 'user' 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // ไม่ return password
      }
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    
    // Handle unique constraint violation (email already exists)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}