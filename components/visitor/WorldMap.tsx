'use client'

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { FiZoomIn, FiZoomOut, FiRefreshCw, FiInfo } from "react-icons/fi";
import { getCountryCode } from "@/libs/countryMapping";

const GEO_URL = "/world-110m.json";

export interface CountryStatItem {
  country: string;
  count: number;
  percentage: number;
  code: string;
  iso3: string;
  flag: string;
  citiesCount?: number;
  lastVisited?: Date | string | null;
}

interface WorldMapProps {
  countryStats: CountryStatItem[];
  selectedCountry: string | null;
  onSelectCountry: (country: string | null) => void;
}

export default function WorldMap({
  countryStats,
  selectedCountry,
  onSelectCountry,
}: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<{
    country: string;
    flag: string;
    count: number;
    percentage: number;
    x: number;
    y: number;
  } | null>(null);

  const [position, setPosition] = useState({ coordinates: [0, 10] as [number, number], zoom: 1 });

  // Map countryStats by code, iso3, name, and numeric ID for instant lookup
  const statsLookup: Record<string, CountryStatItem> = {};
  countryStats.forEach((s) => {
    if (s.country) statsLookup[s.country.toLowerCase()] = s;
    if (s.code && s.code !== "UN") statsLookup[s.code.toUpperCase()] = s;
    if (s.iso3 && s.iso3 !== "UNK") statsLookup[s.iso3.toUpperCase()] = s;
  });

  const maxCount = Math.max(...countryStats.map((s) => s.count), 1);

  const findStat = (geoName: string, geoId: string) => {
    if (!geoName && !geoId) return null;
    
    // Direct name lookup
    if (geoName && statsLookup[geoName.toLowerCase()]) {
      return statsLookup[geoName.toLowerCase()];
    }

    // Code derived lookup
    const meta = getCountryCode(geoName || geoId);
    if (meta.code !== "UN" && statsLookup[meta.code.toUpperCase()]) {
      return statsLookup[meta.code.toUpperCase()];
    }

    if (meta.iso3 !== "UNK" && statsLookup[meta.iso3.toUpperCase()]) {
      return statsLookup[meta.iso3.toUpperCase()];
    }

    // Numeric ID check
    const numericMeta = getCountryCode(geoId);
    if (numericMeta.code !== "UN" && statsLookup[numericMeta.code.toUpperCase()]) {
      return statsLookup[numericMeta.code.toUpperCase()];
    }

    return null;
  };

  const getFillColor = (stat: CountryStatItem | null, isSelected: boolean) => {
    if (isSelected) {
      return "#38bdf8"; // Cyan for selected
    }

    if (!stat || stat.count === 0) {
      return "#262626"; // Dark base
    }

    const ratio = stat.count / maxCount;
    if (ratio > 0.6) return "#ec4899"; // Vibrant Pink (High)
    if (ratio > 0.3) return "#a855f7"; // Purple (Medium)
    return "#818cf8"; // Indigo (Low)
  };

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((prev) => ({ ...prev, zoom: prev.zoom * 1.3 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((prev) => ({ ...prev, zoom: prev.zoom / 1.3 }));
  };

  const handleResetZoom = () => {
    setPosition({ coordinates: [0, 10], zoom: 1 });
    onSelectCountry(null);
  };

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setPosition(newPosition);
  };

  return (
    <div className="relative map-container bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 sm:p-6 overflow-hidden flex flex-col justify-between shadow-2xl backdrop-blur-md min-h-[440px] h-full">
      {/* Map Header & Controls */}
      <div className="flex flex-wrap justify-between items-center gap-3 z-10 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
          <h2 className="text-white font-semibold text-sm sm:text-base tracking-wide">
            Global Visitor Distribution
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-800/80 backdrop-blur-sm p-1 rounded-xl border border-neutral-700/50">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700/60 rounded-lg transition"
          >
            <FiZoomIn className="text-sm sm:text-base" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700/60 rounded-lg transition"
          >
            <FiZoomOut className="text-sm sm:text-base" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Map View"
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700/60 rounded-lg transition"
          >
            <FiRefreshCw className="text-sm sm:text-base" />
          </button>
        </div>
      </div>

      {/* Composable World Map */}
      <div className="relative w-full overflow-hidden flex-1 flex items-center justify-center py-2 select-none min-h-[300px]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 125,
            center: [0, 20],
          }}
          className="w-full h-auto max-h-[380px] outline-none"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: Array<{ rsmKey: string; id: string; properties: { name: string } }> }) =>
                geographies.map((geo) => {
                  const geoName = geo.properties?.name || "";
                  const geoId = String(geo.id || "");
                  const stat = findStat(geoName, geoId);

                  const isSelected = Boolean(
                    selectedCountry &&
                      (selectedCountry.toLowerCase() === geoName.toLowerCase() ||
                        (stat && selectedCountry.toLowerCase() === stat.country.toLowerCase()))
                  );

                  const fillColor = getFillColor(stat, isSelected);

                  return (
                    <Geography
                      key={geo.rsmKey || geoId || geoName}
                      geography={geo}
                      onMouseEnter={(e: React.MouseEvent<SVGPathElement>) => {
                        const container = e.currentTarget.closest(".map-container")?.getBoundingClientRect();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = container ? rect.left - container.left + rect.width / 2 : e.clientX;
                        const y = container ? rect.top - container.top : e.clientY;

                        setHoveredCountry({
                          country: stat ? stat.country : geoName,
                          flag: stat ? stat.flag : "🌐",
                          count: stat ? stat.count : 0,
                          percentage: stat ? stat.percentage : 0,
                          x,
                          y,
                        });
                      }}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => {
                        if (stat) {
                          onSelectCountry(selectedCountry === stat.country ? null : stat.country);
                        } else if (geoName) {
                          onSelectCountry(selectedCountry === geoName ? null : geoName);
                        }
                      }}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: "#171717",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "all 200ms ease",
                        },
                        hover: {
                          fill: stat && stat.count > 0 ? "#f472b6" : "#3f3f46",
                          stroke: "#ffffff",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#38bdf8",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Floating Hover Tooltip */}
      <AnimatePresence>
        {hoveredCountry && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-30 transform -translate-x-1/2 -translate-y-full bg-neutral-950/95 border border-pink-500/30 px-3.5 py-2 rounded-xl shadow-xl backdrop-blur-md"
            style={{
              left: `${hoveredCountry.x}px`,
              top: `${hoveredCountry.y - 12}px`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{hoveredCountry.flag}</span>
              <div>
                <p className="text-white font-bold text-xs tracking-wide">
                  {hoveredCountry.country}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <span className="text-pink-400 font-semibold">
                    {hoveredCountry.count} {hoveredCountry.count === 1 ? "visitor" : "visitors"}
                  </span>
                  {hoveredCountry.percentage > 0 && (
                    <span className="text-neutral-500">
                      ({hoveredCountry.percentage}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 border-t border-neutral-800/80 pt-3 mt-2 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#262626] border border-neutral-700" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#818cf8]" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#a855f7]" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#ec4899] shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
            <span>High</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-neutral-500 text-[11px]">
          <FiInfo className="text-pink-400" />
          <span>Drag to pan, scroll or use controls to zoom</span>
        </div>
      </div>
    </div>
  );
}
