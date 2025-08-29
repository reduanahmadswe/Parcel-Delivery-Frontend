import { Package } from "lucide-react";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Package className="h-5 w-5" />
      </div>
      <span className="text-lg font-bold text-foreground">ParcelTrack</span>
    </div>
  );
}
