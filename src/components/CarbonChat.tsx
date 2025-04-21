
import React, { useState, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { calculateCarbonFootprint, getSustainabilityTip } from '@/utils/carbonCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Key } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const CarbonChat = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    {
      text: "Hello! I'm your Carbon Offset Calculator. First, please enter your Gemini API key to enable AI-powered responses. Then, try asking about your car travel, flights, electricity usage, or food consumption!",
      isBot: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [keySubmitted, setKeySubmitted] = useState(false);
  const { toast } = useToast();

  // Check localStorage for saved API key on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setKeySubmitted(true);
      toast({
        title: "API Key Loaded",
        description: "Your previously saved Gemini API key has been loaded.",
      });
    }
  }, []);

  const processMessage = async (userInput: string) => {
    try {
      setIsLoading(true);
      
      if (!apiKey || !keySubmitted) {
        return "Please enter your Gemini API key first to enable AI-powered responses.";
      }

      const lowerInput = userInput.toLowerCase();
      let response = "I'm not sure how to help with that. Try asking about car travel, bike travel, flights, electricity usage, or food consumption!";

      // Handle greetings like "hi", "hello", "hey"
      if (/\b(hi|hello|hey|greetings)\b/.test(lowerInput)) {
        response = "Hi, I am your Carbon Offset Calculator. Ask me about your carbon footprint!";
      } else if (lowerInput.includes('car') && lowerInput.includes('km')) {
        const km = parseFloat(lowerInput.match(/\d+/)?.[0] || '0');
        const footprint = calculateCarbonFootprint('car', km);
        const tip = getSustainabilityTip('car');
        response = `Your ${km}km car journey produces approximately ${footprint.toFixed(2)}kg of CO2. ${tip}`;
      } else if (lowerInput.includes('flight') && lowerInput.includes('km')) {
        const km = parseFloat(lowerInput.match(/\d+/)?.[0] || '0');
        const footprint = calculateCarbonFootprint('flight', km);
        const tip = getSustainabilityTip('flight');
        response = `Your ${km}km flight produces approximately ${footprint.toFixed(2)}kg of CO2. ${tip}`;
      } else if (lowerInput.includes('bike') && lowerInput.includes('km')) {
        const km = parseFloat(lowerInput.match(/\d+/)?.[0] || '0');
        const footprint = calculateCarbonFootprint('bike', km);
        const tip = getSustainabilityTip('bike');
        response = `Your ${km}km bike journey produces ${footprint}kg of CO2 (zero direct emissions). ${tip}`;
      }

      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      return "I'm sorry, I encountered an error. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      // Store API key in localStorage
      localStorage.setItem('geminiApiKey', apiKey);
      setKeySubmitted(true);
      
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved for this session.",
      });
      
      setMessages(prev => [...prev, {
        text: "API key saved! You can now ask me questions about your carbon footprint.",
        isBot: true
      }]);
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
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

  const resetApiKey = () => {
    localStorage.removeItem('geminiApiKey');
    setApiKey('');
    setKeySubmitted(false);
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed.",
    });
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto bg-[#F2F7F4] rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 bg-[#52796F] text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Carbon Offset Calculator</h2>
        </div>
        {keySubmitted && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetApiKey} 
            className="text-white hover:bg-[#445E57]"
          >
            Reset API Key
          </Button>
        )}
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

      {!keySubmitted && (
        <form onSubmit={handleApiKeySubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="flex-1"
            />
            <Button 
              type="submit" 
              className="bg-[#52796F] hover:bg-[#445E57]"
            >
              <Key className="w-4 h-4 mr-2" />
              Save Key
            </Button>
          </div>
        </form>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your carbon footprint..."
            disabled={isLoading || !keySubmitted}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !keySubmitted}
            className="bg-[#52796F] hover:bg-[#445E57]"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
