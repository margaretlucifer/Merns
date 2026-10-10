import React, { useState } from 'react';
import { QrCode, Check, Copy, ShieldCheck } from 'lucide-react';

interface QRCodeDisplayProps {
  data: string;
  size?: number;
  label?: string;
  subtitle?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  data,
  size = 180,
  label = 'Campus Verified QR Code',
  subtitle = 'Scan for instant gate / attendance pass verification',
}) => {
  const [copied, setCopied] = useState(false);

  // Deterministic SVG QR pattern generator based on hash of input string
  const generateMatrix = (str: string) => {
    const matrixSize = 25;
    const grid: boolean[][] = Array(matrixSize)
      .fill(false)
      .map(() => Array(matrixSize).fill(false));

    // Corner finder patterns (7x7)
    const addFinder = (rowStart: number, colStart: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[rowStart + r][colStart + c] = isBorder || isCenter;
        }
      }
    };

    addFinder(0, 0); // Top-left
    addFinder(0, matrixSize - 7); // Top-right
    addFinder(matrixSize - 7, 0); // Bottom-left

    // Hash data to fill middle cells
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip finder zones
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= matrixSize - 8;
        const inBL = r >= matrixSize - 8 && c < 8;
        if (!inTL && !inTR && !inBL) {
          const seed = Math.sin(hash + r * 31 + c * 17) * 10000;
          grid[r][c] = seed - Math.floor(seed) > 0.48;
        }
      }
    }

    return grid;
  };

  const grid = generateMatrix(data);
  const cellSize = size / grid.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-200">
      <div className="relative p-3 bg-white rounded-lg shadow-xs border border-slate-100 flex items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xs">
          {grid.map((row, r) =>
            row.map((cell, c) =>
              cell ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="#0f172a"
                />
              ) : null
            )
          )}
        </svg>
      </div>

      <div className="mt-3 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>{label}</span>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5 max-w-[210px]">{subtitle}</p>
      </div>

      <button
        onClick={handleCopy}
        className="mt-3 flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied Token' : 'Copy Signed Payload'}</span>
      </button>
    </div>
  );
};
