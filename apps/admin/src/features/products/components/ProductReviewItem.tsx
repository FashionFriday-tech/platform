import Image from 'next/image';

import type { Review } from '@ff/schemas';

interface Props {
  review: Review;
  menuOpenId: string | null;
  setMenuOpenId: (id: string | null) => void;
  startEdit: (review: Review) => void;
  handleDelete: (id: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setEditData: (val: any) => void;
  handleEditSubmit: () => void;
}

export function ProductReviewItem({
  review,
  menuOpenId,
  setMenuOpenId,
  startEdit,
  handleDelete,
  editingId,
  setEditingId,
  editData,
  setEditData,
  handleEditSubmit,
}: Props) {
  return (
    <div className="group relative flex flex-col gap-6 rounded-3xl border border-black/5 bg-black/5 p-6 md:flex-row dark:border-white/5 dark:bg-white/5">
      {/* Context Menu */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => {
            setMenuOpenId(menuOpenId === review.id ? null : review.id);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-black/50 shadow-sm backdrop-blur-md transition-colors hover:bg-black/10 dark:bg-black/80 dark:text-white/50 dark:hover:bg-white/10"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
        {menuOpenId === review.id && (
          <div className="absolute right-0 mt-1 w-32 overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1a1a]">
            <button
              onClick={() => {
                startEdit(review);
              }}
              className="w-full px-4 py-2.5 text-left text-xs font-bold text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
            >
              Edit Review
            </button>
            <button
              onClick={() => {
                handleDelete(review.id);
              }}
              className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-500 hover:bg-red-500/10"
            >
              Delete Review
            </button>
          </div>
        )}
      </div>

      {/* Editing State */}
      {editingId === review.id ? (
        <div className="mt-1 w-full space-y-3">
          <input
            type="text"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            value={editData.userName}
            onChange={(e) => {
              setEditData({ ...editData, userName: e.target.value });
            }}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-bold text-black outline-none dark:border-white/10 dark:bg-black dark:text-white"
          />
          <input
            type="number"
            min="1"
            max="5"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            value={editData.rating}
            onChange={(e) => {
              setEditData({ ...editData, rating: parseInt(e.target.value) || 1 });
            }}
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-bold text-black outline-none dark:border-white/10 dark:bg-black dark:text-white"
          />
          <div className="flex items-center gap-3">
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            {editData.productImage && (
              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
                <Image
                  width={500}
                  height={500}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                  src={editData.productImage}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => {
                    setEditData({ ...editData, productImage: '' });
                  }}
                  className="absolute top-0.5 right-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-black/5 px-3 py-2 text-xs font-bold transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditData({ ...editData, productImage: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
          <textarea
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            value={editData.comment}
            onChange={(e) => {
              setEditData({ ...editData, comment: e.target.value });
            }}
            rows={3}
            className="w-full resize-none rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black outline-none dark:border-white/10 dark:bg-black dark:text-white"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleEditSubmit}
              className="rounded-lg bg-black px-4 py-1.5 text-xs font-bold text-white hover:opacity-90 dark:bg-white dark:text-black"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingId(null);
              }}
              className="rounded-lg border border-black/10 px-4 py-1.5 text-xs font-bold text-black hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Image Section (Matches web app) */}
          {review.productImage && (
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[2rem] bg-black/5 shadow-sm md:w-32 lg:w-40 dark:bg-white/5">
              <Image
                width={500}
                height={500}
                src={review.productImage}
                alt="review"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="flex flex-1 flex-col items-start pt-2 pr-4">
            <div className="mb-3 flex items-center text-yellow-500">
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              {[...Array(5)].map((_, idx) => (
                <svg
                  key={idx}
                  className={`h-4 w-4 ${idx >= review.rating ? 'text-black/10 dark:text-white/10' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>

            <p className="mb-4 text-sm leading-relaxed font-medium text-black/70 italic dark:text-white/70">
              "{review.comment}"
            </p>

            <div className="mt-auto flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[10px] font-black text-white uppercase dark:bg-white dark:text-black">
                  {review.userName.slice(0, 2)}
                </span>
                <span className="text-xs font-black tracking-tight text-black uppercase dark:text-white">
                  {review.userName}
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-black/40 uppercase dark:text-white/40">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
