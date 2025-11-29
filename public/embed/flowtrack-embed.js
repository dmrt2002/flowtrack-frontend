/**
 * FlowTrack Form Embed Widget
 * Version: 1.0.0
 *
 * Usage:
 * 1. Add a div with data-flowtrack-form attribute:
 *    <div data-flowtrack-form="your-workspace-slug"></div>
 *
 * 2. Include this script:
 *    <script src="https://app.flowtrack.com/embed/flowtrack-embed.js" async></script>
 *
 * Features:
 * - Automatic iframe resizing based on content
 * - Visitor tracking (UTK cookie)
 * - Custom events for form submissions
 * - Mobile responsive
 */

(function () {
  'use strict';

  // Configuration
  var FLOWTRACK_BASE_URL =
    window.FLOWTRACK_BASE_URL || 'https://app.flowtrack.com';
  var API_BASE_URL = window.FLOWTRACK_API_URL || 'https://app.flowtrack.com';

  // Development mode detection
  // Use environment variables or data attributes for URLs
  const embedScript = document.currentScript;
  if (embedScript) {
    const dataBaseUrl = embedScript.getAttribute('data-base-url');
    const dataApiUrl = embedScript.getAttribute('data-api-url');
    if (dataBaseUrl) FLOWTRACK_BASE_URL = dataBaseUrl;
    if (dataApiUrl) API_BASE_URL = dataApiUrl;
  }

  console.log('[FlowTrack] Embed widget initializing...');

  // Find all FlowTrack form containers
  var containers = document.querySelectorAll('[data-flowtrack-form]');

  if (containers.length === 0) {
    console.warn(
      '[FlowTrack] No form containers found. Add data-flowtrack-form attribute to a div.'
    );
    return;
  }

  console.log('[FlowTrack] Found ' + containers.length + ' form container(s)');

  // Process each container
  containers.forEach(function (container, index) {
    var workspaceSlug = container.getAttribute('data-flowtrack-form');

    if (!workspaceSlug) {
      console.error(
        '[FlowTrack] data-flowtrack-form attribute is empty for container ' +
          index
      );
      return;
    }

    console.log('[FlowTrack] Embedding form for workspace: ' + workspaceSlug);

    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.src = FLOWTRACK_BASE_URL + '/p/' + workspaceSlug;
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'block';
    iframe.style.minHeight = '400px';
    iframe.style.transition = 'height 0.3s ease';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('title', 'FlowTrack Form - ' + workspaceSlug);
    iframe.setAttribute('loading', 'lazy');

    // Add ARIA attributes for accessibility
    iframe.setAttribute('role', 'region');
    iframe.setAttribute('aria-label', 'FlowTrack Contact Form');

    // Message handler for iframe communication
    var messageHandler = function (event) {
      // Security: Validate origin (optional - we allow all for flexibility)
      // Uncomment to restrict to FlowTrack origin only:
      // if (event.origin !== FLOWTRACK_BASE_URL) return;

      if (!event.data || typeof event.data !== 'object') return;

      // Handle resize messages
      if (event.data.type === 'flowtrack:resize') {
        var newHeight = event.data.height;
        if (typeof newHeight === 'number' && newHeight > 0) {
          iframe.style.height = newHeight + 'px';
          console.log('[FlowTrack] Resized iframe to ' + newHeight + 'px');
        }
      }

      // Handle form submission success
      if (event.data.type === 'flowtrack:submit:success') {
        console.log('[FlowTrack] Form submitted successfully:', event.data);

        // Dispatch custom event for parent page to listen to
        var customEvent = new CustomEvent('flowtrack:submit', {
          detail: {
            leadId: event.data.leadId,
            workspaceSlug: workspaceSlug,
            message: event.data.message,
          },
          bubbles: true,
        });
        window.dispatchEvent(customEvent);

        // Also dispatch on the container element
        container.dispatchEvent(customEvent);
      }
    };

    // Add message listener
    window.addEventListener('message', messageHandler);

    // Insert iframe into container
    container.appendChild(iframe);

    // Track form view
    trackFormView(workspaceSlug);

    console.log('[FlowTrack] Form embedded successfully for: ' + workspaceSlug);
  });

  /**
   * Track form view for analytics
   */
  function trackFormView(workspaceSlug) {
    var utk = getOrCreateUTK();

    fetch(API_BASE_URL + '/api/v1/forms/public/' + workspaceSlug + '/view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        utk: utk,
      }),
    })
      .then(function () {
        console.log('[FlowTrack] Form view tracked');
      })
      .catch(function (error) {
        console.debug('[FlowTrack] Failed to track form view:', error);
      });
  }

  /**
   * Get or create unique tracking key (UTK)
   */
  function getOrCreateUTK() {
    var cookieName = 'flowtrack_utk';
    var existingUTK = getCookie(cookieName);

    if (existingUTK) {
      return existingUTK;
    }

    // Generate new UTK
    var newUTK = 'utk_' + Math.random().toString(36).substr(2, 9) + Date.now();
    setCookie(cookieName, newUTK, 365);

    return newUTK;
  }

  /**
   * Get cookie value
   */
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  /**
   * Set cookie
   */
  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax';
  }

  // Expose global API for advanced usage
  window.FlowTrack = window.FlowTrack || {
    version: '1.0.0',
    baseUrl: FLOWTRACK_BASE_URL,
    getUTK: getOrCreateUTK,
  };

  console.log('[FlowTrack] Widget loaded successfully');
})();
