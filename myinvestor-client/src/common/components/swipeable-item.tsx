import { useState, type ReactNode } from 'react';
import { useSwipeable } from '../hooks/use-swipeable';

interface SwipeableItemProps {
  children: ReactNode;
  actions: ReactNode;
}

export function SwipeableItem({ children, actions }: SwipeableItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipeLeft: () => setIsOpen(true),
    onSwipeRight: () => setIsOpen(false),
  });

  return (
    <div className="relative overflow-hidden">
      <div
        className={`transition-transform duration-300 ease-out ${
          isOpen ? '-translate-x-32' : 'translate-x-0'
        }`}
        {...swipeHandlers}
      >
        {children}
      </div>

      <div
        className={`absolute top-0 right-0 h-full flex items-center gap-2 pr-4 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {actions}
      </div>
    </div>
  );
}
