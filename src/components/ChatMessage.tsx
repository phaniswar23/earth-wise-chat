
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Car, Bike, Train, Bus, Plane } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export const ChatMessage = ({ message, isBot, suggestions, onSuggestionClick }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "mb-4 flex w-full",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div className="flex flex-col gap-2">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={cn(
            "rounded-2xl px-6 py-3 max-w-[80%] shadow-lg backdrop-blur-sm",
            isBot
              ? "bg-gradient-to-r from-[#84A98C] to-[#76997E] text-white"
              : "bg-gradient-to-r from-[#52796F] to-[#446158] text-white"
          )}
        >
          {message}
        </motion.div>

        {isBot && suggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap gap-2 ml-2"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
                className="bg-white/90 text-[#52796F] px-4 py-2 rounded-xl text-sm shadow-md cursor-pointer hover:bg-white transition-colors duration-200"
              >
                {suggestion}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
