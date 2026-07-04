// Simple mock AI service for frontend-only mode
const wait = (ms = 500) => new Promise((res) => setTimeout(res, ms));

export const generateInsight = async (prompt = '', options = {}) => {
  await wait();
  // Basic canned responses based on keywords
  const p = prompt.toLowerCase();
  if (p.includes('forecast') || p.includes('predict')) {
    return {
      title: 'Demand Forecast Insight',
      text: 'Based on recent sales, expect a 15-30% increase in bread sales over the weekend. Consider ordering 15-25 extra units.'
    };
  }

  if (p.includes('restock') || p.includes('stock')) {
    return {
      title: 'Restock Recommendation',
      text: 'Low stock detected for staples like bread and milk. Add 20 loaves and 10 liters of milk to your next order.'
    };
  }

  // Default fallback
  return {
    title: 'Business Insight',
    text: "Customers often buy beverages with snacks — consider bundling common combos to increase basket value."
  };
};

export default { generateInsight };
