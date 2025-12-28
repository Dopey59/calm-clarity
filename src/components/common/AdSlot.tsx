import { cn } from '@/lib/utils';

interface AdSlotProps {
  size: 'leaderboard' | 'rectangle' | 'banner';
  className?: string;
}

const sizeClasses = {
  leaderboard: 'h-[90px] md:h-[90px]',
  rectangle: 'h-[250px]',
  banner: 'h-[50px]',
};

export function AdSlot({ size, className }: AdSlotProps) {
  return (
    <div 
      className={cn(
        "ad-slot w-full",
        sizeClasses[size],
        className
      )}
      style={{ display: 'none' }}  // ← mute l'encart publicitaire
      aria-label="Espace publicitaire"
    >
      <span className="text-xs uppercase tracking-wider">Publicité</span>
    </div>
  );
}
