"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { motion } from "framer-motion";

export function GlacierWidget() {
  const droplets = React.useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const left = 25 + (i * 4.2) + (i % 2 === 0 ? 2 : -2); 
      const size = 2 + (i % 3) * 0.8; 
      const duration = 1.2 + (i % 4) * 0.4; 
      const delay = -(i * 0.3) - (i % 3) * 0.1; 
      const opacity = 0.25 + (i % 5) * 0.12; 
      return { id: i, left, size, duration, delay, opacity };
    });
  }, []);

  return (
    <Link href="/lens" className="block focus:outline-none">
      <Card className="gradient-glass-card relative overflow-hidden group">
        <CardHeader className="pb-1">
          <CardTitle className="text-soil opacity-90 text-sm tracking-wide uppercase font-sans flex items-center justify-between">
            <span>🏔️ YOUR GLACIER</span>
            <span className="text-[10px] text-muted font-bold group-hover:text-clay transition-colors uppercase">
              Explore Lens →
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 pt-2">
          {/* Glacier SVG with melt animation */}
          <div className="relative w-full h-32 flex items-center justify-center">
            <svg
              viewBox="0 0 200 120"
              className="w-48 h-28 text-sky dark:text-sky/80"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Water background */}
              <rect x="0" y="80" width="200" height="40" fill="rgba(123, 167, 188, 0.15)" rx="4" />

              {/* Sky reflection or background glow */}
              <circle cx="100" cy="50" r="40" fill="rgba(123, 167, 188, 0.05)" />

              {/* Voxel Glacier Peak Left */}
              <g transform="translate(10, 10)">
                <polygon points="30,50 10,60 10,80 30,70" fill="#9DC4D4" stroke="#2C2640" strokeWidth="1.5" />
                <polygon points="30,50 50,60 50,80 30,70" fill="#7BA7BC" stroke="#2C2640" strokeWidth="1.5" />
                <polygon points="30,50 10,40 30,30 50,40" fill="#BDE0EC" stroke="#2C2640" strokeWidth="1.5" />
              </g>

              {/* Voxel Glacier Peak Center */}
              <g transform="translate(65, -15)">
                <polygon points="35,60 5,75 5,105 35,90" fill="#BDE0EC" stroke="#2C2640" strokeWidth="1.5" />
                <polygon points="35,60 65,75 65,105 35,90" fill="#7BA7BC" stroke="#2C2640" strokeWidth="1.5" />
                <polygon points="35,60 5,45 35,30 65,45" fill="#FFFFFF" stroke="#2C2640" strokeWidth="1.5" />
              </g>

              {/* Voxel Glacier Peak Right */}
              <g transform="translate(130, 20)">
                <polygon points="20,40 5,48 5,70 20,62" fill="#ACD5E3" stroke="#2C2640" strokeWidth="1.5" />
                <polygon points="20,40 35,48 35,70 20,62" fill="#6A96A8" stroke="#2C2640" strokeWidth="1.5" />
                <polygon points="20,40 5,32 20,24 35,32" fill="#BDE0EC" stroke="#2C2640" strokeWidth="1.5" />
              </g>

              {/* Water Line */}
              <line x1="10" y1="90" x2="190" y2="90" stroke="#2C2640" strokeWidth="3" strokeLinecap="round" />
              
              {/* Voxel Icebergs floating */}
              <g transform="translate(42, 83)">
                <polygon points="5,7 0,10 5,13 10,10" fill="#BDE0EC" stroke="#2C2640" strokeWidth="1" />
                <polygon points="5,7 0,10 0,12 5,9" fill="#9DC4D4" stroke="#2C2640" strokeWidth="1" />
                <polygon points="5,7 10,10 10,12 5,9" fill="#7BA7BC" stroke="#2C2640" strokeWidth="1" />
              </g>
              <g transform="translate(150, 81)">
                <polygon points="6,6 0,10 6,14 12,10" fill="#BDE0EC" stroke="#2C2640" strokeWidth="1" />
                <polygon points="6,6 0,10 0,12 6,8" fill="#9DC4D4" stroke="#2C2640" strokeWidth="1" />
                <polygon points="6,6 12,10 12,12 6,8" fill="#7BA7BC" stroke="#2C2640" strokeWidth="1" />
              </g>

              {/* SVG-based water ripple lines */}
              <path
                d="M 30,98 C 60,96 80,100 110,98 C 140,96 160,100 180,98"
                fill="none"
                stroke="currentColor"
                className="text-sky/20"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Melting Droplets Particles (Dark Sky Particle Opacity Layering) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {droplets.map((drop) => (
                <div
                  key={drop.id}
                  className="absolute bg-sky/80 rounded-full animate-particle-fall"
                  style={{
                    left: `${drop.left}%`,
                    top: "35%",
                    width: `${Math.max(1, drop.size * 0.5)}px`,
                    height: `${drop.size}px`,
                    "--op": drop.opacity,
                    "--dur": `${drop.duration}s`,
                    "--delay": `${drop.delay}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-muted font-sans text-center leading-relaxed max-w-xs mt-2 select-none">
            A real-time reflection of your carbon budget. It melts slowly as carbon records accumulate. swiping a swap halts the melting.
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
