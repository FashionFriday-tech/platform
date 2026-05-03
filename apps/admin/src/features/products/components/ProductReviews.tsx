"use client";

import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Review } from "@ff/schemas";

interface Props {
  productId: string;
}

const INITIAL_MOCK_REVIEWS: Review[] = [
  {
    id: uuidv4(),
    productId: "081794MT",
    userId: uuidv4(),
    userName: "Alex M.",
    rating: 5,
    comment: "Absolutely love this piece. The quality is exceptional and it fits perfectly just as described in the size guide. Would definitely recommend to anyone.",
    productImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: uuidv4(),
    productId: "081794MT",
    userId: uuidv4(),
    userName: "Jordan K.",
    rating: 5,
    comment: "The materials used are top notch. I've washed it twice already and it holds its shape and color flawlessly. Shipping was incredibly fast too.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
  {
    id: uuidv4(),
    productId: "081794MT",
    userId: uuidv4(),
    userName: "Sam R.",
    rating: 4,
    comment: "Overall a fantastic product. The design is super trendy. I would suggest sizing up if you prefer a more oversized, relaxed look.",
    productImage: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
  }
];

export function ProductReviews({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_MOCK_REVIEWS);
  const [sortOption, setSortOption] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newReview, setNewReview] = useState({ userName: "", rating: 5, comment: "", productImage: "" });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ userName: "", rating: 5, comment: "", productImage: "" });
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      switch (sortOption) {
        case "highest": return b.rating - a.rating;
        case "lowest": return a.rating - b.rating;
        case "newest": return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest": return a.createdAt.getTime() - b.createdAt.getTime();
        default: return 0;
      }
    });
  }, [reviews, sortOption]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const handleAddSubmit = () => {
    if (!newReview.userName || !newReview.comment) return;
    const review: Review = {
      id: uuidv4(),
      productId,
      userId: uuidv4(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      productImage: newReview.productImage || undefined,
      createdAt: new Date(),
    };
    setReviews((prev) => [review, ...prev]);
    setIsAdding(false);
    setNewReview({ userName: "", rating: 5, comment: "", productImage: "" });
  };

  const handleEditSubmit = () => {
    if (!editingId || !editData.userName || !editData.comment) return;
    setReviews((prev) => prev.map(rev => 
      rev.id === editingId ? { ...rev, userName: editData.userName, rating: editData.rating, comment: editData.comment, productImage: editData.productImage || undefined } : rev
    ));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter(r => r.id !== id));
    setMenuOpenId(null);
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditData({ userName: review.userName, rating: review.rating, comment: review.comment, productImage: review.productImage || "" });
    setMenuOpenId(null);
  };

  return (
    <div className="border-t border-black/10 dark:border-white/10 pt-16">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2 text-black dark:text-white">Customer Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-yellow-500">
              {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className={`w-5 h-5 ${i > parseFloat(averageRating as string) ? 'text-black/10 dark:text-white/10' : ''}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              ))}
            </div>
            <span className="text-sm font-bold text-black dark:text-white">{averageRating} out of 5</span>
            <span className="text-sm font-bold text-black/40 dark:text-white/40">({reviews.length} reviews)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-transparent text-sm font-bold text-black dark:text-white flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {sortOption === "newest" && "Newest First"}
              {sortOption === "oldest" && "Oldest First"}
              {sortOption === "highest" && "Highest Rating"}
              {sortOption === "lowest" && "Lowest Rating"}
              <svg className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-20">
                {[
                  { id: "newest", label: "Newest First" },
                  { id: "oldest", label: "Oldest First" },
                  { id: "highest", label: "Highest Rating" },
                  { id: "lowest", label: "Lowest Rating" }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => { setSortOption(opt.id as any); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white ${sortOption === opt.id ? 'bg-black/5 dark:bg-white/5' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsAdding(true)} 
            className="px-6 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-bold hover:scale-105 transition-transform"
          >
            Add Review
          </button>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="mb-8 p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-black uppercase mb-4 text-black dark:text-white">Create New Review</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1 block">Customer Name</label>
                <input type="text" value={newReview.userName} onChange={e => setNewReview({...newReview, userName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/10 text-sm font-medium outline-none text-black dark:text-white" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1 block">Rating (1-5)</label>
                <input type="number" min="1" max="5" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value) || 1})} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/10 text-sm font-medium outline-none text-black dark:text-white" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1 block">Add Image (Optional)</label>
              <div className="flex items-center gap-4">
                {newReview.productImage && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
                    <img src={newReview.productImage} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => setNewReview({...newReview, productImage: ""})} className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-black">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                )}
                <label className="cursor-pointer flex items-center justify-center w-16 h-16 rounded-xl border border-dashed border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <svg className="w-6 h-6 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setNewReview({...newReview, productImage: reader.result as string});
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60 mb-1 block">Comment</label>
              <textarea value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} rows={3} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/10 text-sm font-medium outline-none text-black dark:text-white resize-none" placeholder="Write the review here..."></textarea>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={handleAddSubmit} className="px-6 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-bold hover:opacity-90">Submit Review</button>
              <button onClick={() => setIsAdding(false)} className="px-6 py-2.5 rounded-full border border-black/10 dark:border-white/10 text-sm font-bold text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {sortedReviews.length === 0 && !isAdding ? (
          <div className="col-span-full py-12 text-center text-black/50 dark:text-white/50 text-sm font-bold">No reviews found.</div>
        ) : sortedReviews.map((review) => (
          <div key={review.id} className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 relative group flex flex-col md:flex-row gap-6">
            
            {/* Context Menu */}
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setMenuOpenId(menuOpenId === review.id ? null : review.id)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm hover:bg-black/10 dark:hover:bg-white/10 text-black/50 dark:text-white/50 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
              </button>
              {menuOpenId === review.id && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-xl overflow-hidden">
                  <button onClick={() => startEdit(review)} className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white">Edit Review</button>
                  <button onClick={() => handleDelete(review.id)} className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-red-500/10 text-red-500">Delete Review</button>
                </div>
              )}
            </div>

            {/* Editing State */}
            {editingId === review.id ? (
              <div className="space-y-3 mt-1 w-full">
                <input type="text" value={editData.userName} onChange={e => setEditData({...editData, userName: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 text-xs font-bold outline-none text-black dark:text-white" />
                <input type="number" min="1" max="5" value={editData.rating} onChange={e => setEditData({...editData, rating: parseInt(e.target.value) || 1})} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 text-xs font-bold outline-none text-black dark:text-white" />
                <div className="flex items-center gap-3">
                  {editData.productImage && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
                      <img src={editData.productImage} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => setEditData({...editData, productImage: ""})} className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white hover:bg-black">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  )}
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setEditData({...editData, productImage: reader.result as string});
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                </div>
                <textarea value={editData.comment} onChange={e => setEditData({...editData, comment: e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 text-xs font-medium outline-none text-black dark:text-white resize-none"></textarea>
                <div className="flex items-center gap-2">
                  <button onClick={handleEditSubmit} className="px-4 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-4 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-xs font-bold text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                {/* Image Section (Matches web app) */}
                {review.productImage && (
                  <div className="relative aspect-square w-full md:w-32 lg:w-40 shrink-0 overflow-hidden rounded-[2rem] bg-black/5 dark:bg-white/5 shadow-sm">
                    <img
                      src={review.productImage}
                      alt="review"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                )}

                {/* Content Section */}
                <div className="flex flex-1 flex-col items-start pt-2 pr-4">
                  <div className="flex items-center text-yellow-500 mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <svg key={idx} className={`w-4 h-4 ${idx >= review.rating ? 'text-black/10 dark:text-white/10' : ''}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    ))}
                  </div>
                  
                  <p className="text-sm font-medium text-black/70 dark:text-white/70 leading-relaxed mb-4 italic">
                    "{review.comment}"
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase">
                        {review.userName.slice(0, 2)}
                      </span>
                      <span className="text-xs font-black uppercase tracking-tight text-black dark:text-white">
                        {review.userName}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
