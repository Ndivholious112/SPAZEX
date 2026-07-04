import React from 'react';
import './RecommendationCard.css';

const RecommendationCard = ({ title, description, items, onSelect }) => {
  return (
    <div className="ai-recommendation-card">
      <h3 className="ai-recommendation-title">{title}</h3>
      {description && <p className="ai-recommendation-description">{description}</p>}

      <div className="ai-recommendation-list">
        {items.map((item, index) => (
          <button key={`${item}-${index}`} type="button" onClick={() => onSelect?.(item)} className="ai-recommendation-item">
            <span className="ai-recommendation-dot">•</span>
            <span>{item}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;
