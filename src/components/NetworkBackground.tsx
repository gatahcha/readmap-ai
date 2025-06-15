"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export function NetworkBackground({
  className = "",
  particleCount = 50,
  connectionDistance = 200,
  particleSpeed = 0.7,
  lineOpacity = 0.4, // more transparent lines
}: {
  className?: string
  particleCount?: number
  connectionDistance?: number
  particleSpeed?: number
  lineOpacity?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const update = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    const { width, height } = dimensions
    if (!width || !height) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    canvas.width = width
    canvas.height = height

    // Gradient with reduced alpha for subtler look
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, 'rgba(255, 152, 0, 0.6)')   // 60% opacity
    gradient.addColorStop(1, 'rgba(255, 87, 34, 0.6)')    // 60% opacity

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * particleSpeed,
      vy: (Math.random() - 0.5) * particleSpeed,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.3 + 0.7,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Move & wrap particles
      particlesRef.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x > width) p.x = 0
        else if (p.x < 0) p.x = width
        if (p.y > height) p.y = 0
        else if (p.y < 0) p.y = height
      })

      // Draw connections more transparently
      ctx.save()
      ctx.strokeStyle = gradient
      ctx.lineWidth = 1.5
      particlesRef.current.forEach((a, i) => {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const b = particlesRef.current[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < connectionDistance) {
            ctx.globalAlpha = (1 - dist / connectionDistance) * lineOpacity
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      })
      ctx.restore()

      // Draw particles with softer fill opacity
      particlesRef.current.forEach(p => {
        ctx.save()
        ctx.shadowColor = 'rgb(255, 230, 197)'
        ctx.shadowBlur = p.size * 20
        ctx.globalAlpha = p.opacity * 0.4  // 60% of particle opacity
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [dimensions, particleCount, connectionDistance, particleSpeed, lineOpacity])

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
