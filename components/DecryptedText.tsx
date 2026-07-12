"use client"

import React, { useState, useEffect, useRef } from "react"

interface DecryptedTextProps {
  text: string
  duration?: number
}

const CHARS = "!<>-_\\\\/[]{}—=+*^?#________"

export default function DecryptedText({ text, duration = 1000 }: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState("")
  const isScrambling = useRef(false)
  const spanRef = useRef<HTMLSpanElement>(null)

  const scramble = () => {
    if (isScrambling.current) return
    isScrambling.current = true

    let iteration = 0
    const maxIterations = text.length
    const delay = duration / Math.max(maxIterations, 10)

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index]
            }
            if (char === " ") return " "
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join("")
      })

      // Adjust iteration speed based on text length to keep within duration
      iteration += maxIterations > 20 ? 1 : 0.5
      
      if (iteration >= maxIterations) {
        clearInterval(interval)
        setDisplayText(text)
        isScrambling.current = false
      }
    }, Math.max(20, delay))
  }

  useEffect(() => {
    // Only trigger scramble when element comes into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scramble()
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (spanRef.current) {
      observer.observe(spanRef.current)
    }

    return () => observer.disconnect()
  }, [text])

  const handleMouseEnter = () => {
    if (!isScrambling.current) {
      scramble()
    }
  }

  return (
    <span 
      ref={spanRef} 
      onMouseEnter={handleMouseEnter} 
      style={{ display: "inline-block", cursor: "default" }}
    >
      {displayText || text.replace(/./g, (c) => (c === " " ? " " : "-"))}
    </span>
  )
}
