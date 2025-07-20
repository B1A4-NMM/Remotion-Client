import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    const { theme } = useTheme();
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    return (
      <label className="inline-flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <span
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm peer-checked:!rounded-sm border border-white shadow flex items-center justify-center",            // "text-white",
            // "peer-focus-visible:outline-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring",
            isDark
              ? "border-white text-white peer-checked:bg-white peer-checked:text-black"
              : "border-black text-black peer-checked:bg-black peer-checked:text-white",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            // "peer-checked:bg-white peer-checked:text-black", 
            "peer-checked:[&>svg]:opacity-100",
            className
          )}
        >
          <Check className="h-3 w-3 opacity-0" />
        </span>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
