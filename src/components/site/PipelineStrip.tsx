import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ClipboardList, Table2, Workflow, Server, AlertTriangle } from 'lucide-react';

interface AnimatedDot {
  id: number;
  stage: number; // 0 to 4 (or 5 for error branch)
  isErrorDivert: boolean;
  progress: number; // 0 to 1
}

export const PipelineStrip: React.FC = () => {
  const [processedCount, setProcessedCount] = useState(1284);
  const [cleanCount, setCleanCount] = useState(1267);
  const [caughtCount, setCaughtCount] = useState(17);
  const [activeDots, setActiveDots] = useState<AnimatedDot[]>([]);
  const [activeNodeHighlight, setActiveNodeHighlight] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const dotIdCounter = useRef(1);
  const dotSequenceCounter = useRef(1);

  useEffect(() => {
    // Visibility listener
    const onVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Intersection observer
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting && !document.hidden;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    // Spawn dot interval every 950ms
    const spawnTimer = setInterval(() => {
      if (!isVisibleRef.current) return;

      const isFifth = dotSequenceCounter.current % 5 === 0;
      dotSequenceCounter.current += 1;

      setActiveDots((prev) => {
        if (prev.length >= 6) return prev;
        return [
          ...prev,
          {
            id: dotIdCounter.current++,
            stage: 0,
            isErrorDivert: isFifth,
            progress: 0,
          },
        ];
      });

      setProcessedCount((p) => p + 1);
    }, 950);

    // Animation frame tick for dot movement
    const animTimer = setInterval(() => {
      if (!isVisibleRef.current) return;

      setActiveDots((prev) => {
        return prev
          .map((dot) => {
            const nextProgress = dot.progress + 0.055;
            if (nextProgress >= 1) {
              const nextStage = dot.stage + 1;

              // Check if completed clean route or error branch
              if (dot.isErrorDivert && nextStage === 4) {
                // diverts to error node
                setCaughtCount((c) => c + 1);
                return null;
              } else if (!dot.isErrorDivert && nextStage >= 5) {
                // completed to API
                setCleanCount((c) => c + 1);
                return null;
              }

              // Node brief highlight
              setActiveNodeHighlight(nextStage);
              setTimeout(() => setActiveNodeHighlight(null), 180);

              return {
                ...dot,
                stage: nextStage,
                progress: 0,
              };
            }
            return { ...dot, progress: nextProgress };
          })
          .filter(Boolean) as AnimatedDot[];
      });
    }, 45);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer.disconnect();
      clearInterval(spawnTimer);
      clearInterval(animTimer);
    };
  }, []);

  const nodes = [
    { label: 'Shopify', sub: 'Subscription', icon: ShoppingBag, x: 50 },
    { label: 'Tally', sub: 'Onboarding', icon: ClipboardList, x: 170 },
    { label: 'Sheets', sub: 'Parameters', icon: Table2, x: 290 },
    { label: 'Make', sub: 'Scenario', icon: Workflow, x: 410 },
    { label: 'API', sub: 'Fulfillment', icon: Server, x: 530 },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#FFFFFF] border border-[#CFC8BB] rounded-md p-6 shadow-1 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-[#E3DED5] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2F7D57] animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#4A524D] font-semibold">
            Live Pipeline Trace (Simulated)
          </span>
        </div>
        <span className="text-xs font-mono text-[#7A817B]">
          1 record / 950ms
        </span>
      </div>

      {/* SVG Canvas for nodes and traveling dots */}
      <div className="relative w-full overflow-x-auto pb-2">
        <svg
          viewBox="0 0 600 210"
          className="w-full h-auto min-w-[520px] select-none overflow-visible"
        >
          {/* Main Horizontal connecting line */}
          <line
            x1="50"
            y1="60"
            x2="530"
            y2="60"
            stroke="#CFC8BB"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Diverting line from Make down to Error node */}
          <path
            d="M 410 60 L 410 145 L 470 145"
            fill="none"
            stroke="#E3DED5"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* Nodes rendered on top */}
          {nodes.map((node, i) => {
            const Icon = node.icon;
            const isHighlighted = activeNodeHighlight === i;

            return (
              <g key={node.label} transform={`translate(${node.x}, 60)`}>
                {/* Node Box */}
                <rect
                  x="-36"
                  y="-32"
                  width="72"
                  height="64"
                  rx="8"
                  className={`transition-colors duration-200 ${
                    isHighlighted
                      ? 'fill-[#E4ECE7] stroke-[#24473B] stroke-2'
                      : 'fill-[#FBFAF7] stroke-[#CFC8BB] stroke-1 hover:stroke-[#24473B]'
                  }`}
                />
                {/* Lucide Glyph */}
                <foreignObject x="-10" y="-22" width="20" height="20">
                  <div className="w-full h-full flex items-center justify-center text-[#24473B]">
                    <Icon className="w-4 h-4" />
                  </div>
                </foreignObject>
                {/* Label & Sub */}
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  className="font-sans text-[11px] font-semibold fill-[#1F2421]"
                >
                  {node.label}
                </text>
                <text
                  x="0"
                  y="24"
                  textAnchor="middle"
                  className="font-mono text-[9px] fill-[#7A817B]"
                >
                  {node.sub}
                </text>
              </g>
            );
          })}

          {/* Downward Error Node */}
          <g transform="translate(470, 145)">
            <rect
              x="-42"
              y="-24"
              width="84"
              height="48"
              rx="6"
              className="fill-[#F7E0DE] stroke-[#B23A3A] stroke-1"
            />
            <foreignObject x="-36" y="-18" width="72" height="36">
              <div className="flex flex-col items-center justify-center text-[10px] text-[#B23A3A] font-medium leading-tight">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="font-semibold">Break</span>
                </div>
                <span className="font-mono text-[8px] text-[#B23A3A]">Error Log</span>
              </div>
            </foreignObject>
          </g>

          {/* Active Animated Traveling Dots */}
          {activeDots.map((dot) => {
            let cx = 50;
            let cy = 60;

            if (dot.isErrorDivert && dot.stage === 3) {
              // Diving down to error node from Make node
              if (dot.progress < 0.5) {
                cx = 410;
                cy = 60 + (dot.progress / 0.5) * 85;
              } else {
                cx = 410 + ((dot.progress - 0.5) / 0.5) * 60;
                cy = 145;
              }
            } else {
              // Regular straight path from node to node
              const startX = nodes[Math.min(dot.stage, 4)].x;
              const nextIndex = Math.min(dot.stage + 1, 4);
              const endX = nodes[nextIndex].x;
              cx = startX + (endX - startX) * dot.progress;
              cy = 60;
            }

            return (
              <circle
                key={dot.id}
                cx={cx}
                cy={cy}
                r="4.5"
                className={`transition-transform duration-75 ${
                  dot.isErrorDivert && dot.stage >= 3
                    ? 'fill-[#B23A3A]'
                    : 'fill-[#24473B]'
                }`}
              />
            );
          })}
        </svg>
      </div>

      {/* Beneath the strip: Fixed-width tabular figure counters */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E3DED5] text-center">
        <div className="flex flex-col">
          <span className="font-mono text-xl font-medium tabular-nums text-[#1F2421]">
            {processedCount.toLocaleString()}
          </span>
          <span className="text-xs text-[#7A817B]">Records processed</span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-xl font-medium tabular-nums text-[#2F7D57]">
            {cleanCount.toLocaleString()}
          </span>
          <span className="text-xs text-[#7A817B]">Clean to API</span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-xl font-medium tabular-nums text-[#B23A3A]">
            {caughtCount.toLocaleString()}
          </span>
          <span className="text-xs text-[#7A817B]">Caught & logged</span>
        </div>
      </div>
    </div>
  );
};
