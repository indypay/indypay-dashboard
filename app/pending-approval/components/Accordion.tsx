'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion = ({ items, className = '' }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`w-full ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="border-b border-gray-200 last:border-b-0">
          <button
            className="w-full flex justify-between items-center py-5 px-4 text-left hover:bg-gray-50 transition-colors"
            onClick={() => toggleAccordion(index)}
          >
            <span className="text-base font-medium text-gray-900">
              {item.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openIndex === index ? 'transform rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="p-4 text-gray-600">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
