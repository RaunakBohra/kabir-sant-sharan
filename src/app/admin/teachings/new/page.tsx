'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { toast } from '@/components/ui/toast';

interface TeachingFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  author: string;
  language: string;
  coverImage: string;
  featured: boolean;
  published: boolean;
}

const CATEGORIES = [
  'Spiritual Wisdom',
  'Philosophy',
  'Unity',
  'Devotion',
  'Meditation',
  'Truth',
  'Love',
  'Enlightenment'
];

const AUTOSAVE_KEY = 'teaching_draft_autosave';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export default function NewTeachingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TeachingFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    author: 'Sant Kabir Das',
    language: 'en',
    coverImage: '',
    featured: false,
    published: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (confirm('Found an auto-saved draft. Do you want to restore it?')) {
          setFormData(parsed.data);
          setLastSaved(new Date(parsed.timestamp));
          toast.success('Draft restored');
        } else {
          localStorage.removeItem(AUTOSAVE_KEY);
        }
      } catch (e) {
        console.error('Failed to parse saved draft:', e);
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
          data: formData,
          timestamp: new Date().toISOString()
        }));
        setLastSaved(new Date());
        toast.success('Draft auto-saved', { duration: 2000 });
      } catch (e) {
        console.error('Failed to auto-save:', e);
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearTimeout(timer);
  }, [formData, hasUnsavedChanges]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  const handleChange = (field: keyof TeachingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return false;
    }
    if (!formData.excerpt.trim()) {
      toast.error('Excerpt is required');
      return false;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (publish: boolean) => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/teachings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          published: publish,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).join(',') : null
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create teaching');
      }

      const data = await response.json();

      // Clear autosave
      localStorage.removeItem(AUTOSAVE_KEY);
      setHasUnsavedChanges(false);

      toast.success(publish ? 'Teaching published successfully' : 'Teaching saved as draft');
      router.push('/admin?tab=content');

    } catch (error: any) {
      console.error('Failed to save teaching:', error);
      toast.error(error.message || 'Failed to save teaching');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    router.push('/admin?tab=content');
  };

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-dark-900">Create New Teaching</h1>
            {lastSaved && (
              <p className="text-sm text-dark-500 mt-1">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-dark-700 bg-white border border-cream-300 rounded-lg hover:bg-cream-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSaving}
              className="px-4 py-2 text-dark-700 bg-cream-200 rounded-lg hover:bg-cream-300 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={isSaving}
              className="px-6 py-2 text-white bg-dark-900 rounded-lg hover:bg-dark-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg border border-cream-200 p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-dark-900 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter teaching title..."
              className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-dark-900 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(value) => handleChange('content', value)}
              placeholder="Write the teaching content here..."
              minHeight={400}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-dark-900 mb-2">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Brief summary of the teaching..."
              rows={3}
              className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <p className="text-xs text-dark-500 mt-1">
              {formData.excerpt.length}/200 characters
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-dark-900 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select category...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-dark-900 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-dark-900 mb-2">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ne">Nepali</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-dark-900 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="comma, separated, tags"
                className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-dark-900 mb-2">
              Cover Image URL
            </label>
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) => handleChange('coverImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="w-4 h-4 text-teal-600 border-cream-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-dark-900">Featured teaching</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}