import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

interface MenuButtonProps {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}

const MenuButton = ({ onClick, active, children }: MenuButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-100 ${
      active ? 'bg-gray-100 text-primary' : 'text-gray-700'
    }`}
  >
    {children}
  </button>
);

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="border-b p-2 flex gap-1 flex-wrap bg-white">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold size={18} />
        </MenuButton>
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic size={18} />
        </MenuButton>

        <div className="w-px bg-gray-200 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List size={18} />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered size={18} />
        </MenuButton>

        <div className="w-px bg-gray-200 mx-1" />

        <MenuButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={18} />
        </MenuButton>

        <MenuButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={18} />
        </MenuButton>
      </div>

      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[200px] focus:outline-none bg-white"
      />
    </div>
  );
}