
export const calculateCarbonFootprint = (activity: string, value: number): number => {
  // Simplified carbon calculations (in kg CO2)
  const factors = {
    car: 0.2, // per km
    flight: 0.2, // per km
    electricity: 0.5, // per kWh
    meat: 6.0, // per kg
    vegetables: 0.4, // per kg
    bike: 0, // per km (zero direct emissions)
  };

  const activityType = activity.toLowerCase();
  return factors[activityType as keyof typeof factors] * value || 0;
};

export const getSustainabilityTip = (activity: string): string => {
  const tips = {
    car: "Consider carpooling or using public transportation to reduce emissions.",
    flight: "Try to combine trips and consider carbon offset programs for necessary flights.",
    electricity: "Switch to LED bulbs and energy-efficient appliances.",
    meat: "Consider incorporating more plant-based meals into your diet.",
    vegetables: "Buy local and seasonal produce to reduce transportation emissions.",
    bike: "Great choice! Cycling is a zero-emission mode of transport that also improves your health.",
  };

  return tips[activity as keyof typeof tips] || "Every small action counts towards reducing your carbon footprint!";
};
