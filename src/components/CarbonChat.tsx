import React, { useState, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import {
  calculateCarbonFootprint,
  getSustainabilityTip,
  comboTripsExplanation,
  carbonOffsetExplanation
} from '@/utils/carbonCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Key, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from "framer-motion";

const VEHICLE_TYPES = [
  'car', 'bus', 'train', 'motorcycle', 'truck',
  'scooter', 'ferry', 'tram', 'subway', 'bike', 'flight',
];

const FULL_COMBO_TRIPS_EXPLANATION =
  "Combine trips: Instead of taking multiple separate flights, you plan your travel so you can visit multiple destinations or complete multiple tasks in one trip. This reduces the number of flights taken overall and thus lowers total carbon emissions.";

const FULL_CARBON_OFFSET_EXPLANATION =
  "Carbon offset programs: These are voluntary initiatives where you can invest money to support projects that reduce greenhouse gas emissions elsewhere (like planting trees, renewable energy, etc.). By contributing to such programs, you effectively compensate for the CO2 emitted by your flight.";

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

  const getSuggestions = () => [
    "How much carbon does a car produce traveling 50km?",
    "What's the carbon footprint of a 200km train journey?",
    "Calculate emissions for a 5km bike ride",
    "Carbon impact of a 1000km flight",
    "How much CO2 does 100kWh of electricity produce?"
  ];

  const processMessage = async (userInput: string) => {
    try {
      setIsLoading(true);

      if (!apiKey || !keySubmitted) {
        return "Please enter your Gemini API key first to enable AI-powered responses.";
      }

      const lowerInput = userInput.toLowerCase();
      let response = 
        "I'm not sure how to help with that. Here are some examples you can try asking about:";

      if (lowerInput.includes("carbon offset program") || lowerInput.includes("carbon offset programs")) {
        return FULL_CARBON_OFFSET_EXPLANATION;
      }

      if (/(explain|what is|tell me about).*(combine|combining) trips?/.test(lowerInput)) {
        return FULL_COMBO_TRIPS_EXPLANATION;
      }

      if (
        /\b(hi|hello|hey|greetings|how are you|how r u|how do you do|whats up|what's up|who are you|what are you)\b/.test(
          lowerInput
        )
      ) {
        if (/\bhow are you|how r u|how do you do|whats up|what's up\b/.test(lowerInput)) {
          return "Thanks for asking! I'm here to help you understand your carbon footprint. How can I assist you today?";
        }
        if (/\bwho are you|what are you\b/.test(lowerInput)) {
          return "I'm an AI-powered Carbon Offset Calculator, here to help you reduce your carbon footprint!";
        }
        return "Hi there! Ask me about your carbon footprint or about sustainable travel choices.";
      }

      const allTripMatches = [];
      const tripRegex = new RegExp(`(${VEHICLE_TYPES.join('|')})[^\\d]*(\\d+(?:\\.\\d+)?)\\s?km`, 'g');
      let matchTrip;
      while ((matchTrip = tripRegex.exec(lowerInput)) !== null) {
        allTripMatches.push({ type: matchTrip[1], km: parseFloat(matchTrip[2]) });
      }
      if (allTripMatches.length > 0) {
        const tripResponses = allTripMatches.map(({ type, km }) => {
          const footprint = calculateCarbonFootprint(type, km);
          const tip = getSustainabilityTip(type);
          if (type === 'bike') {
            return `Your ${km}km bike journey produces ${footprint}kg of CO2 (zero direct emissions). ${tip}`;
          }
          if (type === 'flight') {
            return `Your ${km}km flight produces approximately ${footprint.toFixed(2)}kg of CO2. ${tip}`;
          }
          return `Your ${km}km ${type} trip produces approximately ${footprint.toFixed(2)}kg of CO2. ${tip}`;
        });
        return tripResponses.join('\n\n');
      }

      const fallbackTripMatch =
        lowerInput.match(new RegExp(`(${VEHICLE_TYPES.join('|')})`)) &&
        lowerInput.match(/(\d+(\.\d+)?)\s?km/);

      if (fallbackTripMatch) {
        const type = lowerInput.match(new RegExp(`(${VEHICLE_TYPES.join('|')})`))[0];
        const km = parseFloat(lowerInput.match(/(\d+(\.\d+)?)\s?km/)?.[1] || '0');
        const footprint = calculateCarbonFootprint(type, km);
        const tip = getSustainabilityTip(type);
        if (type === 'bike') {
          return `Your ${km}km bike journey produces ${footprint}kg of CO2 (zero direct emissions). ${tip}`;
        }
        if (type === 'flight') {
          return `Your ${km}km flight produces approximately ${footprint.toFixed(2)}kg of CO2. ${tip}`;
        }
        return `Your ${km}km ${type} trip produces approximately ${footprint.toFixed(2)}kg of CO2. ${tip}`;
      }

      if (lowerInput.includes("electricity") && lowerInput.match(/(\d+(\.\d+)?)\s?kwh/)) {
        const kwh = parseFloat(lowerInput.match(/(\d+(\.\d+)?)\s?kwh/)?.[1] || '0');
        const footprint = calculateCarbonFootprint('electricity', kwh);
        const tip = getSustainabilityTip('electricity');
        return `Your usage of ${kwh}kWh electricity produces about ${footprint.toFixed(2)}kg of CO2. ${tip}`;
      }

      if (lowerInput.includes("meat") && lowerInput.match(/(\d+(\.\d+)?)\s?kg/)) {
        const kg = parseFloat(lowerInput.match(/(\d+(\.\d+)?)\s?kg/)?.[1] || '0');
        const footprint = calculateCarbonFootprint('meat', kg);
        const tip = getSustainabilityTip('meat');
        return `Consuming ${kg}kg of meat generates about ${footprint.toFixed(2)}kg of CO2. ${tip}`;
      }
      if (lowerInput.includes("vegetable") && lowerInput.match(/(\d+(\.\d+)?)\s?kg/)) {
        const kg = parseFloat(lowerInput.match(/(\d+(\.\d+)?)\s?kg/)?.[1] || '0');
        const footprint = calculateCarbonFootprint('vegetables', kg);
        const tip = getSustainabilityTip('vegetables');
        return `Consuming ${kg}kg of vegetables generates about ${footprint.toFixed(2)}kg of CO2. ${tip}`;
      }

      // If no specific pattern was matched, return the default response
      if (response.startsWith("I'm not sure")) {
        setMessages(prev => [
          ...prev,
          { text: response, isBot: true, suggestions: getSuggestions() }
        ]);
        return;
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
      localStorage.setItem('geminiApiKey', apiKey);
      setKeySubmitted(true);
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved for this session.",
      });
      setMessages(prev => [
        ...prev,
        {
          text: "API key saved! You can now ask me questions about your carbon footprint.",
          isBot: true
        }
      ]);
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
    if (botResponse) {
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-[80vh] max-w-2xl mx-auto bg-gradient-to-b from-[#F2F7F4] to-[#E8F0EB] rounded-2xl shadow-2xl border border-[#CAD2CE]/20"
    >
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#52796F] to-[#446158] text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Carbon Offset Calculator</h2>
        </div>
        {keySubmitted && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetApiKey}
            className="text-white hover:bg-[#445E57]/20"
          >
            Reset API Key
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-[#52796F]/20 scrollbar-track-transparent">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message.text} isBot={message.isBot} />
        ))}
      </div>

      {!keySubmitted ? (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleApiKeySubmit}
          className="p-6 border-t border-[#CAD2CE]/20 bg-white/50 backdrop-blur-sm rounded-b-2xl"
        >
          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key..."
              className="flex-1 border-[#CAD2CE]/40 focus:border-[#52796F]"
            />
            <Button type="submit" className="bg-[#52796F] hover:bg-[#446158] transition-colors">
              <Key className="w-4 h-4 mr-2" />
              Save Key
            </Button>
          </div>
        </motion.form>
      ) : (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="p-6 border-t border-[#CAD2CE]/20 bg-white/50 backdrop-blur-sm rounded-b-2xl"
        >
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your carbon footprint..."
              disabled={isLoading || !keySubmitted}
              className="flex-1 border-[#CAD2CE]/40 focus:border-[#52796F]"
            />
            <Button
              type="submit"
              disabled={isLoading || !keySubmitted}
              className="bg-[#52796F] hover:bg-[#446158] transition-colors"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};
