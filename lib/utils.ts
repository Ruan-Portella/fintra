import { clsx, type ClassValue } from "clsx"
import { NextResponse } from "next/server"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sendError(errors: { error: string, status: number }) {
  return NextResponse.json({ error: errors.error }, { status: errors.status }) 
}