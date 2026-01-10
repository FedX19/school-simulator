import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import type { LetterDefinition, Point } from '@/data/letters';

const { width: screenWidth } = Dimensions.get('window');
const CANVAS_SIZE = Math.min(screenWidth - 40, 400);
const COVERAGE_RADIUS = 70; // Forgiving hit detection
const WHOLE_LETTER_THRESHOLD = 0.65; // 65% overall coverage required
const PER_STROKE_THRESHOLD = 0.45; // 45% coverage per stroke required
const STROKE_ADVANCE_THRESHOLD = 0.20; // 20% to advance visual hint
const INTERPOLATION_STEP = 8; // Generate intermediate points every ~8px
const AUTO_COMPLETE_MIN_PROGRESS = 0.60; // Auto-complete requires at least 60% progress
const AUTO_COMPLETE_DISTANCE = 2500; // Auto-complete if drawn this much distance
const AUTO_COMPLETE_TIME = 3000; // Auto-complete after 3 seconds of effort (ms)
const ERROR_DISPLAY_TIME = 800; // Show error feedback for 800ms

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
  const [showError, setShowError] = useState(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track effort for auto-complete
  const [totalDrawnDistance, setTotalDrawnDistance] = useState(0);
  const [firstDrawTime, setFirstDrawTime] = useState<number | null>(null);

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

  // Check if effort-based auto-complete should trigger (gated by progress)
  const checkAutoComplete = (currentProgress: number) => {
    if (isCompleted) return false;

    // Auto-complete requires at least 60% progress
    if (currentProgress < AUTO_COMPLETE_MIN_PROGRESS) return false;

    const now = Date.now();
    const timeSpent = firstDrawTime ? now - firstDrawTime : 0;

    // Auto-complete if sufficient effort shown AND progress >= 60%
    if (totalDrawnDistance > AUTO_COMPLETE_DISTANCE ||
        (timeSpent > AUTO_COMPLETE_TIME && totalDrawnDistance > 100)) {
      return true;
    }

    return false;
  };

  // Check which target points are covered by user strokes
  const checkCoverage = (userPoint: UserStrokePoint) => {
    // Use functional update to avoid stale state in tight loops
    setCoveredPoints(prev => {
      const next = new Set(prev);

      // Day 1 Easy Mode: Check ALL strokes, not just active
      // This removes strict stroke-order enforcement
      letter.strokes.forEach((stroke, strokeIndex) => {
        stroke.points.forEach((targetPoint, idx) => {
          const scaledTarget = scalePoint(targetPoint);
          const dist = distance(scaledTarget, userPoint);

          if (dist < COVERAGE_RADIUS) {
            const key = `${strokeIndex}-${idx}`;
            next.add(key);
          }
        });
      });

      // Calculate progress from the fresh 'next' set
      const totalPoints = letter.strokes.reduce((sum, stroke) => sum + stroke.points.length, 0);
      const calculatedProgress = next.size / totalPoints;
      setProgress(calculatedProgress);

      // Check per-stroke coverage
      const perStrokeProgress = letter.strokes.map((stroke, strokeIndex) => {
        const strokePoints = stroke.points.length;
        const strokeCovered = Array.from(next).filter(
          key => key.startsWith(`${strokeIndex}-`)
        ).length;
        return strokeCovered / strokePoints;
      });

      const allStrokesMeetThreshold = perStrokeProgress.every(p => p >= PER_STROKE_THRESHOLD);

      // Check if letter is complete (whole letter requirement)
      const shouldAutoComplete = checkAutoComplete(calculatedProgress);
      const wholeLetterComplete = calculatedProgress >= WHOLE_LETTER_THRESHOLD && allStrokesMeetThreshold;

      if ((wholeLetterComplete || shouldAutoComplete) && !isCompleted) {
        setIsCompleted(true);
        setTimeout(() => {
          onLetterComplete();
        }, 300);
      } else {
        // Still advance visual hint stroke
        const activeStroke = letter.strokes[activeStrokeIndex];
        if (activeStroke) {
          const activeStrokePoints = activeStroke.points.length;
          const activeStrokeCovered = Array.from(next).filter(
            key => key.startsWith(`${activeStrokeIndex}-`)
          ).length;
          const strokeProgress = activeStrokeCovered / activeStrokePoints;

          if (strokeProgress >= STROKE_ADVANCE_THRESHOLD && activeStrokeIndex < letter.strokes.length - 1) {
            // Advance to next stroke hint
            setActiveStrokeIndex(activeStrokeIndex + 1);
          }
        }
      }

      return next;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt) => {
        onTraceStart?.();
        // Day 1 Easy Mode: Start tracking time on first draw
        if (firstDrawTime === null) {
          setFirstDrawTime(Date.now());
        }
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

            // Day 1 Easy Mode: Track drawn distance
            const segmentDistance = distance(lastPoint, point);
            setTotalDrawnDistance(d => d + segmentDistance);

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

          // Show error feedback if user drew but didn't complete the letter
          if (!isCompleted && totalDrawnDistance > 200) {
            setShowError(true);
            if (errorTimeoutRef.current) {
              clearTimeout(errorTimeoutRef.current);
            }
            errorTimeoutRef.current = setTimeout(() => {
              setShowError(false);
            }, ERROR_DISPLAY_TIME);
          }
        }
      },
      onPanResponderTerminate: () => {
        onTraceEnd?.();
        if (currentStroke.length > 0) {
          setUserStrokes((prev) => [...prev, currentStroke]);
          setCurrentStroke([]);

          // Show error feedback if user drew but didn't complete the letter
          if (!isCompleted && totalDrawnDistance > 200) {
            setShowError(true);
            if (errorTimeoutRef.current) {
              clearTimeout(errorTimeoutRef.current);
            }
            errorTimeoutRef.current = setTimeout(() => {
              setShowError(false);
            }, ERROR_DISPLAY_TIME);
          }
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

  // Reset state when letter changes
  useEffect(() => {
    // Cancel any pending RAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // Cancel any pending error timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }

    // Reset all state to initial values
    setUserStrokes([]);
    setCurrentStroke([]);
    setActiveStrokeIndex(0);
    setCoveredPoints(new Set());
    setIsCompleted(false);
    setProgress(0);
    setTotalDrawnDistance(0);
    setFirstDrawTime(null);
    setShowError(false);
  }, [letter]);

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
    <View style={[styles.container, showError && styles.containerError]} {...panResponder.panHandlers}>
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
  containerError: {
    borderWidth: 4,
    borderColor: '#FF5722',
  },
  svg: {
    backgroundColor: '#FFF',
  },
});
