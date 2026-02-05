"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  motion, 
  useMotionValue, 
  useTransform, 
  animate, 
  type Transition 
} from "framer-motion";
import { cn } from "@/lib/utils";

import { 
  MenuOutlineIcon, 
  PromoIcon, 
  BellOffIcon, 
  ShoppingBagIcon
} from "@ff/ui";

const TABS = ["all", "orders", "promo"] as const;
type TabType = typeof TABS[number];

export default function NotificationsPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const snapTransition: Transition = {
    type: "spring",
    bounce: 0,
    duration: 0.3,
  };

  useEffect(() => {
    if (containerWidth > 0) {
      animate(x, -activeIndex * containerWidth, snapTransition);
    }
  }, [activeIndex, containerWidth, x]);

  const indicatorX = useTransform(
    x,
    [0, -containerWidth * (TABS.length - 1) || -1],
    ["0%", `${(TABS.length - 1) * 100}%`]
  );

  const handleDragEnd = (_: any, info: any) => {
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    // SENSITIVITY: 10% of width or a flick faster than 200px/s
    const swipeThreshold = containerWidth * 0.1; 

    let nextIndex = activeIndex;

    if (velocity < -200 || offset < -swipeThreshold) {
      nextIndex = Math.min(activeIndex + 1, TABS.length - 1);
    } else if (velocity > 200 || offset > swipeThreshold) {
      nextIndex = Math.max(activeIndex - 1, 0);
    }

    setActiveIndex(nextIndex);
    // Force immediate snap
    animate(x, -nextIndex * containerWidth, snapTransition);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden overscroll-none select-none pt-16 md:pt-20">
      <header className="relative z-30 border-b border-foreground/10 bg-background shrink-0">
        <div className="mx-auto px-4 relative max-w-md">
          <nav className="flex w-full">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "flex-1 py-4 text-sm font-medium capitalize transition-colors outline-none flex gap-2 justify-center items-center",
                  activeIndex === i ? "text-foreground" : "text-foreground/40"
                )}
              >
                {tab == "all" ? <MenuOutlineIcon className="w-4"/> 
                : tab =="orders" ? <ShoppingBagIcon className="w-4"/> 
                : <PromoIcon className="w-4"/> }
               {tab}
              </button>
            ))}
          </nav>
          <motion.div
            style={{ x: indicatorX, width: `${100 / TABS.length}%` }}
            className="absolute bottom-0 left-0 px-4"
          >
            <div className="h-0.5 bg-foreground w-full rounded-full" />
          </motion.div>
        </div>
      </header>

      <main 
        className="flex-1 w-full relative overflow-hidden" 
        ref={containerRef}
      >
        <motion.div
          drag="x"
          dragDirectionLock
          dragMomentum={false} // Crucial: stops the list from drifting away
          dragConstraints={{ left: -containerWidth * (TABS.length - 1), right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          style={{ 
            x, 
            width: containerWidth * TABS.length || "300%",
            touchAction: 'pan-y' // Allows vertical scroll while capturing horizontal swipe
          }}
          className="flex h-full cursor-grab active:cursor-grabbing"
        >
          {TABS.map((tabType, i) => (
            <div
              key={tabType}
              style={{ width: containerWidth || "100vw" }}
              className="flex-none h-full relative"
            >
              <div 
                className="absolute inset-0 overflow-y-auto overscroll-contain px-2 pt-2 scroll-smooth"
                style={{ touchAction: 'pan-y' }}
              >
                <motion.div
                  animate={{ opacity: activeIndex === i ? 1 : 0.4 }}
                  transition={{ duration: 0.2 }}
                  className="pb-24"
                >
                  <NotificationList type={tabType} />
                </motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

function NotificationList({ type }: { type: TabType }) {
  const notifications = useMemo(() => {
    if (type === "all") return MOCK_NOTIFICATIONS;
    return MOCK_NOTIFICATIONS.filter((n) =>
      type === "orders" ? n.type === "order" : n.type === "promo"
    );
  }, [type]);

  if (notifications.length === 0) {
    return (
      <div className="py-32 text-center text-foreground/30">
        <BellOffIcon className="mx-auto mb-4 opacity-10" size={48} />
        <p className="text-sm">No {type} notifications</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-foreground/5">
      {notifications.map((n) => (
        <div key={n.id} className="flex gap-4 p-5">
          <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-foreground text-background">
            {n.type === "order" ? <ShoppingBagIcon size={25} /> : <PromoIcon size={25} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline gap-2">
              <h3 className="text-[14px] font-semibold truncate">{n.title}</h3>
              <span className="shrink-0 text-[10px] font-medium text-foreground/40 uppercase">{n.timestamp}</span>
            </div>
            <p className="text-[13px] text-foreground/60 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const MOCK_NOTIFICATIONS = [
  { id: "1", type: "order", title: "Order Shipped", message: "Your order #FF-2025 has been shipped.", timestamp: "2 mins ago" },
  { id: "2", type: "promo", title: "Flash Sale Alert", message: "The Monochrome Collection is now 40% off.", timestamp: "1 hour ago" },
  { id: "3", type: "order", title: "Order Delivered", message: "Order #FF-2023 has been delivered.", timestamp: "2 days ago" },
  { id: "4", type: "promo", title: "Exclusive Access", message: "Early access to our anniversary sale.", timestamp: "3 days ago" },
  { id: "5", type: "order", title: "Order Confirmed", message: "We’ve received your order #FF-2031.", timestamp: "5 days ago" },
  { id: "6", type: "promo", title: "Free Shipping", message: "Enjoy free shipping on all orders.", timestamp: "1 week ago" },
  { id: "7", type: "order", title: "Order Shipped", message: "Your order #FF-2025 has been shipped.", timestamp: "2 mins ago" },
  { id: "8", type: "promo", title: "Flash Sale Alert", message: "The Monochrome Collection is now 40% off.", timestamp: "1 hour ago" },
  { id: "9", type: "order", title: "Order Delivered", message: "Order #FF-2023 has been delivered.", timestamp: "2 days ago" },
  { id: "10", type: "promo", title: "Exclusive Access", message: "Early access to our anniversary sale.", timestamp: "3 days ago" },
  { id: "11", type: "order", title: "Order Confirmed", message: "We’ve received your order #FF-2031.", timestamp: "5 days ago" },
  { id: "12", type: "promo", title: "Free Shipping", message: "Enjoy free shipping on all orders.", timestamp: "1 week ago" },
];