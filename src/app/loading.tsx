export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-white blur-3xl animate-pulse delay-700" />
      </div>

      {/* Loader content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo / Brand mark */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full border border-white flex items-center justify-center">
            <span className="text-sm tracking-widest font-semibold text-neutral-200">
              <img src="/logos/ff-logo.png" alt="fashion friday" className="w-10 h-auto" />
            </span>
          </div>

          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border-y-2 border-black animate-spin" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-black tracking-[0.3em] text-xs uppercase">
            Loading The Page
          </p>

          {/* Loading dots */}
          <div className="flex gap-1 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-black animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-black animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-black animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
