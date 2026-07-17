import type { HTMLAttributes } from "react";

interface CardProps
  extends HTMLAttributes<HTMLDivElement> {
    variant?: string
  }

export function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}