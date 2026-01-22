import * as React from "react"
import { cn } from "@/lib/utils"

export const Select = ({ children, value, onValueChange }: any) => {
  return <div className="relative">{React.Children.map(children, child => React.cloneElement(child, { value, onValueChange }))}</div>
}
export const SelectTrigger = ({ children, className }: any) => <div className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}>{children}</div>
export const SelectValue = ({ placeholder }: any) => <span>{placeholder || "Select..."}</span>
export const SelectContent = ({ children }: any) => <div className="absolute top-full left-0 w-full mt-1 bg-popover border border-border rounded-md shadow-md z-50 p-1">{children}</div>
export const SelectItem = ({ children, value, onClick }: any) => <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground" onClick={() => onClick && onClick(value)}>{children}</div>
