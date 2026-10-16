import React from 'react';
import { PatchCategory } from '../../data/schema';

interface PatchArtProps {
  sku: string;
  name?: string;
  category: PatchCategory;
  shape?: 'circle' | 'shield' | 'rectangle' | 'hexagon';
  size?: number;
  className?: string;
}

export const PatchArt: React.FC<PatchArtProps> = ({
  sku,
  name,
  category,
  shape = 'circle',
  size = 56,
  className = '',
}) => {
  // Category specific base colors
  const categoryBg =
    category === 'Academic' ? '#2F4836' : category === 'Athletic' ? '#8F341F' : '#8A6318';
  const categoryBorder =
    category === 'Academic' ? '#4F6B52' : category === 'Athletic' ? '#B5472F' : '#B8892B';
  const threadColor = category === 'Athletic' ? '#F7F3EC' : '#F7F3EC';

  // Render patch specific icon glyph
  const renderGlyph = () => {
    switch (sku) {
      case 'ACD-001': // Honor Roll
        return (
          <g>
            <path
              d="M32 38 C32 46, 44 48, 50 54 C56 48, 68 46, 68 38 C68 28, 50 24, 50 24 C50 24, 32 28, 32 38 Z"
              fill="#B8892B"
              stroke="#F7F3EC"
              strokeWidth="1.5"
            />
            <path
              d="M40 50 L50 42 L60 50"
              stroke="#F7F3EC"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="50" cy="34" r="4" fill="#F7F3EC" />
          </g>
        );
      case 'ACD-002': // Perfect Attendance
        return (
          <g>
            <circle cx="50" cy="50" r="16" fill="none" stroke="#F7F3EC" strokeWidth="2.5" />
            <path
              d="M50 38 V50 L58 54"
              stroke="#F7F3EC"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        );
      case 'ACD-003': // AP Scholar
        return (
          <g>
            <path
              d="M30 46 L50 32 L70 46 L50 60 Z"
              fill="#B8892B"
              stroke="#F7F3EC"
              strokeWidth="2"
            />
            <text
              x="50"
              y="53"
              fill="#1C2B3A"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              AP
            </text>
          </g>
        );
      case 'ACD-004': // National Honor Society
        return (
          <g>
            {/* Torch */}
            <path d="M48 42 L52 42 L51 64 L49 64 Z" fill="#F7F3EC" />
            <path
              d="M45 42 H55 L53 38 H47 Z"
              fill="#B8892B"
            />
            <path
              d="M50 24 C46 30 54 34 50 38 C54 35 56 31 50 24 Z"
              fill="#B5472F"
            />
          </g>
        );
      case 'ATH-001': // Varsity Track
        return (
          <g>
            {/* Winged foot */}
            <path
              d="M36 54 C42 46 54 44 64 42 L68 50 C62 52 50 56 42 62 Z"
              fill="#F7F3EC"
            />
            <path
              d="M44 48 C48 38 60 34 66 32 C62 38 56 42 48 44 Z"
              fill="#B8892B"
            />
          </g>
        );
      case 'ATH-002': // Varsity Soccer
        return (
          <g>
            <circle cx="50" cy="50" r="18" fill="#F7F3EC" stroke="#1C2B3A" strokeWidth="2" />
            <polygon points="50,42 58,48 55,57 45,57 42,48" fill="#1C2B3A" />
            <path d="M50 42 V32 M58 48 L67 44 M55 57 L61 65 M45 57 L39 65 M42 48 L33 44" stroke="#1C2B3A" strokeWidth="2" />
          </g>
        );
      case 'ATH-003': // Varsity Basketball
        return (
          <g>
            <circle cx="50" cy="50" r="18" fill="#B5472F" stroke="#F7F3EC" strokeWidth="2" />
            <path d="M32 50 H68 M50 32 V68 M37 37 C45 45 45 55 37 63 M63 37 C55 45 55 55 63 63" stroke="#F7F3EC" strokeWidth="1.5" fill="none" />
          </g>
        );
      case 'ATH-004': // All-Conference
        return (
          <g>
            <polygon points="50,30 55,42 68,43 57,51 61,64 50,56 39,64 43,51 32,43 45,42" fill="#B8892B" stroke="#F7F3EC" strokeWidth="1.5" />
          </g>
        );
      case 'ATH-005': // Team Captain
        return (
          <g>
            <text x="50" y="58" fill="#F7F3EC" fontSize="28" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
              C
            </text>
            <line x1="38" y1="64" x2="62" y2="64" stroke="#B8892B" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case 'LDR-001': // Student Council
        return (
          <g>
            <path d="M34 52 L50 36 L66 52 L58 64 H42 Z" fill="#B8892B" stroke="#F7F3EC" strokeWidth="2" />
            <circle cx="50" cy="50" r="5" fill="#1C2B3A" />
          </g>
        );
      case 'LDR-002': // Peer Mentor
        return (
          <g>
            {/* Clasping hands / handshake outline */}
            <path d="M34 46 C38 40 48 40 52 46 L60 52 C64 56 60 62 54 60 L48 54 L44 56 C40 58 34 52 34 46 Z" fill="#F7F3EC" />
            <circle cx="44" cy="38" r="3" fill="#B8892B" />
            <circle cx="56" cy="38" r="3" fill="#B8892B" />
          </g>
        );
      case 'LDR-003': // Community Service 100 hrs
        return (
          <g>
            <circle cx="50" cy="50" r="18" fill="none" stroke="#F7F3EC" strokeWidth="2" />
            <text x="50" y="55" fill="#F7F3EC" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              100h
            </text>
          </g>
        );
      default:
        return (
          <g>
            <circle cx="50" cy="50" r="14" fill="#F7F3EC" />
            <circle cx="50" cy="50" r="8" fill={categoryBg} />
          </g>
        );
    }
  };

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center flex-shrink-0 transition-transform ${className}`}
      title={name}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow">
        {/* Outer patch geometry based on shape */}
        {shape === 'circle' && (
          <circle cx="50" cy="50" r="46" fill={categoryBg} stroke="#1C2B3A" strokeWidth="2" />
        )}
        {shape === 'shield' && (
          <path
            d="M50 8 L88 20 V52 C88 74 50 92 50 92 C50 92 12 74 12 52 V20 Z"
            fill={categoryBg}
            stroke="#1C2B3A"
            strokeWidth="2"
          />
        )}
        {shape === 'hexagon' && (
          <polygon
            points="50,6 88,28 88,72 50,94 12,72 12,28"
            fill={categoryBg}
            stroke="#1C2B3A"
            strokeWidth="2"
          />
        )}
        {shape === 'rectangle' && (
          <rect
            x="8"
            y="16"
            width="84"
            height="68"
            rx="12"
            fill={categoryBg}
            stroke="#1C2B3A"
            strokeWidth="2"
          />
        )}

        {/* Stitched embroidery border */}
        {shape === 'circle' && (
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={categoryBorder}
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        )}
        {shape === 'shield' && (
          <path
            d="M50 14 L82 24 V50 C82 69 50 84 50 84 C50 84 18 69 18 50 V24 Z"
            fill="none"
            stroke={categoryBorder}
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        )}
        {shape === 'hexagon' && (
          <polygon
            points="50,12 82,31 82,69 50,88 18,69 18,31"
            fill="none"
            stroke={categoryBorder}
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        )}
        {shape === 'rectangle' && (
          <rect
            x="14"
            y="22"
            width="72"
            height="56"
            rx="8"
            fill="none"
            stroke={categoryBorder}
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        )}

        {/* Glyph inside */}
        {renderGlyph()}
      </svg>
    </div>
  );
};
