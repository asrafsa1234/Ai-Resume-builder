import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface GooeyNavProps {
  items: { label: string }[];
  initialActiveIndex?: number;
  onChange: (index: number) => void;
}

const GooeyNav: React.FC<GooeyNavProps> = ({ items, initialActiveIndex = 0, onChange }) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  useEffect(() => {
    const target = itemsRef.current[activeIndex];
    if (target && indicatorRef.current && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const x = targetRect.left - navRect.left;
      const width = targetRect.width;

      gsap.to(indicatorRef.current, {
        x: x,
        width: width,
        duration: 0.5,
        ease: "elastic.out(1, 0.75)"
      });
    }
  }, [activeIndex]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onChange(index);
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div 
        ref={navRef} 
        className="relative flex items-center bg-slate-100 rounded-xl p-1 w-max min-w-full"
      >
        <div 
          ref={indicatorRef} 
          className="absolute top-1 bottom-1 left-0 bg-white rounded-lg shadow-sm z-0 pointer-events-none"
          style={{ height: 'calc(100% - 8px)' }}
        />
        {items.map((item, index) => (
          <button
            key={index}
            ref={(el) => { itemsRef.current[index] = el; }}
            onClick={() => handleClick(index)}
            className={`relative z-10 flex-1 px-4 py-2 text-xs font-semibold transition-colors duration-200 whitespace-nowrap ${
              activeIndex === index ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GooeyNav;