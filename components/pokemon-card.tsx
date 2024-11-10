/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { GlareCard } from "./ui/glare-card"
import { Card } from "./ui/card"

interface PokemonData {
  name: string
  hp: number
  height: number
  weight: number
  sprites: { other: { "official-artwork": { front_shiny: string } } }
  abilities: { ability: { name: string } }[]
  moves: { move: { name: string }, version_group_details: { level_learned_at: number, move_learn_method: { name: string } } }[]
  stats: { base_stat: number, stat: { name: string } }[]
  types: { type: { name: string } }[]
}

// Define a mapping of Pokémon types to background colors
// Define a mapping of Pokémon types to lighter background colors
const typeColors: Record<string, string> = {
    fire: '#ffcc80',   // Lighter Fire color
    water: '#81d4fa',  // Lighter Water color
    grass: '#a5d6a7',  // Lighter Grass color
    electric: '#fff176', // Lighter Electric color
    psychic: '#e1bee7', // Lighter Psychic color
    ice: '#80deea',    // Lighter Ice color
    dragon: '#ef5350', // Lighter Dragon color
    dark: '#9e9e9e',   // Lighter Dark color
    fairy: '#f8bbd0',  // Lighter Fairy color
    fighting: '#e57373', // Lighter Fighting color
    flying: '#64b5f6',  // Lighter Flying color
    ghost: '#ba68c8',   // Lighter Ghost color
    poison: '#ba68c8',  // Lighter Poison color (same as Ghost)
    steel: '#90a4ae',   // Lighter Steel color
    ground: '#a1887f',  // Lighter Ground color
    bug: '#c5e1a5',     // Lighter Bug color
    rock: '#8d6e63',    // Lighter Rock color
    normal: '#bdbdbd',  // Lighter Normal color
    // Add more types as necessary
  }
  

export default function PokemonCard({ pokemonId }: { pokemonId: number }) {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      const data = await response.json()

      setPokemon({
        name: data.name,
        hp: data.stats.find((stat: { stat: { name: string } }) => stat.stat.name === "hp")?.base_stat || 0,
        height: data.height,
        weight: data.weight,
        sprites: data.sprites,
        abilities: data.abilities,
        moves: data.moves.slice(0, 3),
        stats: data.stats,
        types: data.types
      })
    }
    fetchPokemon()
  }, [pokemonId])

  

  const resetStyles = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'rotateX(0) rotateY(0)'
    }
  }

  if (!pokemon) return null

  // Get the background color based on the Pokémon's first type
  const backgroundColor = typeColors[pokemon.types[0].type.name] || '#f3d165'

  return (
    <div
      
      className="relative w-[320px] h-[480px] [perspective:1000px]"
      
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        resetStyles()
      }}
    >
      <div
        ref={cardRef}
        className={cn(
          "w-full h-full rounded-2xl transition-all duration-100 [transform-style:preserve-3d]",
          isHovered ? "" : ""
        )}
        style={{
          backgroundImage: "url('/placeholder.svg?height=445&width=320')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          
        }}
      >
        {pokemon && (
          <>
          <Card className="border-none">
            <div className="absolute inset-0 rounded-[10px] bg-[#f3d165] p-[8px]">
              <div style={{ backgroundColor }} className=" h-full rounded-[6px] p-2 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-[16px] font-bold capitalize">{pokemon.name}</h2>
                    <p className="text-[8px]">Basic Pokémon</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[16px] font-bold">{pokemon.hp} HP</span>
                    <img src="/placeholder.svg?height=20&width=20" alt="Energy type" className="w-4 h-4 ml-1" />
                  </div>
                </div>

                <div className="mt-1 border-2 border-[#d3d3d3] rounded overflow-hidden">
                  <div className="bg-[#192653] aspect-[132/96] flex items-center justify-center">
                    <img src={pokemon.sprites.other["official-artwork"].front_shiny} alt={pokemon.name} className="w-40 h-40 object-contain" />
                  </div>
                </div>

                <div className="mt-1 text-[8px]">
                  <p><span className="font-bold capitalize">{pokemon.types[0].type.name} Pokémon.</span> Length: {pokemon.height * 0.1} m, Weight: {pokemon.weight * 0.1} kg.</p>
                </div>

                {pokemon.abilities.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <img src="/placeholder.svg?height=15&width=15" alt="Ability icon" className="w-3 h-3 mr-1" />
                      <h3 className="text-[10px] font-bold capitalize">{pokemon.abilities[0].ability.name}</h3>
                    </div>
                    <p className="text-[8px] mt-1">
                      If this Baby Pokémon is your Active Pokémon and your opponent tries to attack, your opponent flips a coin. If tails, your opponents turn ends without an attack.
                    </p>
                  </div>
                )}

                {pokemon.moves.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-[10px] font-bold text-red-600">Pokémon Power: {pokemon.moves[0].move.name}</h3>
                    <p className="text-[8px] mt-1">
                      Once during your turn (before your attack), you may flip a coin. If heads, do 20 damage to your opponents Active Pokémon. (Apply Weakness and Resistance.) Either way, this ends your turn. This power cant be used if {pokemon.name} is Asleep, Confused, or Paralyzed.
                    </p>
                  </div>
                )}

                <div className="absolute bottom-1 left-2 right-2">
                  <div className="flex justify-between text-[8px] border-t border-b border-[#d3d3d3] py-0.5">
                    <span>weakness</span>
                    <span>resistance</span>
                    <span>retreat cost</span>
                  </div>
                  <p className="text-[6px] italic text-center mt-1">
                    It rotates its arms to generate electricity, but it tires easily, so it charges up only a little bit.
                  </p>
                  <div className="flex justify-between text-[6px] mt-1">
                    <span>Illus. Miki Tanaka</span>
                    <span>©1995-2000 Nintendo, Creatures, GAMEFREAK</span>
                    <span>22/111 ★</span>
                  </div>
                </div>
              </div>
            </div></Card>
            {/* Hover effect for light radial gradient */}
            {isHovered && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)`,
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
