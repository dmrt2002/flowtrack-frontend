import { useEffect } from 'react';

/**
 * Hook to automatically resize iframe based on content height
 * Sends postMessage to parent window when height changes
 */
export function useFormResize() {
  useEffect(() => {
    // Only run in browser and when embedded in iframe
    if (typeof window === 'undefined') return;

    const sendHeight = () => {
      const height = document.body.scrollHeight;

      // Send message to parent window
      window.parent.postMessage(
        {
          type: 'flowtrack:resize',
          height,
        },
        '*' // Allow any origin (forms can be embedded anywhere)
      );
    };

    // Send initial height after a brief delay to ensure content is rendered
    const initialTimer = setTimeout(sendHeight, 100);

    // Send height when window resizes
    window.addEventListener('resize', sendHeight);

    // Use ResizeObserver to detect content changes
    let observer: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        // Debounce resize events
        requestAnimationFrame(() => {
          sendHeight();
        });
      });

      observer.observe(document.body);
    }

    // Also send on DOM mutations (fallback for older browsers)
    const mutationObserver = new MutationObserver(() => {
      // Debounce mutations
      clearTimeout(initialTimer);
      setTimeout(sendHeight, 50);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    // Cleanup
    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener('resize', sendHeight);
      if (observer) {
        observer.disconnect();
      }
      mutationObserver.disconnect();
    };
  }, []);
}
