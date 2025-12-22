"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Truck, CreditCard, RefreshCcw, ArrowUpRight } from "lucide-react"

const points = [
  {
    icon: ShieldCheck,
    title: "1000+ Happy Customers",
    desc: "Secure checkout, verified products, and zero tolerance for low-quality sellers.",
  },
  {
    icon: Truck,
    title: "Fast Fulfillment",
    desc: "Orders ship quickly with live tracking updates at every step of the journey.",
  },
  {
    icon: CreditCard,
    title: "Pay Your Way",
    desc: "UPI, cards, wallets, net banking, and Cash on Delivery supported.",
  },
  {
    icon: RefreshCcw,
    title: "No-Stress Returns",
    desc: "Simple return flow designed to protect the customer, not the system.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
}

export default function WhyChooseUsGrid() {
  return (
    <section className="relative py-24 bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* Background Noise/Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24 max-w-2xl">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 block mb-4"
          >
            Why Choose Us
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95]"
          >
            Built for <span className="text-neutral-500">Trust.</span> <br />
            Designed for <span className="text-white">Speed.</span>
          </motion.h2>
        </div>

        {/* 2x2 Grid Layout (Matching Reference Image) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {points.map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className={`group relative overflow-hidden rounded-[2.5rem] p-8 flex flex-col justify-between bg-linear-to-br  backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]`}
            >
              
              {/* Content Top Left */}
              <div className="relative z-20 max-w-[70%]">
                <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4 text-white">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-white/60 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* "Learn More" Link Bottom Left */}
              <div className="relative z-20 mt-8">
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                  Learn More <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className={`absolute -bottom-6 -right-6 md:-right-10 md:bottom--5 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6`}>
                 <div className="absolute inset-0 blur-[60px] opacity-40 bg-current scale-75" />
                 <item.icon strokeWidth={1} className="w-48 h-48 md:w-64 md:h-64 opacity-100 drop-shadow-2xl" />
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}