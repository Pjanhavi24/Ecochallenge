import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        fill="none"
        className="h-10 w-10 text-slate-900 transition-transform duration-200 hover:scale-110"
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="animate-pulse"
        />
        <path
          d="M20 28c-3 0-5-2-5-4s2-2 5-2 5 2 5 4-2 2-5 2z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M20 16v6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 12c1 0 2 1 2 2h0c0 1-1 2-2 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="14" cy="14" r="1" fill="currentColor" opacity="0.6" />
        <circle cx="26" cy="18" r="1" fill="currentColor" opacity="0.6" />
        <circle cx="16" cy="26" r="1" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}
