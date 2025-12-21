"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Play } from "lucide-react"
import { useRouter } from "next/navigation"

/* ---------------- TYPES ---------------- */
type Product = {
  id: number
  title: string
  tag: string
  image: string
  link: string
}

/* ---------------- DATA ---------------- */
const products: Product[] = [
  {
    id: 1,
    title: "The Roseline Ring",
    tag: "Rings",
    image: "/images/influencers/1.png",
    link: "/shop/rings/roseline",
  },
  {
    id: 2,
    title: "Zoe Link Earrings",
    tag: "Earrings",
    image: "/images/influencers/2.png",
    link: "/shop/earrings/zoe",
  },
  {
    id: 3,
    title: "The Hibiscus Ring II",
    tag: "Best Seller",
    image: "/images/influencers/3.png",
    link: "/shop/rings/hibiscus",
  },
  {
    id: 4,
    title: "Chubby Gold Hoops",
    tag: "Hoops",
    image: "/images/influencers/4.png",
    link: "/shop/earrings/hoops",
  },
  {
    id: 5,
    title: "Serpent Chain",
    tag: "Necklaces",
    image: "/images/influencers/5.png",
    link: "/shop/necklaces/serpent",
  },
   {
    id: 6,
    title: "Serpent Chain",
    tag: "Necklaces",
    image: "/images/influencers/6.png",
    link: "/shop/necklaces/serpent",
  }
]

/* ---------------- HELPER ---------------- */
// Handles negative modulo correctly (e.g. -1 % 6 = 5)
const mod = (n: number, m: number) => ((n % m) + m) % m

export default function TrendingCoverflowPage() {
  const router = useRouter()
  // We allow this index to go infinite (e.g., 100, 101, 102...)
  // This prevents the "rewind" animation when looping.
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => setCurrentIndex((prev) => prev + 1)
  const handlePrev = () => setCurrentIndex((prev) => prev - 1)

  const handleCardClick = (virtualIndex: number, link: string) => {
    if (virtualIndex === currentIndex) {
      router.push(link)
    } else {
      setCurrentIndex(virtualIndex)
    }
  }

  // Determines the style based on how far the card is from the center (offset)
  const getVariant = (offset: number) => {
    // Active (Center)
    if (offset === 0) {
      return {
        x: "0%",
        scale: 0.6,
        rotateY: 0,
        zIndex: 10,
        opacity: 1,
        filter: "brightness(1) blur(0px)",
      }
    }

    // Neighbors (+1 or -1)
    if (Math.abs(offset) === 1) {
      const dir = Math.sign(offset)
      return {
        x: `${dir * 65}%`,
        scale: 0.65,
        rotateY: `${dir * -20}deg`,
        zIndex: 40, 
        opacity: 1,
        filter: "brightness(1) blur(0px)",
      }
    }

    // Far Neighbors (+2 or -2)
    if (Math.abs(offset) === 2) {
      const dir = Math.sign(offset)
      return {
        x: `${dir * 140}%`,
        scale: 0.80,
        rotateY: `${dir * -60}deg`,
        zIndex: 30,
        opacity: 1,
        filter: "brightness(1) blur(0px)",
      }
    }

    // Hidden / Offscreen (+3 or -3)
    const dir = Math.sign(offset)
    return {
      x: `${dir * 300}%`,
      scale: 1,
      rotateY: `${dir * -80}deg`,
      zIndex: 10,
      opacity: 0,
      filter: "brightness(0) blur(0)",
    }
  }

  // We render a fixed window of cards around the current index
  // e.g., if current is 10, we render 7, 8, 9, 10, 11, 12, 13
  const visibleRange = [-3, -2, -1, 0, 1, 2, 3]

  return (
    <section className="w-full py-24 bg-white text-black overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-16">
        <h2 className="text-4xl md:text-7xl font-extrabold uppercase tracking-tight">
          Content Partners
        </h2>
        <p className="text-black/60 mt-4 max-w-md mx-auto">
          Creators and pages who promote our products across social media.
        </p>
      </div>

      <div className="relative w-full h-[500px] flex items-center justify-center my-10">
        <div 
          className="relative w-full max-w-6xl h-full flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          {/* We map the OFFSETS, not the products directly */}
          {visibleRange.map((offset) => {
            const virtualIndex = currentIndex + offset
            // Map the virtual index (infinite) to the actual data index (0 to 5)
            const productIndex = mod(virtualIndex, products.length)
            const product = products[productIndex]
            const variant = getVariant(offset)
            const isActive = offset === 0

            return (
              <motion.div
                // KEY CHANGE: Using virtualIndex as key ensures Framer treats 
                // the card moving from right to left as the SAME card, 
                // preventing the "fly back" glitch.
                key={virtualIndex}
                animate={variant}
                initial={variant}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                onClick={() => handleCardClick(virtualIndex, product.link)}
                className="absolute w-[280px] md:w-[350px] aspect-[3/5] rounded-3xl bg-zinc-900 shadow-2xl cursor-pointer overflow-hidden "
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={isActive}
                  />

                  {/* Play Button (Centered on ALL cards) */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/30
                        transition-all duration-500 ease-out shadow-lg
                        ${isActive
                          ? "bg-white/30 opacity-100 scale-110 hover:bg-white hover:text-black hover:scale-125"
                          : "bg-black/20 opacity-60 scale-90"
                        }
                      `}
                    >
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>

                  {/* Gradient & Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
                  
                  <motion.div
                    className="absolute bottom-8 left-0 right-0 text-center z-30 text-white px-4 pointer-events-none"
                    animate={{ opacity: isActive ? 1 : 0.5, y: isActive ? 0 : 10 }}
                  >
                    <h3 className="text-xl font-bold md:text-2xl drop-shadow-md">{product.title}</h3>
                    <p className="text-sm text-white/80 uppercase tracking-wider mt-1 drop-shadow-md">{product.tag}</p>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition active:scale-95"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}