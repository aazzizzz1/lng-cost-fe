import React, { useState } from "react";
// Import assets sesuai lokasi dan nama file di disk
import onshorePlantImg from "../../Assets/Images/onshore lng plant.png";
import offshorePlantImg from "../../Assets/Images/offshore lng plant.png";
import storageTankImg from "../../Assets/Images/storagetank.png";
import truckTankerImg from "../../Assets/Images/trucking.png";
import lngCarrierImg from "../../Assets/Images/lngc.png";
import fsruImg from "../../Assets/Images/fsru.png";
import orfImg from "../../Assets/Images/gas pipe.png";

// Data infrastruktur LNG dengan posisi relatif (persentase)
const infrastructures = [
  {
    id: "onshore-plant",
    name: "Onshore LNG Plant",
    type: "onshore",
    icon: onshorePlantImg,
    desc: "Onshore LNG Plant: Produksi LNG di darat.",
    x: "70%",
    y: "40%",
  },
  {
    id: "orf",
    name: "ORF Receiving Terminal",
    type: "onshore",
    icon: orfImg,
    desc: "ORF: Onshore Receiving Facility.",
    x: "35%",
    y: "20%",
  },
  {
    id: "trucking",
    name: "Trucking",
    type: "onshore",
    icon: truckTankerImg,
    desc: "Trucking: Transportasi LNG via darat.",
    x: "5%",
    y: "25%",
  },
  {
    id: "storage-tank",
    name: "Storage Tank",
    type: "onshore",
    icon: storageTankImg,
    desc: "Storage Tank: Penyimpanan LNG.",
    x: "50%",
    y: "28%",
  },
  {
    id: "lng-carrier",
    name: "LNG Carrier",
    type: "offshore",
    icon: lngCarrierImg,
    desc: "LNG Carrier: Kapal pengangkut LNG.",
    x: "3%",
    y: "70%",
  },
  {
    id: "fsru",
    name: "FSRU",
    type: "offshore",
    icon: fsruImg,
    desc: "FSRU: Floating Storage Regasification Unit.",
    x: "70%",
    y: "70%",
  },
  {
    id: "offshore-plant",
    name: "Offshore LNG Plant",
    type: "offshore",
    icon: offshorePlantImg,
    desc: "Offshore LNG Plant: Produksi LNG di laut.",
    x: "85%",
    y: "60%",
  },
];

const connectors = [
  { from: "onshore-plant", to: "orf" },
  { from: "onshore-plant", to: "trucking" },
  { from: "onshore-plant", to: "storage-tank" },
  { from: "onshore-plant", to: "fsru" },
  { from: "fsru", to: "lng-carrier" },
  { from: "fsru", to: "offshore-plant" },
];

const getPos = (x, y) => ({
  left: x,
  top: y,
});

const LNGInfrastructure = () => {
  const [hovered, setHovered] = useState(null);

  // Helper to get absolute pixel position for connectors
  const getCenter = (infra) => {
    // Container is 1000x500px
    const px = (parseFloat(infra.x) / 100) * 1000;
    const py = (parseFloat(infra.y) / 100) * 500;
    return { x: px + 36, y: py + 36 };
  };

  return (
    <div className="relative w-full flex justify-center items-center mb-8">
      {/* Animasi kapal dengan Tailwind */}
      <div className="relative w-[1000px] h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-green-200 via-blue-100 to-blue-300">
        {/* Laut dengan gelombang SVG */}
        <svg
          className="absolute left-0 top-0 w-full h-full z-0 pointer-events-none"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
        >
          {/* Darat */}
          <rect x="0" y="0" width="1000" height="320" fill="#bbf7d0" />
          {/* Gelombang laut - lebih diturunkan */}
          <path
            d="
              M0,320 
              Q150,350 300,320 
              T600,320 
              Q750,350 1000,320 
              L1000,500 
              L0,500 
              Z
            "
            fill="#60a5fa"
            opacity="0.95"
          />
          {/* Layer gelombang kedua untuk efek */}
          <path
            d="
              M0,350 
              Q200,380 400,350 
              T800,360 
              Q900,370 1000,350 
              L1000,500 
              L0,500 
              Z
            "
            fill="#38bdf8"
            opacity="0.7"
          />
        </svg>
        {/* Pohon dekorasi */}
        <div className="absolute left-[13%] top-[30%]">
          <div className="w-8 h-8 rounded-full bg-green-500 mx-auto" />
          <div className="w-2 h-6 bg-yellow-900 mx-auto rounded" />
        </div>
        <div className="absolute left-[87%] top-[18%]">
          <div className="w-8 h-8 rounded-full bg-green-500 mx-auto" />
          <div className="w-2 h-6 bg-yellow-900 mx-auto rounded" />
        </div>
        {/* Garis konektor (pipa) */}
        <svg className="absolute w-full h-full z-10 pointer-events-none">
          {connectors.map((c, i) => {
            const from = infrastructures.find((x) => x.id === c.from);
            const to = infrastructures.find((x) => x.id === c.to);
            if (!from || !to) return null;
            const fromC = getCenter(from);
            const toC = getCenter(to);

            // Pipa: gunakan path dengan efek pipa (stroke warna, outline, dan highlight)
            return (
              <g key={i}>
                {/* Outer pipe (shadow) */}
                <path
                  d={`M${fromC.x} ${fromC.y} L${toC.x} ${toC.y}`}
                  stroke="#64748b"
                  strokeWidth="16"
                  strokeLinecap="round"
                  opacity="0.25"
                />
                {/* Main pipe */}
                <path
                  d={`M${fromC.x} ${fromC.y} L${toC.x} ${toC.y}`}
                  stroke="#fbbf24"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="transition-all"
                  style={{ filter: "drop-shadow(0 2px 2px #0001)" }}
                />
                {/* Pipe highlight */}
                <path
                  d={`M${fromC.x} ${fromC.y} L${toC.x} ${toC.y}`}
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.5"
                  style={{
                    filter: "blur(1px)",
                    strokeDasharray: "10 8",
                  }}
                />
                {/* Arrowhead as pipe cap */}
                <circle
                  cx={toC.x}
                  cy={toC.y}
                  r="8"
                  fill="#fbbf24"
                  stroke="#64748b"
                  strokeWidth="3"
                />
                <rect
                  x={toC.x - 7}
                  y={toC.y - 4}
                  width="14"
                  height="8"
                  rx="3"
                  fill="#fff"
                  opacity="0.7"
                  transform={`rotate(${
                    (Math.atan2(toC.y - fromC.y, toC.x - fromC.x) * 180) /
                    Math.PI
                  },${toC.x},${toC.y})`}
                />
              </g>
            );
          })}
        </svg>
        {/* Infrastruktur */}
        {infrastructures.map((infra) => {
          // Kapal laut animasi dengan Tailwind
          let extraClass = "";
          if (infra.id === "lng-carrier") {
            extraClass = "animate-[kapal-kanan_4s_ease-in-out_infinite]";
          }
          if (infra.id === "fsru") {
            extraClass = "animate-[kapal-kiri_4s_ease-in-out_infinite]";
          }
          return (
            <div
              key={infra.id}
              className={`absolute flex flex-col items-center group transition-transform duration-300`}
              style={{
                ...getPos(infra.x, infra.y),
                width: 72,
                zIndex: 20,
              }}
              onMouseEnter={() => setHovered(infra.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full border-4 shadow-lg bg-white/90 border-gray-300 group-hover:scale-110 transition-transform duration-200 ${extraClass}`}
                style={{
                  fontSize: 36,
                  boxShadow:
                    hovered === infra.id ? "0 0 24px #2563eb77" : "",
                }}
              >
                {/* Ganti emoji dengan gambar */}
                <img src={infra.icon} alt={infra.name} className="w-12 h-12 object-contain" />
              </div>
              <span className="mt-2 text-sm font-bold text-slate-800 drop-shadow group-hover:text-blue-700 transition-colors duration-200 text-center">
                {infra.name}
              </span>
              {/* Tooltip */}
              {hovered === infra.id && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-44 bg-white border border-blue-400 rounded-lg shadow-lg p-2 text-xs text-gray-700 z-30 animate-fade-in">
                  {infra.desc}
                </div>
              )}
            </div>
          );
        })}
        {/* Simbol LNG besar */}
        <div className="absolute left-[73%] top-[5%] text-blue-400 font-extrabold text-6xl opacity-20 select-none pointer-events-none">
          LNG
        </div>
        {/* Custom Tailwind keyframes */}
        <style>
          {`
            @tailwind base;
            @tailwind components;
            @tailwind utilities;
            @layer utilities {
              @keyframes kapal-kanan {
                0% { transform: translateX(0); }
                50% { transform: translateX(30px); }
                100% { transform: translateX(0); }
              }
              @keyframes kapal-kiri {
                0% { transform: translateX(0); }
                50% { transform: translateX(-30px); }
                100% { transform: translateX(0); }
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default LNGInfrastructure;