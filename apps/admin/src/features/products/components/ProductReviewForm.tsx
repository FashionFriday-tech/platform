import Image from 'next/image';

export interface ReviewFormData {
  userName: string;
  rating: number;
  comment: string;
  productImage: string;
  imageFile: File | null;
}

interface Props {
  newReview: ReviewFormData;
  setNewReview: React.Dispatch<React.SetStateAction<ReviewFormData>>;
  handleAddSubmit: () => void;
  setIsAdding: (val: boolean) => void;
}

export function ProductReviewForm({
  newReview,
  setNewReview,
  handleAddSubmit,
  setIsAdding,
}: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-top-4 mb-8 rounded-3xl border border-black/10 bg-black/5 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h3 className="mb-4 text-lg font-black text-black uppercase dark:text-white">
        Create New Review
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
              Customer Name
            </label>
            <input
              type="text"
              value={newReview.userName}
              onChange={(e) => {
                setNewReview({ ...newReview, userName: e.target.value });
              }}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black outline-none dark:border-white/10 dark:bg-black dark:text-white"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
              Rating (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) => {
                setNewReview({ ...newReview, rating: parseInt(e.target.value) ?? 1 });
              }}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black outline-none dark:border-white/10 dark:bg-black dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
            Add Image (Optional)
          </label>
          <div className="flex items-center gap-4">
            {newReview.productImage && (
              <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
                <Image
                  width={500}
                  height={500}
                  src={newReview.productImage}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => {
                    setNewReview({ ...newReview, productImage: '' });
                  }}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black"
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
            <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border border-dashed border-black/20 transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5">
              <svg
                className="h-6 w-6 text-black/40 dark:text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewReview({ ...newReview, productImage: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
            Comment
          </label>
          <textarea
            value={newReview.comment}
            onChange={(e) => {
              setNewReview({ ...newReview, comment: e.target.value });
            }}
            rows={3}
            className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black outline-none dark:border-white/10 dark:bg-black dark:text-white"
            placeholder="Write the review here..."
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleAddSubmit}
            className="rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white hover:opacity-90 dark:bg-white dark:text-black"
          >
            Submit Review
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
            }}
            className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-bold text-black hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
