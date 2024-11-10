'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Zap, Shield, Swords, Footprints, Heart } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PokemonStats {
  stats: { base_stat: number; stat: { name: string } }[]
}

const statDescriptions: { [key: string]: string } = {
  hp: "Hit Points - Determines how much damage a Pokémon can take before fainting",
  attack: "Attack - Determines the strength of physical moves",
  defense: "Defense - Reduces damage taken from physical attacks",
  "special-attack": "Special Attack - Determines the strength of special moves",
  "special-defense": "Special Defense - Reduces damage taken from special attacks",
  speed: "Speed - Determines which Pokémon acts first in battle",
}

const averageStats: { [key: string]: number } = {
  hp: 70,
  attack: 80,
  defense: 75,
  "special-attack": 80,
  "special-defense": 75,
  speed: 70,
}

export default function StatsPanel({ pokemonId }: { pokemonId: number }) {
  const [pokemonStats, setPokemonStats] = useState<PokemonStats | null>(null)

  useEffect(() => {
    const fetchPokemonStats = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      const data = await response.json()
      setPokemonStats({
        stats: data.stats,
      })
    }
    fetchPokemonStats()
  }, [pokemonId])

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case "hp": return <Heart className="w-4 h-4" />
      case "attack": return <Swords className="w-4 h-4" />
      case "defense": return <Shield className="w-4 h-4" />
      case "special-attack": return <Sparkles className="w-4 h-4" />
      case "special-defense": return <Zap className="w-4 h-4" />
      case "speed": return <Footprints className="w-4 h-4" />
      default: return null
    }
  }

  const getStatColor = (statName: string) => {
    switch (statName) {
      case "hp": return "bg-red-500"
      case "attack": return "bg-orange-500"
      case "defense": return "bg-blue-500"
      case "special-attack": return "bg-purple-500"
      case "special-defense": return "bg-green-500"
      case "speed": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">Pokemon Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <TooltipProvider>
          {pokemonStats && pokemonStats.stats.map((stat, index) => (
            <Tooltip key={index}>
              <TooltipTrigger className="w-full">
                <div className="flex items-center space-x-2 mb-1">
                  {getStatIcon(stat.stat.name)}
                  <span className="text-xs capitalize">{stat.stat.name}</span>
                  <span className="text-xs font-bold ml-auto">{stat.base_stat}</span>
                </div>
                <div className="relative h-2 w-full">
                  <Progress
                    value={(stat.base_stat / 255) * 100}
                    className={`h-full ${getStatColor(stat.stat.name)}`}
                  />
                  <motion.div
                    className="absolute top-0 h-full bg-white opacity-50"
                    initial={{ width: 0 }}
                    animate={{ width: `${(averageStats[stat.stat.name] / 255) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">{statDescriptions[stat.stat.name]}</p>
                <p className="text-xs mt-1">Average: {averageStats[stat.stat.name]}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}