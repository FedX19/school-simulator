// Letter tracing definitions for A-J
// Each letter has multiple strokes, each stroke is an array of points [x, y]
// Coordinates are normalized 0-1 for easy scaling

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  points: Point[];
}

export interface LetterDefinition {
  letter: string;
  strokes: Stroke[];
}

// Helper to create evenly spaced points along a line
function createLinePoints(x1: number, y1: number, x2: number, y2: number, numPoints: number = 100): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    points.push({
      x: x1 + (x2 - x1) * t,
      y: y1 + (y2 - y1) * t,
    });
  }
  return points;
}

// Letter definitions (normalized coordinates 0-1)
export const LETTER_DEFINITIONS: LetterDefinition[] = [
  // A: 3 strokes (left diagonal, right diagonal, horizontal bar)
  {
    letter: 'A',
    strokes: [
      { points: createLinePoints(0.5, 0.1, 0.1, 0.9, 100) }, // Left diagonal
      { points: createLinePoints(0.5, 0.1, 0.9, 0.9, 100) }, // Right diagonal
      { points: createLinePoints(0.25, 0.6, 0.75, 0.6, 80) }, // Horizontal bar
    ],
  },

  // B: 3 strokes (vertical line, top bump, bottom bump)
  {
    letter: 'B',
    strokes: [
      { points: createLinePoints(0.2, 0.1, 0.2, 0.9, 100) }, // Vertical line
      { points: [
        ...createLinePoints(0.2, 0.1, 0.6, 0.1, 30),
        ...createLinePoints(0.6, 0.1, 0.7, 0.3, 25),
        ...createLinePoints(0.7, 0.3, 0.6, 0.5, 25),
        ...createLinePoints(0.6, 0.5, 0.2, 0.5, 30),
      ] }, // Top bump
      { points: [
        ...createLinePoints(0.2, 0.5, 0.7, 0.5, 30),
        ...createLinePoints(0.7, 0.5, 0.8, 0.7, 25),
        ...createLinePoints(0.8, 0.7, 0.7, 0.9, 25),
        ...createLinePoints(0.7, 0.9, 0.2, 0.9, 30),
      ] }, // Bottom bump
    ],
  },

  // C: 1 stroke (arc)
  {
    letter: 'C',
    strokes: [
      { points: [
        ...createLinePoints(0.8, 0.2, 0.6, 0.1, 25),
        ...createLinePoints(0.6, 0.1, 0.3, 0.1, 35),
        ...createLinePoints(0.3, 0.1, 0.15, 0.25, 30),
        ...createLinePoints(0.15, 0.25, 0.15, 0.75, 50),
        ...createLinePoints(0.15, 0.75, 0.3, 0.9, 30),
        ...createLinePoints(0.3, 0.9, 0.6, 0.9, 35),
        ...createLinePoints(0.6, 0.9, 0.8, 0.8, 25),
      ] },
    ],
  },

  // D: 2 strokes (vertical line, curved right side)
  {
    letter: 'D',
    strokes: [
      { points: createLinePoints(0.2, 0.1, 0.2, 0.9, 100) }, // Vertical line
      { points: [
        ...createLinePoints(0.2, 0.1, 0.5, 0.1, 35),
        ...createLinePoints(0.5, 0.1, 0.7, 0.2, 30),
        ...createLinePoints(0.7, 0.2, 0.8, 0.5, 35),
        ...createLinePoints(0.8, 0.5, 0.7, 0.8, 35),
        ...createLinePoints(0.7, 0.8, 0.5, 0.9, 30),
        ...createLinePoints(0.5, 0.9, 0.2, 0.9, 35),
      ] },
    ],
  },

  // E: 4 strokes (vertical, top horizontal, middle horizontal, bottom horizontal)
  {
    letter: 'E',
    strokes: [
      { points: createLinePoints(0.2, 0.1, 0.2, 0.9, 100) }, // Vertical line
      { points: createLinePoints(0.2, 0.1, 0.8, 0.1, 80) },  // Top horizontal
      { points: createLinePoints(0.2, 0.5, 0.7, 0.5, 70) },  // Middle horizontal
      { points: createLinePoints(0.2, 0.9, 0.8, 0.9, 80) },  // Bottom horizontal
    ],
  },

  // F: 3 strokes (vertical, top horizontal, middle horizontal)
  {
    letter: 'F',
    strokes: [
      { points: createLinePoints(0.2, 0.1, 0.2, 0.9, 100) }, // Vertical line
      { points: createLinePoints(0.2, 0.1, 0.8, 0.1, 80) },  // Top horizontal
      { points: createLinePoints(0.2, 0.5, 0.7, 0.5, 70) },  // Middle horizontal
    ],
  },

  // G: 2 strokes (C-shape, then horizontal bar)
  {
    letter: 'G',
    strokes: [
      { points: [
        ...createLinePoints(0.8, 0.2, 0.6, 0.1, 25),
        ...createLinePoints(0.6, 0.1, 0.3, 0.1, 35),
        ...createLinePoints(0.3, 0.1, 0.15, 0.25, 30),
        ...createLinePoints(0.15, 0.25, 0.15, 0.75, 50),
        ...createLinePoints(0.15, 0.75, 0.3, 0.9, 30),
        ...createLinePoints(0.3, 0.9, 0.6, 0.9, 35),
        ...createLinePoints(0.6, 0.9, 0.8, 0.75, 30),
      ] },
      { points: createLinePoints(0.8, 0.75, 0.8, 0.5, 40),
               ...createLinePoints(0.8, 0.5, 0.5, 0.5, 40) }, // Horizontal bar
    ],
  },

  // H: 3 strokes (left vertical, right vertical, horizontal bar)
  {
    letter: 'H',
    strokes: [
      { points: createLinePoints(0.2, 0.1, 0.2, 0.9, 100) }, // Left vertical
      { points: createLinePoints(0.8, 0.1, 0.8, 0.9, 100) }, // Right vertical
      { points: createLinePoints(0.2, 0.5, 0.8, 0.5, 80) },  // Horizontal bar
    ],
  },

  // I: 3 strokes (top horizontal, vertical, bottom horizontal)
  {
    letter: 'I',
    strokes: [
      { points: createLinePoints(0.3, 0.1, 0.7, 0.1, 60) },  // Top horizontal
      { points: createLinePoints(0.5, 0.1, 0.5, 0.9, 100) }, // Vertical
      { points: createLinePoints(0.3, 0.9, 0.7, 0.9, 60) },  // Bottom horizontal
    ],
  },

  // J: 2 strokes (top horizontal, curved vertical)
  {
    letter: 'J',
    strokes: [
      { points: createLinePoints(0.3, 0.1, 0.7, 0.1, 60) }, // Top horizontal
      { points: [
        ...createLinePoints(0.6, 0.1, 0.6, 0.7, 70),
        ...createLinePoints(0.6, 0.7, 0.5, 0.85, 25),
        ...createLinePoints(0.5, 0.85, 0.3, 0.85, 30),
        ...createLinePoints(0.3, 0.85, 0.2, 0.75, 20),
      ] },
    ],
  },
];

// Shuffle utility
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
