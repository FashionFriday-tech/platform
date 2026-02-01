"use client";

import { useState, useRef, useEffect } from "react";
import { Star, Plus, X, ArrowLeft, ArrowRight, Camera } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useAnimationFrame,
  useMotionValue,
  wrap,
} from "framer-motion";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaInfoCircle } from "react-icons/fa";

export default function ReviewSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Form States
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const CHARACTER_LIMIT = 100;

  const reviews = [
    {
      name: "Damon W.",
      initials: "DW",
      comment:
        "Aggressive silhouette. Fabric is heavy and feels expensive. This is a total grail piece for any collection.",
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
      rating: 5,
      membership: "silver",
    },
    {
      name: "Sasha R.",
      initials: "SR",
      comment:
        "Incredible attention to detail. Fits slightly oversized. The texture is exactly what I expected.",
      image:
        "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800",
      rating: 4,
      membership: "gold",
    },
    {
      name: "Leo K.",
      initials: "LK",
      comment:
        "The perfect staple. Color is richer in person. Highly recommend for daily wear.",
      image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
      rating: 5,
      membership: "platinum",
    },
  ];

  const duplicatedReviews = [...reviews, ...reviews, ...reviews, ...reviews];
  const x = useMotionValue(0);
  const CARD_WIDTH = 400;
  const GAP = 16;
  const TOTAL_SET_WIDTH = reviews.length * (CARD_WIDTH + GAP);

  useAnimationFrame((t, delta) => {
    if (isPaused || isModalOpen || isFormOpen) return;
    const moveBy = -0.8;
    let currentX = x.get();
    let newX = currentX + moveBy;
    x.set(wrap(-TOTAL_SET_WIDTH, 0, newX));
  });

  const nextModal = () =>
    setSelectedReview((prev) => (prev + 1) % reviews.length);
  const prevModal = () =>
    setSelectedReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <div className="bg-[#050505] text-white py-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10 max-w-3xl mx-auto">
          <div>
            <h2 className="text-[14px] font-black uppercase tracking-[0.3em] italic">
              Reviews
            </h2>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, starIndex) => (
                <Star
                  key={starIndex}
                  size={10}
                  className={
                    starIndex < 4
                      ? "fill-foreground text-foreground"
                      : "text-foreground"
                  }
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-xl"
          >
            <FaInfoCircle size={16} />
          </button>
        </div>

        {/* --- THE SCROLLING TRACK --- */}
        <div
          className="relative w-full overflow-visible"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            style={{ x }}
            drag="x"
            onDragStart={() => setIsPaused(true)}
            onDragEnd={() => setIsPaused(false)}
            onUpdate={(latest) => {
              const latestX = latest.x as number;
              if (latestX <= -TOTAL_SET_WIDTH || latestX >= 0) {
                x.set(wrap(-TOTAL_SET_WIDTH, 0, latestX));
              }
            }}
            className="flex gap-4 w-max cursor-grab active:cursor-grabbing"
          >
            {duplicatedReviews.map((rev, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedReview(i % reviews.length);
                  setIsModalOpen(true);
                }}
                className="flex flex-col items-start gap-4 rounded-4xl p-1 border border-transparent bg-white text-black w-[400px] shrink-0 pointer-events-auto shadow-2xl transition-shadow hover:shadow-white/5"
              >
                <div className="flex gap-3 justify-between items-center w-full">
                  <div className="w-40 aspect-square shrink-0 rounded-4xl overflow-hidden bg-zinc-800 pointer-events-none">
                    <img
                      src={rev.image}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 flex flex-col items-start gap-2 pr-2">
                    <div className="flex justify-start items-center gap-2">
                      <div className="p-0.5 border rounded-full border-dashed border-black">
                        <span className="w-10 h-10 bg-black text-white text-[12px] font-black rounded-full flex justify-center items-center uppercase">
                          {rev.initials}
                        </span>
                      </div>
                      <div className="flex flex-col ">
                        <span className="text-[14px] font-black uppercase flex items-center leading-none">
                          {rev.name}
                          <RiVerifiedBadgeFill
                            className={`w-5 ml-1 mb-0.5 ${
                              rev.membership === "silver"
                                ? "text-gray-400"
                                : rev.membership === "gold"
                                ? "text-yellow-500"
                                : "text-blue-400"
                            }`}
                          />
                        </span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              size={10}
                              className={
                                starIndex < rev.rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-yellow-500"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-medium leading-snug opacity-80 line-clamp-3 italic">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      {/*Add Review Section*/}
      <div className="flex w-full justify-center items-center gap-2 mt-10">
        {[...Array(5)].map((_, starIndex) => (
          <Star
            key={starIndex}
            size={42}
            strokeWidth={0.5}
            onClick={() => {
              setNewRating(starIndex + 1);
              setIsFormOpen(true);
            }}
            className={`cursor-pointer transition-colors text-white`}
          />
        ))}
      </div>
      {/* --- MODAL (Full View) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-white opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={32} />
            </button>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -100) nextModal();
                if (info.offset.x > 100) prevModal();
              }}
              className="w-full max-w-5xl flex flex-col md:flex-row gap-12 items-center"
            >
              <div className="w-full md:w-1/2 aspect-square rounded-[3rem] overflow-hidden">
                <motion.img
                  key={selectedReview}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={reviews[selectedReview].image}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6 md:w-1/2">
                <div className="flex items-center gap-4">
                  <span className="w-14 h-14 bg-white text-black font-black rounded-full flex items-center justify-center text-xl">
                    {reviews[selectedReview].initials}
                  </span>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                    {reviews[selectedReview].name}
                  </h2>
                </div>
                <p className="text-xl md:text-3xl font-medium italic text-white/90 leading-tight">
                  "{reviews[selectedReview].comment}"
                </p>
                <div className="flex gap-4 pt-8">
                  <button
                    onClick={prevModal}
                    className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <ArrowLeft />
                  </button>
                  <button
                    onClick={nextModal}
                    className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <ArrowRight />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ADD REVIEW FORM DRAWER --- */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 z-40 bg-background/90"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 z-50 p-10 rounded-t-[3rem] bg-background border-t border-foreground shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            >
              <div className="max-w-md mx-auto space-y-8">
                <div className="flex justify-between items-center text-foreground">
                  <h3 className="font-black uppercase text-[10px] tracking-[0.3em]">
                    Drop your Review
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Comment with Countdown */}
                <div className="space-y-3 relative">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20">
                      Experience
                    </label>
                    <span
                      className={`text-[10px] font-black tracking-widest ${
                        CHARACTER_LIMIT - newComment.length < 0
                          ? "text-red-500"
                          : "text-white/20"
                      }`}
                    >
                      {CHARACTER_LIMIT - newComment.length}
                    </span>
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="The cut, the feel, the vibe..."
                    className={`w-full bg-white/5 text-white border rounded-2xl p-5 h-32 outline-none text-sm font-medium transition-colors ${
                      CHARACTER_LIMIT - newComment.length < 0
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-white/40"
                    }`}
                  />
                </div>

                <div className="flex w-full justify-center items-center gap-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <motion.button
                      key={starIndex}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNewRating(starIndex + 1)}
                      type="button"
                    >
                      <Star
                        size={28}
                        className={
                          starIndex < newRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-yellow-400"
                        }
                      />
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex-1 py-4 rounded-full bg-white text-black font-black uppercase text-xs tracking-widest active:scale-95 transition-all disabled:opacity-50"
                    disabled={newComment.length === 0 || newRating === 0}
                  >
                    Publish Review
                  </button>
                  <button className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/40 border border-white/10 hover:text-white transition-all">
                    <Camera size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
