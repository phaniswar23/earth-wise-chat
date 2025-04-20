
import React, { useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { calculateCarbonFootprint, getSustainabilityTip } from '@/utils/carbonCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle } from 'lucide-react';

export const CarbonChat = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    {
      text: "Hello! I'm your Carbon Offset Calculator. I can help you understand your carbon footprint. Try asking about your car travel, flights, electricity usage, or food consumption!",
      isBot: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const processMessage = async (userInput: string) => {
    try {
      setIsLoading(true);
      
      // For now, we'll use a simple pattern matching approach
      // In a production app, you would want to use the Gemini API here
      const lowerInput = userInput.toLowerCase();
      let response = "I'm not sure how to help with that. Try asking about car travel, flights, electricity usage, or food consumption!";
      
      // Simple pattern matching for demonstration
      if (lowerInput.includes('car') && lowerInput.includes('km')) {
        const km = parseFloat(lowerInput.match(/\d+/)?.[0] || '0');
        const footprint = calculateCarbonFootprint('car', km);
        const tip = getSustainabilityTip('car');
        response = `Your ${km}km car journey produces approximately ${footprint.toFixed(2)}kg of CO2. ${tip}`;
      } else if (lowerInput.includes('flight') && lowerInput.includes('km')) {
        const km = parseFloat(lowerInput.match(/\d+/)?.[0] || '0');
        const footprint = calculateCarbonFootprint('flight', km);
        const tip = getSustainabilityTip('flight');
        response = `Your ${km}km flight produces approximately ${footprint.toFixed(2)}kg of CO2. ${tip}`;
      }

      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      return "I'm sorry, I encountered an error. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');

    const botResponse = await processMessage(userMessage);
    setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto bg-[#F2F7F4] rounded-lg shadow-lg">
      <div className="flex items-center gap-2 p-4 bg-[#52796F] text-white rounded-t-lg">
        <MessageCircle className="w-6 h-6" />
        <h2 className="text-xl font-semibold">Carbon Offset Calculator</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isBot={message.isBot}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your carbon footprint..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#52796F] hover:bg-[#445E57]"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
