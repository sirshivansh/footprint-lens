"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { motion } from "framer-motion";

export function GlacierWidget() {
  return (
    <Link href="/lens" className="block focus:outline-none">
      <Card className="border-border-custom bg-surface relative overflow-hidden shadow-md hover:border-clay/50 transition-all group">
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

              {/* Glacier Peak Left (Low Poly) */}
              <polygon
                points="20,90 60,30 90,90"
                fill="currentColor"
                className="opacity-70 fill-[#9DC4D4] dark:fill-[#5F8A9B]"
              />
              {/* Glacier Peak Center */}
              <polygon
                points="60,90 110,20 160,90"
                fill="currentColor"
                className="fill-[#BDE0EC] dark:fill-[#7BA7BC]"
              />
              {/* Glacier Peak Right */}
              <polygon
                points="130,90 170,45 190,90"
                fill="currentColor"
                className="opacity-80 fill-[#ACD5E3] dark:fill-[#6A96A8]"
              />

              {/* Facet highlights for ice depth */}
              <polygon points="110,20 110,90 160,90" fill="rgba(255,255,255,0.25)" />
              <polygon points="60,30 60,90 90,90" fill="rgba(255,255,255,0.15)" />

              {/* Water Line */}
              <line x1="10" y1="90" x2="190" y2="90" stroke="currentColor" className="text-sky/60" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Icebergs floating */}
              <polygon points="40,90 45,85 55,90" fill="currentColor" className="text-sky/90" />
              <polygon points="150,90 158,83 165,90" fill="currentColor" className="text-sky/90" />

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

            {/* Melting Droplets Particles (Framer Motion) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Drop 1 */}
              <motion.div
                animate={{
                  y: [40, 80],
                  opacity: [0, 1, 0],
                  scale: [1, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: "easeIn",
                  delay: 0.2,
                }}
                className="absolute left-[45%] top-1/4 h-2 w-1 bg-sky rounded-full"
              />

              {/* Drop 2 */}
              <motion.div
                animate={{
                  y: [30, 75],
                  opacity: [0, 1, 0],
                  scale: [1, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.6,
                  ease: "easeIn",
                  delay: 1.1,
                }}
                className="absolute left-[55%] top-1/4 h-2.5 w-1.5 bg-sky/80 rounded-full"
              />

              {/* Drop 3 */}
              <motion.div
                animate={{
                  y: [45, 82],
                  opacity: [0, 1, 0],
                  scale: [1, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: "easeIn",
                  delay: 0.7,
                }}
                className="absolute left-[38%] top-1/4 h-1.5 w-1 bg-sky/70 rounded-full"
              />
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
