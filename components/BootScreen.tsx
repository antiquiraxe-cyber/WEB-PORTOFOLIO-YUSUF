"use client"

import React, { useState, useEffect } from "react"

const BOOT_SEQUENCE = [
  "BIOS Date 07/12/26 19:42:10 Ver 2.0.4",
  "CPU: Central Processing Unit @ 3.50GHz",
  "Speed: 3.50 GHz  Count: 16",
  "Memory: 65536 OK",
  "",
  "Initializing USB Controllers .. Done.",
  "2048MB RAM System Type: X64",
  "Auto-Detecting Storage...",
  "SATA Port0: SSD 2TB",
  "SATA Port1: None",
  "",
  "Checking Root Filesystem...",
  "Loading Kernel...",
  "Mounting /dev/sda1...",
  "Starting system logger: [ OK ]",
  "Starting network interface: [ OK ]",
  "Starting cryptographic services: [ OK ]",
  "Booting UI Protocol...",
  "Decrypting assets...",
  "ACCESS GRANTED."
]

export default function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([])
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null)

  useEffect(() => {
    let currentLine = 0
    let progress = 0

    const addLine = () => {
      if (currentLine < BOOT_SEQUENCE.length) {
        setLines((prev) => [...prev, BOOT_SEQUENCE[currentLine]])
        currentLine++
        const delay = Math.random() * 80 + 20 
        setTimeout(addLine, delay)
      } else {
        // Text is fully typed, now start the loading bar
        setLoadingProgress(0)
        const loadInterval = setInterval(() => {
          progress += Math.floor(Math.random() * 20) + 10;
          if (progress >= 100) {
            progress = 100;
            setLoadingProgress(100);
            clearInterval(loadInterval);
            setTimeout(onComplete, 800) // Finish sequence after loading completes
          } else {
            setLoadingProgress(progress);
          }
        }, 100)
      }
    }
    
    // Start after a tiny delay
    setTimeout(addLine, 200)
  }, [onComplete])

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#050505',
        color: '#00ff00',
        fontFamily: '"Space Mono", monospace',
        padding: '20px',
        zIndex: 9999999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'hidden'
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ marginBottom: '4px', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
          {line === "" ? "\u00A0" : line}
        </div>
      ))}
      {loadingProgress !== null && (
        <div style={{ marginTop: '20px', marginBottom: '10px', fontSize: '14px', color: loadingProgress === 100 ? '#fff' : '#00ff00' }}>
          LOADING ASSETS: [{Array(20).fill(0).map((_, i) => i < (loadingProgress / 100) * 20 ? '█' : '░').join('')}] {loadingProgress}%
        </div>
      )}
      {loadingProgress === null && (
        <div style={{ width: '10px', height: '16px', backgroundColor: '#00ff00', animation: 'blink 0.5s infinite', marginTop: '10px' }} />
      )}
    </div>
  )
}
