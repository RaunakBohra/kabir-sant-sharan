import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variants = {
      default: "border-transparent bg-dark-900 text-cream-50 hover:bg-dark-800",
      secondary: "border-transparent bg-cream-100 text-dark-900 hover:bg-cream-200",
      destructive: "border-transparent bg-red-500 text-cream-50 hover:bg-red-600",
      outline: "text-dark-600 border-cream-200 hover:bg-cream-50"
    }

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }