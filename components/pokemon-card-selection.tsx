'use client'

import { useState } from "react";
import confetti from "canvas-confetti";
import PokemonCard from "@/components/pokemon-card";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { GlareCard } from "./ui/glare-card";

export default function PokemonCardSelection() {
  const [packOpened, setPackOpened] = useState(false);
  const [flippedCards, setFlippedCards] = useState<boolean[]>(Array(5).fill(false));
  const [selectedIds, setSelectedIds] = useState<(number | null)[]>(Array(5).fill(null));

  const handleOpenPack = () => {
    setPackOpened(true); // Trigger card animation
  };

  const handleCardClick = (index: number, event: React.MouseEvent) => {
    if (flippedCards[index]) return; // Prevent flipping already flipped cards

    // Randomly choose a Pokémon ID between 1 and 1025
    const randomPokemonId = Math.floor(Math.random() * 1025) + 1;

    setFlippedCards((prevFlipped) =>
      prevFlipped.map((flipped, i) => (i === index ? true : flipped))
    );
    setSelectedIds((prevIds) => prevIds.map((id, i) => (i === index ? randomPokemonId : id)));

    // Trigger confetti at the mouse position
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      },
    });
  };

  return (
    <div className="flex justify-center items-center w-full h-screen flex-col">
      {!packOpened && (
        <button
          onClick={handleOpenPack}
          className="p-4 mb-4 bg-yellow-500 text-white font-bold rounded-lg"
        >
          Open Pack
        </button>
      )}

      <div className={`flex justify-center items-center space-x-4 ${packOpened ? 'transition-all duration-1000 opacity-100' : 'opacity-0'}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Card
            key={index}
            className="relative border-white w-[320px] h-[480px] cursor-pointer perspective-1000 bg-white/10"
            onClick={(event) => handleCardClick(index, event)}
          >
            <GlareCard className="">
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                  flippedCards[index] ? "rotate-y-180" : ""
                }`}
              >
                {/* Back face */}
                <div className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden transform rotate-y-0 bg-white/10">
                  <Image
                    src="/card-back.png"
                    alt="Card Back"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                {/* Front face */}
                <div className="absolute w-full h-full backface-hidden bg-white/10 rounded-lg overflow-hidden transform rotate-y-180">
                  {selectedIds[index] && <PokemonCard pokemonId={selectedIds[index]!} />}
                </div>
              </div>
            </GlareCard>
          </Card>
        ))}
      </div>
    </div>
  );
}
