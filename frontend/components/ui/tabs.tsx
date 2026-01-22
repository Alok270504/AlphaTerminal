import * as React from "react"
import { cn } from "@/lib/utils"

export const Tabs = ({ children, value, onValueChange, className }: any) => {
  return <div className={cn("", className)}>{React.Children.map(children, child => React.cloneElement(child, { value, onValueChange }))}</div>
}
export const TabsList = ({ children, className }: any) => <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>{children}</div>
export const TabsTrigger = ({ children, value, onClick, className, activeValue }: any) => (
  <button onClick={() => onClick && onClick(value)} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", activeValue === value ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50", className)}>
    {children}
  </button>
)
export const TabsContent = ({ children, value, activeValue }: any) => {
  if (value !== activeValue) return null;
  return <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{children}</div>
}
