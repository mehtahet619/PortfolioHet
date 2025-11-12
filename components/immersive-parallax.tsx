"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useTheme } from "next-themes"
import { TypewriterEffectWithGlitch } from "./typewriter-effects"

export default function ImmersiveParallax() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)

  // Set up parallax scrolling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Smoother scroll progress with spring physics
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Sky gradient transitions based on scroll and theme
  const skyTopColor = useTransform(
    smoothScrollProgress,
    [0, 0.5, 1],
    theme === "dark" ? ["#0f172a", "#1e1b4b", "#020617"] : ["#7dd3fc", "#93c5fd", "#bae6fd"],
  )

  const skyBottomColor = useTransform(
    smoothScrollProgress,
    [0, 0.5, 1],
    theme === "dark" ? ["#1e293b", "#312e81", "#0f172a"] : ["#e0f2fe", "#c7d2fe", "#93c5fd"],
  )

  // Sun/Moon position and properties based on scroll
  const celestialY = useTransform(smoothScrollProgress, [0, 0.5, 1], ["15%", "30%", "60%"])
  const celestialX = useTransform(smoothScrollProgress, [0, 0.5, 1], ["75%", "60%", "50%"])
  const celestialSize = useTransform(
    smoothScrollProgress,
    [0, 0.5, 1],
    theme === "dark" ? ["5rem", "6rem", "7rem"] : ["8rem", "9rem", "10rem"],
  )
  const celestialGlow = useTransform(
    smoothScrollProgress,
    [0, 0.5, 1],
    theme === "dark"
      ? [
          "0 0 30px 10px rgba(241, 245, 249, 0.3)",
          "0 0 40px 15px rgba(241, 245, 249, 0.35)",
          "0 0 50px 20px rgba(241, 245, 249, 0.4)",
        ]
      : [
          "0 0 60px 30px rgba(251, 191, 36, 0.7)",
          "0 0 70px 35px rgba(251, 191, 36, 0.75)",
          "0 0 80px 40px rgba(251, 191, 36, 0.8)",
        ],
  )
  const celestialRotation = useTransform(smoothScrollProgress, [0, 1], [0, 360])

  // Star opacity and scale (only visible in dark mode)
  const starsOpacity = useTransform(smoothScrollProgress, [0, 0.5, 1], [0.3, 0.6, 1])
  const starsScale = useTransform(smoothScrollProgress, [0, 1], [1, 1.2])

  // Cloud opacity and scale (only visible in light mode)
  const cloudsOpacity = useTransform(smoothScrollProgress, [0, 0.5, 1], [1, 0.7, 0.4])
  const cloudsScale = useTransform(smoothScrollProgress, [0, 1], [1, 1.1])

  // Mountain layers with different parallax speeds - ENHANCED for more dramatic effect
  const mountainLayer1Y = useTransform(smoothScrollProgress, [0, 1], ["0%", "30%"])
  const mountainLayer2Y = useTransform(smoothScrollProgress, [0, 1], ["0%", "20%"])
  const mountainLayer3Y = useTransform(smoothScrollProgress, [0, 1], ["0%", "10%"])

  // Mountain rotation based on scroll - NEW
  const mountainLayer1RotateX = useTransform(smoothScrollProgress, [0, 1], [0, 10])
  const mountainLayer2RotateX = useTransform(smoothScrollProgress, [0, 1], [0, 5])
  const mountainLayer3RotateX = useTransform(smoothScrollProgress, [0, 1], [0, 2])

  // Perspective changes based on scroll - NEW
  const perspective = useTransform(smoothScrollProgress, [0, 1], ["1000px", "2000px"])
  const containerScale = useTransform(smoothScrollProgress, [0, 1], [1, 0.95])

  // Content parallax
  const contentY = useTransform(smoothScrollProgress, [0, 1], ["0%", "50%"])
  const contentOpacity = useTransform(smoothScrollProgress, [0, 0.7, 1], [1, 0.8, 0])
  const contentScale = useTransform(smoothScrollProgress, [0, 1], [1, 0.9])

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Handle client-side rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  // Determine if we're in dark mode from the theme
  const isDarkMode = theme === "dark"

  return (
    <motion.div
      ref={containerRef}
      className="relative h-[100vh] overflow-hidden"
      style={{
        perspective,
        transformStyle: "preserve-3d",
        scale: containerScale,
      }}
    >
      {/* Sky background with gradient that changes based on scroll */}
      <motion.div
        className="absolute inset-0 z-0 transition-colors duration-500"
        style={{
          background: `linear-gradient(to bottom, ${skyTopColor}, ${skyBottomColor})`,
          willChange: "background",
        }}
      />

      {/* Stars (visible only in dark mode) */}
      {isDarkMode && (
        <motion.div style={{ scale: starsScale }}>
          <StarField mousePosition={mousePosition} opacity={starsOpacity} scrollProgress={smoothScrollProgress} />
        </motion.div>
      )}

      {/* Sun/Moon with parallax effect */}
      <motion.div
        className="absolute z-20 transition-all duration-500"
        style={{
          top: celestialY,
          left: celestialX,
          width: celestialSize,
          height: celestialSize,
          borderRadius: "50%",
          backgroundColor: isDarkMode ? "#f1f5f9" : "#fbbf24",
          boxShadow: celestialGlow,
          transform: "translate(-50%, -50%)",
          rotate: celestialRotation,
          willChange: "transform, background-color, box-shadow, top, left, width, height",
        }}
        animate={{
          x: mousePosition.x * 50,
          y: mousePosition.y * 50,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
        }}
      >
        {/* Moon craters (only visible in dark mode) */}
        {isDarkMode && (
          <>
            <div
              className="absolute rounded-full bg-slate-300 opacity-70 transition-all duration-500"
              style={{ width: "1.2rem", height: "1.2rem", top: "25%", left: "25%" }}
            />
            <div
              className="absolute rounded-full bg-slate-300 opacity-70 transition-all duration-500"
              style={{ width: "0.8rem", height: "0.8rem", top: "60%", left: "40%" }}
            />
            <div
              className="absolute rounded-full bg-slate-300 opacity-70 transition-all duration-500"
              style={{ width: "1rem", height: "1rem", top: "30%", left: "65%" }}
            />
          </>
        )}
      </motion.div>

      {/* Clouds (only visible in light mode) */}
      {!isDarkMode && (
        <motion.div style={{ scale: cloudsScale }}>
          <CloudLayer mousePosition={mousePosition} opacity={cloudsOpacity} scrollProgress={smoothScrollProgress} />
        </motion.div>
      )}

      {/* Mountain layers with different parallax speeds */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 w-full"
        style={{
          y: mountainLayer1Y,
          rotateX: mountainLayer1RotateX,
          height: "25vh",
          zIndex: 40,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        animate={{
          x: mousePosition.x * 30,
          rotateY: mousePosition.x * -10,
        }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 20,
        }}
      >
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path
            fill={isDarkMode ? "#312e81" : "#818cf8"}
            fillOpacity={isDarkMode ? 0.7 : 0.6}
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 w-full"
        style={{
          y: mountainLayer2Y,
          rotateX: mountainLayer2RotateX,
          height: "30vh",
          zIndex: 50,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        animate={{
          x: mousePosition.x * 20,
          rotateY: mousePosition.x * -5,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
        }}
      >
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path
            fill={isDarkMode ? "#1e1b4b" : "#6366f1"}
            fillOpacity={isDarkMode ? 0.8 : 0.7}
            d="M0,160L48,165.3C96,171,192,181,288,176C384,192,480,192,576,176C672,160,768,128,864,128C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 w-full"
        style={{
          y: mountainLayer3Y,
          rotateX: mountainLayer3RotateX,
          height: "35vh",
          zIndex: 60,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        animate={{
          x: mousePosition.x * 10,
          rotateY: mousePosition.x * -2,
        }}
        transition={{
          type: "spring",
          stiffness: 40,
          damping: 20,
        }}
      >
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDarkMode ? "#60a5fa" : "#3b82f6"} stopOpacity="0.6" />
              <stop offset="50%" stopColor={isDarkMode ? "#93c5fd" : "#60a5fa"} stopOpacity="0.8" />
              <stop offset="100%" stopColor={isDarkMode ? "#60a5fa" : "#3b82f6"} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <motion.path
            fill={isDarkMode ? "#0f172a" : "#4f46e5"}
            fillOpacity={isDarkMode ? 0.9 : 0.8}
            d="M0,96L48,112C96,128,192,160,288,176C384,192,480,192,576,176C672,160,768,128,864,128C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,96L48,112C96,128,192,160,288,176C384,192,480,192,576,176C672,160,768,128,864,128C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,106L48,122C96,138,192,170,288,186C384,202,480,202,576,186C672,170,768,138,864,138C960,138,1056,170,1152,175.3C1248,181,1344,159,1392,148.7L1440,138L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,86L48,102C96,118,192,150,288,166C384,182,480,182,576,166C672,150,768,118,864,118C960,118,1056,150,1152,155.3C1248,161,1344,139,1392,128.7L1440,118L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,96L48,112C96,128,192,160,288,176C384,192,480,192,576,176C672,160,768,128,864,128C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          {/* Flowing water effect overlay */}
          <motion.path
            fill="url(#waterGradient)"
            fillOpacity={0.3}
            d="M0,96L48,112C96,128,192,160,288,176C384,192,480,192,576,176C672,160,768,128,864,128C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              x: [-20, 20, -20],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>

      {/* Content overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-70"
        style={{
          y: contentY,
          opacity: contentOpacity,
          scale: contentScale,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="text-center px-4 text-white"
          animate={{
            y: mousePosition.y * -20,
            x: mousePosition.x * -20,
            z: 50,
          }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 15,
          }}
        >
          <h1 className="text-xl font-bold mb-4 text-sky-500 dark:text-amber-400">Hi I'm</h1>

          <div className="glitch-container">
            <TypewriterEffectWithGlitch
              phrases={[
                "Het Mehta",
                "AI Engineer",
                "ML Engineer",
                "Cyber Enthusiast",
                "Full Stack Developer",
                "Youtuber",
              ]}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-70">
        <motion.div
          className="flex flex-col items-center text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <p className="mb-2 text-sm">Scroll Down</p>
          <motion.div
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
            }}
          >
            <motion.div
              className="w-1 h-2 bg-white rounded-full mt-2"
              animate={{
                y: [0, 4, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @media (max-width: 768px) {
          .celestial-body {
            transform: scale(0.7);
          }
        }
      `}</style>
    </motion.div>
  )
}

// Enhanced Star Field Component
function StarField({
  mousePosition,
  opacity,
  scrollProgress,
}: {
  mousePosition: { x: number; y: number }
  opacity: any
  scrollProgress: any
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)

      // Reset canvas style dimensions
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create stars with varying depths
    const stars: {
      x: number
      y: number
      size: number
      brightness: number
      speed: number
      depth: number
      twinkleSpeed: number
    }[] = []
    const starCount = Math.min(Math.floor((canvas.width * canvas.height) / 800), 300) // Cap at 300 stars for performance

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5,
        brightness: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.2 + 0.05,
        depth: Math.random() * 3 + 1,
        twinkleSpeed: Math.random() * 0.01 + 0.003,
      })
    }

    // Animation loop
    let animationFrameId: number
    let time = 0

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Get current opacity and scroll values
      const currentOpacity = typeof opacity.get === "function" ? opacity.get() : 1
      const currentScroll = typeof scrollProgress.get === "function" ? scrollProgress.get() : 0

      // Draw stars with depth-based parallax and twinkling
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 100) * 0.2 + 0.8

        // Apply mouse movement parallax based on star depth
        const parallaxX = mousePosition.x * (star.depth * 2)
        const parallaxY = mousePosition.y * (star.depth * 2)

        // Apply scroll-based parallax - ENHANCED
        const scrollParallaxY = currentScroll * (star.depth * 80)
        const scrollParallaxX = currentScroll * (star.depth * 20) * (star.x > window.innerWidth / 2 ? 1 : -1)

        const x = star.x + parallaxX + scrollParallaxX
        const y = star.y + parallaxY - scrollParallaxY

        // Create a subtle glow effect for brighter stars
        if (star.size > 1.2) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3)
          glow.addColorStop(0, `rgba(255, 255, 255, ${star.brightness * twinkle * currentOpacity * 0.5})`)
          glow.addColorStop(1, "rgba(255, 255, 255, 0)")

          ctx.beginPath()
          ctx.fillStyle = glow
          ctx.arc(x, y, star.size * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw the star
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle * currentOpacity})`
        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mousePosition, opacity, scrollProgress])

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />
}

// Cloud Layer Component
function CloudLayer({
  mousePosition,
  opacity,
  scrollProgress,
}: {
  mousePosition: { x: number; y: number }
  opacity: any
  scrollProgress: any
}) {
  // Generate cloud positions
  const cloudPositions = [
    { left: "10%", width: 180, height: 90, top: "15%", delay: 0, speed: 15, floatDelay: 0 },
    { left: "30%", width: 220, height: 110, top: "25%", delay: 0.1, speed: 12, floatDelay: 0.5 },
    { left: "60%", width: 200, height: 100, top: "20%", delay: 0.2, speed: 10, floatDelay: 1 },
    { left: "85%", width: 160, height: 80, top: "30%", delay: 0.3, speed: 8, floatDelay: 1.5 },
    { left: "45%", width: 240, height: 120, top: "10%", delay: 0.4, speed: 5, floatDelay: 2 },
  ]

  // Create scroll-based Y positions for each cloud
  const cloudYPositions = useTransform(
    scrollProgress,
    [0, 1],
    cloudPositions.map((_, index) => [0, -100 - index * 20]),
  )

  return (
    <motion.div
      className="absolute inset-x-0 z-30"
      style={{
        opacity,
        willChange: "opacity",
      }}
    >
      {cloudPositions.map((cloud, index) => {
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: cloud.left,
              top: cloud.top,
              y: cloudYPositions[index], // Apply scroll-based movement
              width: `${cloud.width}px`,
              height: `${cloud.height}px`,
              animation: `float 8s ease-in-out ${cloud.floatDelay}s infinite`,
              transformStyle: "preserve-3d", // Enable 3D transformations
            }}
            animate={{
              x: mousePosition.x * cloud.speed,
              rotateY: mousePosition.x * 5, // Add rotation for 3D effect
              z: 50 + index * 10, // Add z-depth for 3D effect
            }}
            transition={{
              type: "spring",
              stiffness: 40,
              damping: 20,
              delay: cloud.delay,
            }}
          >
            <Cloud width={cloud.width} height={cloud.height} />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// Cloud Component
function Cloud({ width, height }: { width: number; height: number }) {
  return (
    <svg viewBox="0 0 200 100" width={width} height={height} className="drop-shadow-lg">
      <defs>
        <radialGradient id="cloudGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      <g>
        <ellipse cx="80" cy="60" rx="40" ry="30" fill="url(#cloudGradient)" />
        <ellipse cx="120" cy="60" rx="40" ry="30" fill="url(#cloudGradient)" />
        <ellipse cx="60" cy="50" rx="30" ry="20" fill="url(#cloudGradient)" />
        <ellipse cx="100" cy="40" rx="35" ry="25" fill="url(#cloudGradient)" />
        <ellipse cx="140" cy="50" rx="30" ry="20" fill="url(#cloudGradient)" />
      </g>
    </svg>
  )
}
