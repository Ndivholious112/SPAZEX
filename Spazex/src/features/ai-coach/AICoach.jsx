import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import RecommendationCard from './RecommendationCard';
import './AICoach.css';
import { FiTrendingUp } from 'react-icons/fi';

const AICoach = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize messages from localStorage or defaults
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('spazex_ai_coach_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    }
    return [
      {
        id: 'initial',
        role: 'assistant',
        content: `Hi there! I am your **Spazex AI Business Coach**.\n\nI have access to your shop's inventory, sales, and demand forecast. Ask me questions like:\n\n**Which items are running low?**\n\n**How can I increase sales for maize meal?**\n\n**What is my demand outlook for this weekend?**\n\nHow can I help you grow your business today?`
      }
    ];
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('spazex_ai_coach_messages', JSON.stringify(messages));
  }, [messages]);

  // Construct a detailed, context-aware system prompt using live shop data
  const buildSystemPrompt = () => {
    let inventory = [];
    let sales = [];
    let forecast = [];
    let userDetails = null;

    try {
      const invStr = localStorage.getItem('spazex_inventory');
      if (invStr) inventory = JSON.parse(invStr);
    } catch (e) {
      console.error('Error reading inventory from localStorage:', e);
    }

    try {
      const salesStr = localStorage.getItem('salesRows');
      if (salesStr) sales = JSON.parse(salesStr);
    } catch (e) {
      console.error('Error reading sales from localStorage:', e);
    }

    try {
      const fcStr = localStorage.getItem('forecastRows');
      if (fcStr) forecast = JSON.parse(fcStr);
    } catch (e) {
      console.error('Error reading forecast from localStorage:', e);
    }

    try {
      const usrStr = localStorage.getItem('spazex_user_data');
      if (usrStr) userDetails = JSON.parse(usrStr);
    } catch (e) {
      console.error('Error reading user details from localStorage:', e);
    }

    // Prepare summaries
    const lowStock = inventory.filter(i => i.stock <= 15).map(i => `${i.name} (${i.stock} in stock)`).join(', ');
    const totalInvValue = inventory.reduce((sum, i) => sum + (i.price * i.stock), 0);
    const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);

    return `You are "Spazex AI Business Coach", a friendly, experienced, and encouraging business advisor for a spaza shop (convenience store) in South Africa.
Use a warm, constructive, South African business-savvy tone. You can use local terms occasionally (like 'spaza', 'rand', 'till', 'stock') but keep it professional.

Here is the current store context from the database:
Shop name/Owner: ${userDetails?.shopName || 'Spazex Spaza'} (Owner: ${userDetails?.displayName || 'Owner'})
Inventory summary: ${inventory.length} products total, with a total value of R${totalInvValue.toFixed(2)}.
Low stock items (needs attention): ${lowStock || 'None, all items have good stock levels.'}
Sales recently: R${totalSales.toFixed(2)} total across ${sales.length} transactions.
Forecast: ${forecast.length ? forecast.map(f => `${f.name} predicted demand is ${f.predicted} units`).join('; ') : 'No forecast data available.'}

Keep your responses concise, highly practical, and actionable (ideally 2-4 sentences). Always prioritize helping the owner increase their sales, optimize their stock level, buy from the best suppliers, and save money.
Do not use any emojis, list symbols, bullet points, or dashes (such as - or --) in your responses. Respond using only clean, plain text paragraphs.`;
  };

  const handleSend = async (messageText = null) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    if (!messageText) {
      setInput('');
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
      if (!apiKey) {
        throw new Error('Mistral API Key is missing. Please add VITE_MISTRAL_API_KEY to your .env file in the Spazex folder.');
      }

      const systemPrompt = buildSystemPrompt();

      // Maintain user/assistant dialog history (limit to last 10 messages for token usage and efficiency)
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...updatedMessages.slice(-10).map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }))
      ];

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `Mistral API responded with status ${response.status}`);
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response. Please try again.';

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + '-ai',
          role: 'assistant',
          content: reply
        }
      ]);
    } catch (err) {
      console.error('AI Coach call failed:', err);
      setError(err.message);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + '-err',
          role: 'assistant',
          content: `**Failed to connect to AI Coach:**\n\n${err.message || 'Please check your connection and API key configurations.'}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      const defaultMsg = [
        {
          id: 'initial',
          role: 'assistant',
          content: `Hi there! I am your **Spazex AI Business Coach**.\n\nI have access to your shop's inventory, sales, and demand forecast. Ask me questions like:\n\n**Which items are running low?**\n\n**How can I increase sales for maize meal?**\n\n**What is my demand outlook for this weekend?**\n\nHow can I help you grow your business today?`
        }
      ];
      setMessages(defaultMsg);
      localStorage.setItem('spazex_ai_coach_messages', JSON.stringify(defaultMsg));
    }
  };

  const isApiKeyConfigured = !!import.meta.env.VITE_MISTRAL_API_KEY;

  return (
    <div className="ai-coach-page">
      <div className="ai-coach-hero">
        <h1 className="ai-coach-title">AI Business Coach</h1>
        <p className="ai-coach-subtitle">
          Get real-time insights, stock alerts, and personalized sales advice powered by Mistral AI.
        </p>
        <div className={`ai-coach-badge ${isApiKeyConfigured ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <span className={`ai-coach-badge-dot ${isApiKeyConfigured ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>{isApiKeyConfigured ? 'Mistral AI Connected' : 'Mistral AI Offline (Key Missing)'}</span>
        </div>
      </div>

      <div className="ai-coach-grid">
        <div className="ai-coach-chat-container" style={{ height: '600px' }}>
          <ChatWindow
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={() => handleSend()}
            isLoading={isLoading}
          />
        </div>

        <div className="ai-coach-sidebar-container flex flex-col gap-5">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiTrendingUp className="text-[#7c8cff]" />
              AI Coach Sidebar
            </h3>
            <button
              onClick={handleClearChat}
              className="text-xs text-red-500 hover:text-red-700 font-semibold hover:underline"
            >
              Clear History
            </button>
          </div>

          <RecommendationCard
            title="Stock & Restocking"
            description="Ask about levels and purchase suggestions"
            items={[
              "Which products are running low on stock?",
              "Tell me about my high value items.",
              "What items should I restock soon?"
            ]}
            onSelect={(prompt) => handleSend(prompt)}
          />

          <RecommendationCard
            title="Sales & Revenue"
            description="Boost profit margins and basket sizes"
            items={[
              "Suggest a product bundle to increase sales.",
              "How are my sales performing recently?",
              "Give me tips to improve profit margin."
            ]}
            onSelect={(prompt) => handleSend(prompt)}
          />

          <RecommendationCard
            title="Demand Outlook"
            description="Forecast insights and planning tips"
            items={[
              "What is the demand outlook for this week?",
              "What is my predicted peak sales day?",
              "Give me a quick checklist for today."
            ]}
            onSelect={(prompt) => handleSend(prompt)}
          />
        </div>
      </div>
    </div>
  );
};

export default AICoach;