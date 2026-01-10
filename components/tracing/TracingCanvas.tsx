import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import type { LetterDefinition, Point } from '@/data/letters';

const { width: screenWidth } = Dimensions.get('window');
const CANVAS_SIZE = Math.min(screenWidth - 40, 400);
const COVERAGE_RADIUS = 30; // How close user stroke must be to target point
const LETTER_COMPLETION_THRESHOLD = 0.72; // 72% to complete a letter
const INTERPOLATION_STEP = 8; // Generate intermediate points every ~8px

interface TracingCanvasProps {
  letter: LetterDefinition;
  onLetterComplete: () => void;
  onProgressUpdate: (progress: number) => void;
  onTraceStart?: () => void;
  onTraceEnd?: () => void;
}

interface UserStrokePoint {
  x: number;
  y: number;
}

export default function TracingCanvas({ letter, onLetterComplete, onProgressUpdate, onTraceStart, onTraceEnd }: TracingCanvasProps) {
  const [userStrokes, setUserStrokes] = useState<UserStrokePoint[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<UserStrokePoint[]>([]);
  const [activeStrokeIndex, setActiveStrokeIndex] = useState(0);
  const [coveredPoints, setCoveredPoints] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafIdRef = useRef<number | null>(null);

  // Scale letter coordinates to canvas size
  const scalePoint = (p: Point): Point => ({
    x: p.x * CANVAS_SIZE,
    y: p.y * CANVAS_SIZE,
  });

  // Calculate distance between two points
  const distance = (p1: Point, p2: Point): number => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Generate intermediate points between two points for smooth coverage
  const interpolatePoints = (p1: UserStrokePoint, p2: UserStrokePoint): UserStrokePoint[] => {
    const dist = distance(p1, p2);
    if (dist <= INTERPOLATION_STEP) {
      return [p2];
    }

    const points: UserStrokePoint[] = [];
    const numSteps = Math.ceil(dist / INTERPOLATION_STEP);

    for (let i = 1; i <= numSteps; i++) {
      const t = i / numSteps;
      points.push({
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
      });
    }

    return points;
  };

  // Check which target points are covered by user strokes
  const checkCoverage = (userPoint: UserStrokePoint) => {
    const newCoveredPoints = new Set(coveredPoints);
    const activeStroke = letter.strokes[activeStrokeIndex];

    if (!activeStroke) return;

    // Check points in the active stroke only
    activeStroke.points.forEach((targetPoint, idx) => {
      const scaledTarget = scalePoint(targetPoint);
      const dist = distance(scaledTarget, userPoint);

      if (dist < COVERAGE_RADIUS) {
        const key = `${activeStrokeIndex}-${idx}`;
        newCoveredPoints.add(key);
      }
    });

    setCoveredPoints(newCoveredPoints);

    // Calculate progress
    const totalPoints = letter.strokes.reduce((sum, stroke) => sum + stroke.points.length, 0);
    const calculatedProgress = newCoveredPoints.size / totalPoints;
    setProgress(calculatedProgress);

    // Check if letter is complete
    if (calculatedProgress >= LETTER_COMPLETION_THRESHOLD && !isCompleted) {
      setIsCompleted(true);
      setTimeout(() => {
        onLetterComplete();
      }, 300);
    } else {
      // Check if current stroke is complete enough to advance
      const activeStrokePoints = activeStroke.points.length;
      const activeStrokeCovered = Array.from(newCoveredPoints).filter(
        key => key.startsWith(`${activeStrokeIndex}-`)
      ).length;
      const strokeProgress = activeStrokeCovered / activeStrokePoints;

      if (strokeProgress >= 0.60 && activeStrokeIndex < letter.strokes.length - 1) {
        // Advance to next stroke
        setActiveStrokeIndex(activeStrokeIndex + 1);
      }
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt) => {
        onTraceStart?.();
        const { locationX, locationY } = evt.nativeEvent;
        const point = { x: locationX, y: locationY };
        setCurrentStroke([point]);
        checkCoverage(point);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const point = { x: locationX, y: locationY };

        setCurrentStroke((prev) => {
          if (prev.length > 0) {
            // Interpolate between last point and new point
            const lastPoint = prev[prev.length - 1];
            const interpolated = interpolatePoints(lastPoint, point);

            // Check coverage for all interpolated points
            interpolated.forEach(p => checkCoverage(p));

            return [...prev, ...interpolated];
          } else {
            // First point in stroke
            checkCoverage(point);
            return [point];
          }
        });
      },
      onPanResponderRelease: () => {
        onTraceEnd?.();
        if (currentStroke.length > 0) {
          setUserStrokes((prev) => [...prev, currentStroke]);
          setCurrentStroke([]);
        }
      },
      onPanResponderTerminate: () => {
        onTraceEnd?.();
        if (currentStroke.length > 0) {
          setUserStrokes((prev) => [...prev, currentStroke]);
          setCurrentStroke([]);
        }
      },
    })
  ).current;

  // Throttled progress update using requestAnimationFrame
  useEffect(() => {
    // Cancel any pending animation frame
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Schedule update for next animation frame
    rafIdRef.current = requestAnimationFrame(() => {
      onProgressUpdate(progress);
      rafIdRef.current = null;
    });

    // Cleanup on unmount
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [progress, onProgressUpdate]);

  // Convert stroke points to SVG path
  const strokeToPath = (stroke: UserStrokePoint[]): string => {
    if (stroke.length === 0) return '';

    let path = `M ${stroke[0].x} ${stroke[0].y}`;
    for (let i = 1; i < stroke.length; i++) {
      path += ` L ${stroke[i].x} ${stroke[i].y}`;
    }
    return path;
  };

  // Render guide stroke
  const renderGuideStroke = (stroke: Point[], strokeIndex: number) => {
    const isActive = strokeIndex === activeStrokeIndex;
    const scaled = stroke.map(scalePoint);
    const pathData = strokeToPath(scaled);

    return (
      <Path
        key={`guide-${strokeIndex}`}
        d={pathData}
        stroke={isActive ? '#A29BFE' : '#E0E0E0'}
        strokeWidth={isActive ? 16 : 12}
        strokeOpacity={isActive ? 0.6 : 0.3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  // Render covered points as dots (visual feedback)
  const renderCoveredPoints = () => {
    const dots: JSX.Element[] = [];

    letter.strokes.forEach((stroke, strokeIndex) => {
      stroke.points.forEach((point, pointIndex) => {
        const key = `${strokeIndex}-${pointIndex}`;
        if (coveredPoints.has(key)) {
          const scaled = scalePoint(point);
          // Only show some dots to avoid clutter (every 5th point)
          if (pointIndex % 5 === 0) {
            dots.push(
              <Circle
                key={key}
                cx={scaled.x}
                cy={scaled.y}
                r={3}
                fill="#4CAF50"
                opacity={0.7}
              />
            );
          }
        }
      });
    });

    return dots;
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg width={CANVAS_SIZE} height={CANVAS_SIZE} style={styles.svg}>
        {/* Guide strokes */}
        {letter.strokes.map((stroke, idx) => renderGuideStroke(stroke.points, idx))}

        {/* Covered points */}
        {renderCoveredPoints()}

        {/* User strokes */}
        {userStrokes.map((stroke, idx) => (
          <Path
            key={`user-${idx}`}
            d={strokeToPath(stroke)}
            stroke="#2196F3"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Current stroke being drawn */}
        {currentStroke.length > 0 && (
          <Path
            d={strokeToPath(currentStroke)}
            stroke="#2196F3"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  svg: {
    backgroundColor: '#FFF',
  },
});
