
import React from 'react';
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage = ({ message, isBot }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "mb-4 flex w-full",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          isBot
            ? "bg-[#84A98C] text-white"
            : "bg-[#52796F] text-white"
        )}
      >
        {message}
      </div>
    </div>
  );
};
