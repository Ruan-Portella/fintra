import { clsx, type ClassValue } from "clsx"
import { eachDayOfInterval, isSameDay } from "date-fns"
import { NextResponse } from "next/server"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sendError(errors: { error: string, status: number }) {
  return NextResponse.json({ error: errors.error }, { status: errors.status }) 
}

export function calculatePercentageChange(
  current: number,
  previous: number
) {
  if (previous === 0) {
    return previous === current ? 0 : 100
  }

  return ((current - previous) / Math.abs(previous)) * 100
}

export function fillMissingDays(
  activeDays: {
    date: Date,
    income: number,
    expenses: number
  }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) {
    return []
  }

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if (found) {
      return found
    } else {
      return {
        date: day,
        income: 0,
        expenses: 0
      }
    }
  });

  return transactionsByDay
}