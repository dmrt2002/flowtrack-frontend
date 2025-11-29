import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { RichTextToolbar } from './RichTextToolbar';

interface RichTextEditorProps {
  value?: string; // HTML string
  onChange?: (html: string, json: any) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  className = '',
  minHeight = '100px',
  maxHeight = '400px',
  disabled = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      onChange?.(html, json);
    },
  });

  // Update editor content when value changes externally
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Update editable state when disabled prop changes
  React.useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-300 ${className}`}
    >
      <RichTextToolbar editor={editor} disabled={disabled} />
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3"
        style={{
          minHeight,
          maxHeight,
          overflowY: 'auto',
        }}
      />
    </div>
  );
};
