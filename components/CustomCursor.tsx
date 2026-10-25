"use client"

import { useEffect, useRef, useState } from "react"

export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(true)

  const trailerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const hLineRef = useRef<HTMLDivElement>(null)
  const vLineRef = useRef<HTMLDivElement>(null)
  
  // Refs for tracking
  const mouse = useRef({ x: -100, y: -100 })
  const trailing = useRef({ x: -100, y: -100, w: 40, h: 40 })
  const requestRef = useRef<number | null>(null)
  const hoveredElRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Check if device supports hover
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    setIsDesktop(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mediaQuery.addEventListener("change", handler)
    
    if (!mediaQuery.matches) return;

    // Hide default cursor
    const style = document.createElement("style")
    style.innerHTML = `
      * { cursor: none !important; }
    `
    document.head.appendChild(style)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Find closest interactive element
      const interactiveEl = target.closest('a, button, input, textarea, .project-card, .window-btn') as HTMLElement
      if (interactiveEl) {
        hoveredElRef.current = interactiveEl
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      if (hoveredElRef.current) {
        // If we move out of the current hovered element
        hoveredElRef.current = null
      }
    }

    const animate = () => {
      let targetX = mouse.current.x
      let targetY = mouse.current.y
      let targetW = 40
      let targetH = 40

      if (hoveredElRef.current) {
        const rect = hoveredElRef.current.getBoundingClientRect()
        // Lock to the center of the element
        targetX = rect.left + rect.width / 2
        targetY = rect.top + rect.height / 2
        // Match the element's size + a little padding
        targetW = rect.width + 12
        targetH = rect.height + 12
      }

      // Linear interpolation (lerp)
      const ease = hoveredElRef.current ? 0.25 : 0.15
      trailing.current.x += (targetX - trailing.current.x) * ease
      trailing.current.y += (targetY - trailing.current.y) * ease
      trailing.current.w += (targetW - trailing.current.w) * ease
      trailing.current.h += (targetH - trailing.current.h) * ease

      if (trailerRef.current) {
        // Center the element by translating by -50% of its current width/height
        trailerRef.current.style.transform = `translate(${trailing.current.x - trailing.current.w / 2}px, ${trailing.current.y - trailing.current.h / 2}px)`
        trailerRef.current.style.width = `${trailing.current.w}px`
        trailerRef.current.style.height = `${trailing.current.h}px`
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`
      }
      if (hLineRef.current) {
        hLineRef.current.style.transform = `translateY(${mouse.current.y}px)`
      }
      if (vLineRef.current) {
        vLineRef.current.style.transform = `translateX(${mouse.current.x}px)`
      }

      requestRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseover", handleMouseOver)
    window.addEventListener("mouseout", handleMouseOut)
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
      window.removeEventListener("mouseout", handleMouseOut)
      mediaQuery.removeEventListener("change", handler)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      if (document.head.contains(style)) document.head.removeChild(style)
    }
  }, [])

  if (!isDesktop) return null;

  return (
    <>
      {/* Small fast dot */}
      <div 
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "6px", height: "6px",
          backgroundColor: "var(--accent-retro)",
          borderRadius: "0",
          pointerEvents: "none",
          zIndex: 999999,
          transform: `translate(-100px, -100px)`,
          willChange: "transform"
        }}
      />
      {/* Large trailing / locking block */}
      <div 
        ref={trailerRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          border: "2px solid var(--accent-retro)",
          backgroundColor: "transparent",
          borderRadius: "0",
          pointerEvents: "none",
          zIndex: 999998,
          willChange: "transform, width, height",
          boxShadow: "3px 3px 0px rgba(17, 17, 17, 0.15)"
        }}
      />
      {/* Horizontal Crosshair Line */}
      <div 
        ref={hLineRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "1px",
          backgroundColor: "var(--accent-retro)",
          opacity: 0.15,
          pointerEvents: "none",
          zIndex: 999997,
          transform: `translateY(-100px)`,
          willChange: "transform"
        }}
      />
      {/* Vertical Crosshair Line */}
      <div 
        ref={vLineRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "1px", height: "100vh",
          backgroundColor: "var(--accent-retro)",
          opacity: 0.15,
          pointerEvents: "none",
          zIndex: 999997,
          transform: `translateX(-100px)`,
          willChange: "transform"
        }}
      />
    </>
  )
}
