'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-cream-300 bg-cream-100 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-2 rounded hover:bg-cream-200 transition-colors",
            editor.isActive('bold') && 'bg-dark-100 text-dark-900'
          )}
          title="Bold (Cmd+B)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h8m-8-6h8m-8 12h8"/>
          </svg>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-2 rounded hover:bg-cream-200 transition-colors",
            editor.isActive('italic') && 'bg-dark-100 text-dark-900'
          )}
          title="Italic (Cmd+I)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(
            "p-2 rounded hover:bg-cream-200 transition-colors",
            editor.isActive('strike') && 'bg-dark-100 text-dark-900'
          )}
          title="Strikethrough"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M9 5v14m6-14v14"/>
          </svg>
        </button>

        <div className="w-px h-6 bg-cream-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "px-3 py-2 rounded hover:bg-cream-200 transition-colors font-semibold",
            editor.isActive('heading', { level: 1 }) && 'bg-dark-100 text-dark-900'
          )}
          title="Heading 1"
        >
          H1
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "px-3 py-2 rounded hover:bg-cream-200 transition-colors font-semibold",
            editor.isActive('heading', { level: 2 }) && 'bg-dark-100 text-dark-900'
          )}
          title="Heading 2"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "px-3 py-2 rounded hover:bg-cream-200 transition-colors font-semibold",
            editor.isActive('heading', { level: 3 }) && 'bg-dark-100 text-dark-900'
          )}
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-cream-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-2 rounded hover:bg-cream-200 transition-colors",
            editor.isActive('bulletList') && 'bg-dark-100 text-dark-900'
          )}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-2 rounded hover:bg-cream-200 transition-colors",
            editor.isActive('orderedList') && 'bg-dark-100 text-dark-900'
          )}
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 12h18M3 20h18"/>
          </svg>
        </button>

        <div className="w-px h-6 bg-cream-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "p-2 rounded hover:bg-cream-200 transition-colors",
            editor.isActive('blockquote') && 'bg-dark-100 text-dark-900'
          )}
          title="Quote (for Kabir's verses)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
          </svg>
        </button>

        <div className="w-px h-6 bg-cream-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "p-2 rounded hover:bg-cream-200 transition-colors",
            editor.isActive('codeBlock') && 'bg-dark-100 text-dark-900'
          )}
          title="Code Block"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
        </button>

        <div className="w-px h-6 bg-cream-300 mx-1" />

        <button
          type="button"
          onClick={addLink}
          className={cn(
            "p-2 rounded hover:bg-cream-200 transition-colors",
            editor.isActive('link') && 'bg-dark-100 text-dark-900'
          )}
          title="Add Link"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-cream-200 transition-colors"
          title="Add Image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </button>

        <div className="w-px h-6 bg-cream-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-cream-200 transition-colors disabled:opacity-50"
          title="Undo (Cmd+Z)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
          </svg>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-cream-200 transition-colors disabled:opacity-50"
          title="Redo (Cmd+Shift+Z)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/>
          </svg>
        </button>
      </div>
  );
};

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Write your content here...',
  className,
  minHeight = 200,
  maxHeight = 600,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-teal-600 underline hover:text-teal-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none px-4 py-3 overflow-y-auto',
          className
        ),
        style: `min-height: ${minHeight}px; max-height: ${maxHeight}px;`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const charCount = editor?.storage.characterCount?.characters() || 0;
  const wordCount = editor?.getText().trim().split(/\s+/).filter(w => w.length > 0).length || 0;

  return (
    <div className="border border-cream-300 rounded-lg bg-white overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className="border-t border-cream-300 bg-cream-50 px-4 py-2 text-xs text-dark-500 flex justify-between">
        <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
        <span>{charCount} characters</span>
      </div>
    </div>
  );
}