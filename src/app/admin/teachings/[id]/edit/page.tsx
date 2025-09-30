'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditTeachingPage() {
  const router = useRouter();
  const params = useParams();
  const teachingId = params.id as string;

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load teaching data
  useEffect(() => {
    const loadTeaching = async () => {
      try {
        const response = await fetch(`/api/teachings/${teachingId}`);
        if (!response.ok) throw new Error('Failed to load teaching');

        const data = await response.json() as { teaching: any };
        const teaching = data.teaching;

        setFormData({
          title: teaching.title,
          content: teaching.content,
          excerpt: teaching.excerpt,
          category: teaching.category,
          tags: teaching.tags || '',
          author: teaching.author,
          language: teaching.language,
          coverImage: teaching.coverImage || '',
          featured: teaching.featured,
          published: teaching.published
        });
      } catch (error) {
        console.error('Failed to load teaching:', error);
        toast.error('Failed to load teaching');
        router.push('/admin?tab=content');
      } finally {
        setIsLoading(false);
      }
    };

    loadTeaching();
  }, [teachingId, router]);

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

  const handleChange = (field: keyof TeachingFormData, value: string | boolean) => {
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/teachings/${teachingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).join(',') : null
        })
      });

      if (!response.ok) {
        const error = await response.json() as { error?: string };
        throw new Error(error.error || 'Failed to update teaching');
      }

      setHasUnsavedChanges(false);
      toast.success('Teaching updated successfully');
      router.push('/admin?tab=content');

    } catch (error: any) {
      console.error('Failed to update teaching:', error);
      toast.error(error.message || 'Failed to update teaching');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-dark-900">Edit Teaching</h1>
            <p className="text-sm text-dark-500 mt-1">
              {hasUnsavedChanges && 'Unsaved changes'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-dark-700 bg-white border border-cream-300 rounded-lg hover:bg-cream-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2 text-white bg-dark-900 rounded-lg hover:bg-dark-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
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

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => handleChange('published', e.target.checked)}
                className="w-4 h-4 text-teal-600 border-cream-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-dark-900">Published</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}