import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-primary"
      >
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
        <path d="M12 16s-2-4-4-4 0-4 4-4 4 4 4 4-2 4-4 4z" />
        <path d="M12 12v4" />
        <path d="M12 8a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v0" />
      </svg>
      <span className="text-xl font-bold text-foreground">EcoChallenge</span>
    </div>
  );
}
