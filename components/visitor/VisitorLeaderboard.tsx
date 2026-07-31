'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiGlobe, FiMapPin } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import { CountryStatItem } from "./WorldMap";

export interface CityStatItem {
  city: string;
  country: string;
  count: number;
  percentage: number;
  code: string;
  flag: string;
  lastVisited?: Date | string | null;
}

interface VisitorLeaderboardProps {
  countryStats: CountryStatItem[];
  cityStats?: CityStatItem[];
  totalVisitors: number;
  selectedCountry: string | null;
  onSelectCountry: (country: string | null) => void;
}

export default function VisitorLeaderboard({
  countryStats,
  cityStats = [],
  totalVisitors,
  selectedCountry,
  onSelectCountry,
}: VisitorLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<"country" | "city">("country");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountryStats = countryStats.filter((item) =>
    item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCityStats = cityStats.filter(
    (item) =>
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 font-bold text-xs shadow-[0_0_10px_rgba(245,158,11,0.3)]">
          1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-400/20 border border-slate-400/50 text-slate-300 font-bold text-xs">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 border border-amber-700/50 text-amber-600 font-bold text-xs">
          3
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 font-medium text-xs">
        {rank}
      </span>
    );
  };

  return (
    <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md h-full min-h-[440px]">
      {/* Header & Tabs */}
      <div className="space-y-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FaTrophy className="text-amber-400 text-lg sm:text-xl" />
            <h2 className="text-white font-bold text-base sm:text-lg">
              Leaderboard
            </h2>
          </div>

          {/* Tab Controls: By Country / By City */}
          <div className="flex items-center bg-neutral-950/80 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setActiveTab("country")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
                activeTab === "country"
                  ? "bg-pink-500 text-white shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <FiGlobe className="text-xs" />
              <span>Country</span>
            </button>
            <button
              onClick={() => setActiveTab("city")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
                activeTab === "city"
                  ? "bg-pink-500 text-white shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <FiMapPin className="text-xs" />
              <span>City ({cityStats.length})</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm" />
          <input
            type="text"
            placeholder={
              activeTab === "country"
                ? "Search country..."
                : "Search city or country..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950/70 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-pink-500/50 transition"
          />
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[340px] custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {activeTab === "country" ? (
            filteredCountryStats.length > 0 ? (
              filteredCountryStats.map((item) => {
                const rank = countryStats.findIndex((c) => c.country === item.country) + 1;
                const isSelected = selectedCountry?.toLowerCase() === item.country.toLowerCase();

                return (
                  <motion.div
                    key={item.country}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => onSelectCountry(isSelected ? null : item.country)}
                    className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-pink-500/10 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                        : "bg-neutral-950/40 border-neutral-800/60 hover:bg-neutral-800/50 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {getRankBadge(rank)}
                      <span className="text-2xl shrink-0">{item.flag}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs sm:text-sm font-semibold truncate group-hover:text-pink-300 transition">
                          {item.country}
                        </p>
                        <div className="w-full bg-neutral-800/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(item.percentage, 4)}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              rank === 1
                                ? "bg-linear-to-r from-amber-500 to-pink-500"
                                : "bg-linear-to-r from-violet-500 to-pink-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <p className="text-white font-bold text-xs sm:text-sm">
                        {item.count}{" "}
                        <span className="text-[11px] font-normal text-neutral-400">
                          {item.count === 1 ? "visitor" : "visitors"}
                        </span>
                      </p>
                      <p className="text-[11px] text-pink-400 font-medium">
                        {item.percentage}% of total
                      </p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-neutral-500 gap-2">
                <FiGlobe className="text-3xl text-neutral-600" />
                <p className="text-xs">No countries found for "{searchQuery}"</p>
              </div>
            )
          ) : filteredCityStats.length > 0 ? (
            filteredCityStats.map((item) => {
              const rank = cityStats.findIndex((c) => c.city === item.city && c.country === item.country) + 1;
              const isSelected = selectedCountry?.toLowerCase() === item.country.toLowerCase();

              return (
                <motion.div
                  key={`${item.city}-${item.country}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => onSelectCountry(isSelected ? null : item.country)}
                  className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-pink-500/10 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                      : "bg-neutral-950/40 border-neutral-800/60 hover:bg-neutral-800/50 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getRankBadge(rank)}
                    <span className="text-2xl shrink-0">{item.flag}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-xs sm:text-sm font-semibold truncate group-hover:text-pink-300 transition">
                        {item.city}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {item.country}
                      </p>
                      <div className="w-full bg-neutral-800/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(item.percentage, 4)}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            rank === 1
                              ? "bg-linear-to-r from-amber-500 to-cyan-500"
                              : "bg-linear-to-r from-blue-500 to-pink-500"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <p className="text-white font-bold text-xs sm:text-sm">
                      {item.count}{" "}
                      <span className="text-[11px] font-normal text-neutral-400">
                        {item.count === 1 ? "visitor" : "visitors"}
                      </span>
                    </p>
                    <p className="text-[11px] text-cyan-400 font-medium">
                      {item.percentage}% of total
                    </p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-neutral-500 gap-2">
              <FiMapPin className="text-3xl text-neutral-600" />
              <p className="text-xs">No cities found for "{searchQuery}"</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Total Bar */}
      <div className="border-t border-neutral-800/80 pt-3 mt-3 flex items-center justify-between text-xs text-neutral-400">
        <span>
          {activeTab === "country" ? "Total Countries" : "Total Cities Tracked"}
        </span>
        <span className="text-white font-bold text-sm bg-pink-500/10 border border-pink-500/20 px-2.5 py-0.5 rounded-lg text-pink-400">
          {activeTab === "country" ? countryStats.length : cityStats.length}
        </span>
      </div>
    </div>
  );
}
