import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ messages, input, setInput, onSend, isLoading }) => {
  const bodyRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSend();
  };

  // Scroll to bottom on new messages or loading state change
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Safe formatting helper to render basic markdown bold and bullet points
  const renderMessageContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
      let trimmed = line.trim();
      
      // Handle bullet points
      const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ');
      if (isBullet) {
        trimmed = trimmed.substring(2);
      }

      // Parse bold tags **text** -> <strong>text</strong>
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      const elements = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIdx} className="font-bold text-current">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-5 list-disc my-1 text-inherit">
            {elements}
          </li>
        );
      }

      return (
        <p key={lineIdx} className="my-1.5 min-h-[1rem]">
          {elements}
        </p>
      );
    });
  };

  return (
    <div className="ai-chat-shell">
      <div className="ai-chat-header">
        <div className="ai-chat-brand">
          <div className="ai-chat-avatar">AI</div>
          <div>
            <h3 className="ai-chat-title">Spazex AI Coach</h3>
            <p className="ai-chat-subtitle">Live guidance for inventory, sales, and suppliers</p>
          </div>
        </div>
      </div>

      <div ref={bodyRef} className="ai-chat-body">
        {messages.map((message) => (
          <div key={message.id} className={`ai-chat-message ${message.role === 'assistant' ? 'assistant' : 'user'}`}>
            <div className="message-content-inner">
              {renderMessageContent(message.content)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="ai-chat-loading flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>Thinking with the AI coach...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="ai-chat-form">
        <div className="ai-chat-form-row">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about stock, sales, or suppliers"
            className="ai-chat-input text-gray-800"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="ai-chat-send">
            {isLoading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;

