import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({ children, content, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "top":
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === "top" ? 4 : position === "bottom" ? -4 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === "top" ? 4 : position === "bottom" ? -4 : 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 rounded-lg shadow-md whitespace-nowrap pointer-events-none ${getPositionClasses()}`}
          >
            {content}
            <div
              className={`absolute border-4 border-transparent ${
                position === "bottom"
                  ? "bottom-full left-1/2 -translate-x-1/2 border-b-zinc-900 dark:border-b-zinc-100"
                  : position === "left"
                  ? "left-full top-1/2 -translate-y-1/2 border-l-zinc-900 dark:border-l-zinc-100"
                  : position === "right"
                  ? "right-full top-1/2 -translate-y-1/2 border-r-zinc-900 dark:border-r-zinc-100"
                  : "top-full left-1/2 -translate-x-1/2 border-t-zinc-900 dark:border-t-zinc-100"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
