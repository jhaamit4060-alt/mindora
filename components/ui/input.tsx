import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 px-3 py-2 text-base text-foreground placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors outline-none",
        "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-500/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
