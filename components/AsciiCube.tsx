"use client"
import React, { useEffect, useRef, useState } from "react"

export default function AsciiCube() {
  const [frame, setFrame] = useState("")
  
  useEffect(() => {
    let A = 0, B = 0;
    let animationId: number;

    const renderFrame = () => {
      const width = 40;
      const height = 20;
      const b = new Array(width * height).fill(' ');
      const zBuffer = new Array(width * height).fill(0);
      
      // Torus mathematical properties
      const R1 = 1;
      const R2 = 2;
      const K2 = 5;
      const K1 = width * K2 * 3 / (8 * (R1 + R2));
      
      // Render Torus
      for (let j = 0; j < 6.28; j += 0.07) {
        for (let i = 0; i < 6.28; i += 0.02) {
          const c = Math.sin(i);
          const d = Math.cos(j);
          const e = Math.sin(A);
          const f = Math.sin(j);
          const g = Math.cos(A);
          const h = d + 2;
          const D = 1 / (c * h * e + f * g + 5);
          const l = Math.cos(i);
          const m = Math.cos(B);
          const n = Math.sin(B);
          const t = c * h * g - f * e;
          
          const x = Math.floor(width / 2 + 15 * D * (l * h * m - t * n));
          const y = Math.floor(height / 2 + 8 * D * (l * h * n + t * m));
          
          const o = x + width * y;
          const N = Math.floor(8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n));
          
          if (height > y && y > 0 && x > 0 && width > x && D > zBuffer[o]) {
            zBuffer[o] = D;
            b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
          }
        }
      }
      
      for (let k = 0; k < width * height; k++) {
        if (k % width === width - 1) b[k] = '\n';
      }
      
      setFrame(b.join(''));
      
      A += 0.04;
      B += 0.02;
      animationId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <pre style={{ 
      fontFamily: '"Space Mono", monospace', 
      fontSize: '10px', 
      lineHeight: '10px', 
      color: 'var(--accent-retro)', 
      margin: 0, 
      opacity: 0.8,
      overflow: 'hidden'
    }}>
      {frame}
    </pre>
  )
}
