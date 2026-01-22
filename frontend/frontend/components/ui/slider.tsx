import * as React from "react"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { onValueChange?: (val: number[]) => void }>(
  ({ className, value, onValueChange, ...props }, ref) => {
    return (
      <input
        type="range"
        className={cn("w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary", className)}
        ref={ref}
        onChange={(e) => onValueChange && onValueChange([parseFloat(e.target.value)])}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"
export { Slider }
