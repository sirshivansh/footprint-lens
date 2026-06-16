"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button } from "@/components/ui";
import { Home, Car, Leaf, Plane, ShoppingBag } from "lucide-react";

export interface OnboardingData {
  homeType: "apartment" | "house" | "shared";
  primaryTransport: "car" | "transit" | "bike" | "mix";
  dietType: "omnivore" | "flexitarian" | "vegetarian" | "vegan";
  flightFrequency: "0" | "1-3" | "4-8" | "9+";
  shoppingHabit: "minimal" | "average" | "frequent";
}

interface Question {
  id: keyof OnboardingData;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  options: {
    value: string;
    label: string;
    description: string;
    emoji: string;
  }[];
}

const questions: Question[] = [
  {
    id: "homeType",
    icon: Home,
    title: "What's your home type?",
    description: "Your living space dictates a significant portion of your energy footprint.",
    options: [
      { value: "apartment", label: "Apartment", description: "Shared walls, efficient heating", emoji: "🏢" },
      { value: "house", label: "Stand-alone House", description: "Higher heating/cooling overhead", emoji: "🏠" },
      { value: "shared", label: "Shared Living", description: "Divided household utilities", emoji: "Townhouse" },
    ],
  },
  {
    id: "primaryTransport",
    icon: Car,
    title: "How do you get around?",
    description: "Daily travel is the second most common carbon hotspot.",
    options: [
      { value: "car", label: "Personal Car", description: "Gas/diesel daily driving", emoji: "🚗" },
      { value: "transit", label: "Public Transit", description: "Buses, subways, passenger trains", emoji: "🚇" },
      { value: "mix", label: "Mix of both", description: "Shared transit & occasional driving", emoji: "🎛️" },
      { value: "bike", label: "Active Transit", description: "Bicycle, walking, electric scooter", emoji: "🚲" },
    ],
  },
  {
    id: "dietType",
    icon: Leaf,
    title: "What does your diet look like?",
    description: "Methane and agricultural shipping drive food footprints.",
    options: [
      { value: "omnivore", label: "Meat-focused", description: "Enjoy beef, pork, poultry regularly", emoji: "🥩" },
      { value: "flexitarian", label: "Flexitarian", description: "Mostly plant-based, occasional meat", emoji: "🥗" },
      { value: "vegetarian", label: "Vegetarian", description: "No meat, but eat dairy & eggs", emoji: "🥚" },
      { value: "vegan", label: "Fully Plant-based", description: "Zero animal products", emoji: "🌱" },
    ],
  },
  {
    id: "flightFrequency",
    icon: Plane,
    title: "How often do you fly?",
    description: "Aviation carbon has the highest warming index per hour.",
    options: [
      { value: "0", label: "Rarely/Never", description: "0 flights in the past year", emoji: "🚫" },
      { value: "1-3", label: "Occasional Flyer", description: "1-3 flights per year (vacations)", emoji: "✈️" },
      { value: "4-8", label: "Frequent Flyer", description: "4-8 flights per year (business/family)", emoji: "🛩️" },
      { value: "9+", label: "Jetsetter", description: "9 or more flights per year", emoji: "🚀" },
    ],
  },
  {
    id: "shoppingHabit",
    icon: ShoppingBag,
    title: "What are your shopping habits?",
    description: "Manufacturing and packaging supply chains emit carbon.",
    options: [
      { value: "minimal", label: "Minimalist", description: "Only essentials, buy secondhand", emoji: "📦" },
      { value: "average", label: "Average Consumer", description: "Typical clothing & gadget purchasing", emoji: "🛍️" },
      { value: "frequent", label: "Frequent Shopper", description: "Frequent new products, fast-fashion", emoji: "💳" },
    ],
  },
];

interface CardSwipeProps {
  onComplete: (data: OnboardingData) => void;
}

export function CardSwipe({ onComplete }: CardSwipeProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selections, setSelections] = useState<Partial<OnboardingData>>({});
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const currentQuestion = questions[currentIdx];
  const Icon = currentQuestion.icon;

  const handleSelect = (value: string) => {
    const nextSelections = {
      ...selections,
      [currentQuestion.id]: value,
    };
    setSelections(nextSelections);

    if (currentIdx < questions.length - 1) {
      setDirection(1);
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete(nextSelections as OnboardingData);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(currentIdx - 1);
    }
  };

  // Slide animations
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col gap-6">
      {/* Progress indicators */}
      <div className="flex justify-between items-center gap-1.5 px-2">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              idx <= currentIdx ? "bg-clay" : "bg-soil/10 dark:bg-soil/25"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIdx}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card className="flex flex-col gap-6 p-8 border-border-custom bg-surface shadow-md">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-clay/10 text-clay">
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-soil">
                {currentQuestion.title}
              </h2>
              <p className="text-sm text-muted">
                {currentQuestion.description}
              </p>
            </div>

            {/* Options list */}
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selections[currentQuestion.id] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`flex items-center gap-4 rounded-custom-btn border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-clay ${
                      isSelected
                        ? "border-clay bg-clay/5 text-clay"
                        : "border-border-custom bg-background/50 hover:bg-soil/5 text-soil"
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-base">{option.label}</span>
                      <span className="text-xs text-muted leading-snug">
                        {option.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center px-2">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentIdx === 0}
          className="h-10 text-sm"
        >
          Back
        </Button>
        <span className="text-xs font-semibold text-muted font-sans">
          Step {currentIdx + 1} of {questions.length}
        </span>
      </div>
    </div>
  );
}
