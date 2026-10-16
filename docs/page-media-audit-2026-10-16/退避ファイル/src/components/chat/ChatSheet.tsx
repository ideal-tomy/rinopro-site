"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function ChatSheet({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
}: ChatSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        overlayClassName="backdrop-blur-lg"
        className={cn(
          "flex w-full flex-col p-0 sm:max-w-md",
          "data-[state=open]:duration-[350ms] data-[state=closed]:duration-[250ms]",
          className
        )}
      >
        <SheetHeader className="border-b border-silver/20 p-4">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription id="chat-sheet-description">
            {description}
          </SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
