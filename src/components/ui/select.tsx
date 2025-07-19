import * as React from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, options, placeholder, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState(
      options.find(option => option.value === value) || null
    );
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [dropdownPos, setDropdownPos] = React.useState<{ left: number; top: number; width: number }>({ left: 0, top: 0, width: 0 });

    React.useEffect(() => {
      setSelectedOption(options.find(option => option.value === value) || null);
    }, [value, options]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    React.useEffect(() => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPos({ left: rect.left, top: rect.bottom + window.scrollY, width: rect.width });
      }
    }, [isOpen]);

    const handleSelect = (option: { value: string; label: string }) => {
      setSelectedOption(option);
      onValueChange(option.value);
      setIsOpen(false);
    };

    // Portal dropdown
    const dropdownMenu = isOpen
      ? createPortal(
          <div
            ref={dropdownRef}
            className="select-dropdown-menu fixed z-[99999] rounded-xl border bg-popover text-popover-foreground shadow-md"
            style={{
              left: dropdownPos.left,
              top: dropdownPos.top,
              width: dropdownPos.width,
              minWidth: 180,
              maxWidth: 320,
              maxHeight: 320,
              overflowY: "auto",
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-xl px-2 py-2 text-lg font-semibold outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground gap-2",
                  option.value === value && "bg-accent text-accent-foreground"
                )}
              >
                <span className="select-calendar-icon flex items-center"><Calendar className="w-5 h-5 mr-1 text-gray-500" /></span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )
      : null;

    return (
      <div ref={dropdownRef} className={cn("relative select-custom-wrapper", className)}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-2xl border border-input bg-transparent px-3 py-2 text-lg shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            isOpen && "ring-2 ring-ring"
          )}
        >
          <span className="flex items-center gap-2 text-lg font-semibold">
            <span className="select-calendar-icon flex items-center"><Calendar className="w-5 h-5 mr-1 text-gray-500" /></span>
            <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <ChevronDown className={cn("h-5 w-5 transition-transform", isOpen && "rotate-180")}/>
        </button>
        {dropdownMenu}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select }; 