import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading1,
  Heading2,
} from 'lucide-react';

interface RichTextToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

export const RichTextToolbar: React.FC<RichTextToolbarProps> = ({
  editor,
  disabled = false,
}) => {
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    // Cancelled
    if (url === null) {
      return;
    }

    // Empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    icon: React.ReactNode;
    title: string;
  }> = ({ onClick, isActive, icon, title }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded p-2 transition-colors hover:bg-gray-100 ${
        isActive ? 'bg-gray-200 text-blue-600' : 'text-gray-700'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-300 bg-gray-50 p-2">
      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        icon={<Heading1 size={18} />}
        title="Heading 1"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={<Heading2 size={18} />}
        title="Heading 2"
      />

      <div className="mx-1 h-6 w-px bg-gray-300" />

      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<Bold size={18} />}
        title="Bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<Italic size={18} />}
        title="Italic"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={<UnderlineIcon size={18} />}
        title="Underline"
      />

      <div className="mx-1 h-6 w-px bg-gray-300" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={<List size={18} />}
        title="Bullet List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={<ListOrdered size={18} />}
        title="Numbered List"
      />

      <div className="mx-1 h-6 w-px bg-gray-300" />

      {/* Link */}
      <ToolbarButton
        onClick={setLink}
        isActive={editor.isActive('link')}
        icon={<LinkIcon size={18} />}
        title="Insert Link"
      />
    </div>
  );
};
