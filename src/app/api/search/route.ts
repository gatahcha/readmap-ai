// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { bookPipeline } from '@/book/bookPipeline'

// Simple rate limiting (use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window
  const maxRequests = 5 // 5 requests per minute

  const record = requestCounts.get(ip)
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }
  
  if (record.count >= maxRequests) {
    return true
  }
  
  record.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - Extract IP from headers only
    const ip = request.headers.get('x-forwarded-for') 
      || request.headers.get('x-real-ip')
      || request.headers.get('remote-addr')
      || 'unknown'
      
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { query } = body

    // Input validation
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    if (query.length < 3) {
      return NextResponse.json(
        { error: 'Query must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (query.length > 200) {
      return NextResponse.json(
        { error: 'Query too long (max 200 characters)' },
        { status: 400 }
      )
    }

    // Sanitize query
    const sanitizedQuery = query
      .trim()
      .replace(/[<>\"'&]/g, '') // Remove XSS characters
      .substring(0, 200)

    // Call your existing book pipeline
    const result = await bookPipeline(sanitizedQuery)

    return NextResponse.json({
      roadmapTitle: result.roadmapTitle,
      books: result.books
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    )
  }
}