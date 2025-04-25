
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage = ({ message, isBot }: ChatMessageProps) => {
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
    </motion.div>
  );
};
