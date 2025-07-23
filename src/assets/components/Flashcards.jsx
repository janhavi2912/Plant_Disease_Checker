import React, { useState } from 'react';

const flashcardData = [
  {
    title: "Leaf Spot",
    text: "Leaf spot is a plant disease causing discolored spots on leaves, often fungal or bacterial. It spreads via wind and rain, thriving in damp conditions. Severe cases weaken plants and cause leaf drop. Management includes removing infected leaves and improving air circulation; fungicides may be needed for severe infections.",
  },
  {
    title: "Powdery Mildew",
    text: "Powdery mildew is a fungal disease characterized by white, powdery spots on leaves and stems. It spreads easily via wind, especially in humid conditions, hindering plant growth and weakening its overall health. Management involves improving air circulation, removing infected plant parts, and, for severe cases, applying fungicides.",
  },
  {
    title: "Bacterial Blight",
    text: "Bacterial blight is a plant disease caused by bacterial infection, characterized by dark, water-soaked spots on leaves, often surrounded by yellow halos. It spreads through rain, contaminated tools, and infected seeds, leading to leaf drop, reduced yield, and potentially plant death. Management involves removing infected plant parts, improving soil drainage, and, in severe cases, applying copper-based bactericides (use with caution).",
  }
];

export default function FlashcardCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? flashcardData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === flashcardData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id='FAQ'>
    <div className="flash-card-container">
      <h2 className="headline">🌿 "What Are the Most Common Plant Diseases Detectable by Leaf Symptoms?"</h2>
      <h3 className="flash-card-title">{flashcardData.title}</h3>

      <div className="flash-card-wrapper">
        {flashcardData.map((card, index) => (
          <div
            key={index}
            className={`flash-card ${index === currentIndex ? 'active' : ''} 
                        ${index === (currentIndex + 1) % flashcardData.length ? 'next' : ''} 
                        ${index === (currentIndex - 1 + flashcardData.length) % flashcardData.length ? 'prev' : ''}`}
          ><div className="arrow left-arrow" onClick={handlePrev}>&larr;</div>
          <div className="arrow right-arrow" onClick={handleNext}>&rarr;</div>

            <h3 className="flash-card-title">{card.title}</h3>
            <p className="flash-card-text">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
}