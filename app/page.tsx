"use client";

import PokemonCardSelection from "@/components/pokemon-card-selection";

export default function Home() {
  return (
    <div className="bg-[#e3e6f3] flex justify-center items-center w-full h-screen mx-auto p-2">
      <div className="w-full h-full">
        <PokemonCardSelection />
      </div>
    </div>
  );
}
