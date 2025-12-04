/**
 * Typing Animation Component
 *
 * ChatGPT-style character-by-character text reveal with blinking cursor.
 * Supports localStorage persistence to skip animation on revisit.
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { DEFAULT_TYPING_CONFIG } from '@/types/onboarding-scraper';

interface TypingAnimationProps {
  text: string;
  onComplete?: () => void;
  skipAnimation?: boolean;
  className?: string;
}

export function TypingAnimation({
  text,
  onComplete,
  skipAnimation = false,
  className = '',
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const cursorTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // If animation should be skipped, show complete text immediately
    if (skipAnimation) {
      setDisplayedText(text);
      setIsComplete(true);
      setShowCursor(false);
      onComplete?.();
      return;
    }

    // Start typing animation
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);
    setShowCursor(true);

    const typeNextCharacter = () => {
      if (indexRef.current < text.length) {
        const currentChar = text[indexRef.current];
        setDisplayedText(text.substring(0, indexRef.current + 1));

        // Determine delay for next character
        let delay = DEFAULT_TYPING_CONFIG.charDelay;

        // Longer pause after punctuation
        if (['.', ',', '!', '?', ';', ':'].includes(currentChar)) {
          delay = DEFAULT_TYPING_CONFIG.punctuationDelay;
        }

        indexRef.current++;
        timerRef.current = setTimeout(typeNextCharacter, delay);
      } else {
        // Animation complete
        setIsComplete(true);

        // Keep cursor blinking for 1 second
        setTimeout(() => {
          setShowCursor(false);
          onComplete?.();
        }, 1000);
      }
    };

    // Start typing after fade-in
    timerRef.current = setTimeout(
      typeNextCharacter,
      DEFAULT_TYPING_CONFIG.fadeInDuration
    );

    // Cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
    };
  }, [text, skipAnimation, onComplete]);

  // Cursor blink effect
  useEffect(() => {
    if (!showCursor || isComplete) return;

    cursorTimerRef.current = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, DEFAULT_TYPING_CONFIG.cursorBlinkRate);

    return () => {
      if (cursorTimerRef.current) clearInterval(cursorTimerRef.current);
    };
  }, [showCursor, isComplete]);

  return (
    <div className={`typing-animation ${className}`}>
      <span className="text-lg leading-relaxed text-gray-700">
        {displayedText}
        {!isComplete && (
          <span
            className={`ml-1 inline-block h-5 w-0.5 bg-indigo-600 align-middle transition-opacity duration-100 ${
              showCursor ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ animation: 'none' }}
          />
        )}
      </span>
    </div>
  );
}

/**
 * Hook to manage typing animation state with localStorage persistence
 */
export function useTypingAnimationState(workflowId: string) {
  const storageKey = `flowtrack-enrichment-${workflowId}`;

  const [hasCompletedAnimation, setHasCompletedAnimation] = useState(() => {
    if (typeof window === 'undefined') return false;

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const data = JSON.parse(cached);
        return data.hasCompletedAnimation === true;
      }
    } catch (error) {
      console.error('Error reading animation state from localStorage:', error);
    }

    return false;
  });

  const markAnimationComplete = () => {
    setHasCompletedAnimation(true);

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          hasCompletedAnimation: true,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error('Error saving animation state to localStorage:', error);
    }
  };

  const resetAnimation = () => {
    setHasCompletedAnimation(false);

    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error removing animation state from localStorage:', error);
    }
  };

  return {
    hasCompletedAnimation,
    markAnimationComplete,
    resetAnimation,
  };
}
