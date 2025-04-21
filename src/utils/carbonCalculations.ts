
// Expanded emission factors (in kg CO2 per km)
export const calculateCarbonFootprint = (activity: string, value: number): number => {
  const factors = {
    car: 0.2,             // per km
    flight: 0.2,           // per km
    electricity: 0.5,      // per kWh
    meat: 6.0,             // per kg
    vegetables: 0.4,       // per kg
    bike: 0,               // per km
    bus: 0.05,             // per km
    train: 0.04,           // per km
    motorcycle: 0.09,      // per km
    truck: 0.25,           // per km
    scooter: 0.02,         // per km (electric)
    ferry: 0.18,           // per km
    tram: 0.03,            // per km
    subway: 0.03           // per km
  };

  const activityType = activity.toLowerCase();
  return (factors[activityType as keyof typeof factors] ?? 0) * value;
};

export const getSustainabilityTip = (activity: string): string => {
  const tips = {
    car: "Consider carpooling or using public transportation to reduce emissions.",
    flight: "Try to combine trips and consider carbon offset programs for necessary flights.",
    electricity: "Switch to LED bulbs and energy-efficient appliances.",
    meat: "Consider incorporating more plant-based meals into your diet.",
    vegetables: "Buy local and seasonal produce to reduce transportation emissions.",
    bike: "Great choice! Cycling is a zero-emission mode of transport that improves your health.",
    bus: "Public transportation like buses is more sustainable than individual car travel.",
    train: "Trains are a low-emission way to cover long distances, especially electric trains.",
    motorcycle: "Ride efficiently and keep your motorcycle well-maintained to lower emissions.",
    truck: "Consider if truck travel can be reduced or consolidated to improve efficiency.",
    scooter: "Electric scooters have a low carbon footprint for short trips.",
    ferry: "Try using ferries only when necessary or look for routes using more efficient vessels.",
    tram: "Using trams helps reduce city air pollution—they run on electricity and are efficient.",
    subway: "Subways are among the cleanest forms of public transport. Choose them for regular routes."
  };

  return tips[activity as keyof typeof tips] || "Every small action counts towards reducing your carbon footprint!";
};

export const comboTripsExplanation =
  "Combine trips: Instead of taking multiple separate flights, you plan your travel so you can visit multiple destinations or complete multiple tasks in one trip. This reduces the number of flights taken overall and thus lowers total carbon emissions.";

export const carbonOffsetExplanation =
  "Carbon offset programs: These are voluntary initiatives where you can invest money to support projects that reduce greenhouse gas emissions elsewhere (like planting trees, renewable energy, etc.). By contributing to such programs, you effectively compensate for the CO2 emitted by your flight.";
