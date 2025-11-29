import React from 'react';
import DOMPurify from 'dompurify';

interface RichTextViewerProps {
  html: string;
  className?: string;
}

/**
 * RichTextViewer - Display rich text HTML content safely
 * Sanitizes HTML before rendering to prevent XSS attacks
 */
export const RichTextViewer: React.FC<RichTextViewerProps> = ({
  html,
  className = '',
}) => {
  // Sanitize HTML to prevent XSS attacks
  const sanitizedHtml = React.useMemo(() => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'a',
        'code',
        'pre',
        'blockquote',
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
      ALLOW_DATA_ATTR: false,
    });
  }, [html]);

  if (!sanitizedHtml || sanitizedHtml === '<p></p>') {
    return null;
  }

  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{
        // Ensure h1 tags inside inherit parent styles
        // @ts-expect-error - CSS custom property
        '--tw-prose-headings': 'inherit',
      }}
    />
  );
};
