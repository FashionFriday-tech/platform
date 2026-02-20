import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-forground absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 animate-pulse rounded-full blur-3xl" />
        <div className="bg-forground absolute bottom-0 right-1/3 h-72 w-72 animate-pulse rounded-full blur-3xl delay-700" />
      </div>

      {/* Loader content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo / Brand mark */}
        <div className="relative">
          <div className="border-foreground flex h-16 w-16 items-center justify-center rounded-full border">
            <span className="text-sm font-semibold tracking-widest">
              <Image
                src="/images/logos/ff-logo.png"
                alt="FF logo"
                width={40}
                height={40}
                className="h-auto w-10 dark:invert"
                priority
              />
            </span>
          </div>

          {/* Rotating ring */}
          <div className="border-forground absolute inset-0 animate-spin rounded-full border-y-2" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-forground text-xs uppercase tracking-[0.3em]">Loading The Page</p>

          {/* Loading dots */}
          <div className="mt-1 flex gap-1">
            <span className="bg-forground h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
            <span className="bg-forground h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
            <span className="bg-forground h-1.5 w-1.5 animate-bounce rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
