export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-forground blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-forground blur-3xl animate-pulse delay-700" />
      </div>

      {/* Loader content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo / Brand mark */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full border border-foreground flex items-center justify-center">
            <span className="text-sm tracking-widest font-semibold">
              <img src="/images/logos/ff-logo.png" alt="FF" className="w-10 h-auto dark:invert" />
            </span>
          </div>

          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border-y-2 border-forground animate-spin" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-forground tracking-[0.3em] text-xs uppercase">
            Loading The Page
          </p>

          {/* Loading dots */}
          <div className="flex gap-1 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-forground animate-bounce [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-forground animate-bounce [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-forground animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
