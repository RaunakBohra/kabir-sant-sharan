'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { FileUpload } from '@/components/ui/file-upload';
import { toast } from '@/components/ui/toast';

const teachingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string(),
  author: z.string().min(1, 'Author is required'),
  language: z.enum(['en', 'hi', 'ne']),
  published: z.boolean(),
  featured: z.boolean(),
  coverImage: z.string().optional()
});

type TeachingFormData = z.infer<typeof teachingSchema>;

interface CreateTeachingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CATEGORIES = [
  { value: 'philosophy', label: 'Philosophy' },
  { value: 'spirituality', label: 'Spirituality' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'unity', label: 'Unity' },
  { value: 'devotion', label: 'Devotion' },
  { value: 'wisdom', label: 'Wisdom' }
];

export function CreateTeachingDialog({ open, onOpenChange, onSuccess }: CreateTeachingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [autoSaveKey, setAutoSaveKey] = useState('teaching-draft');

  const form = useForm<TeachingFormData>({
    resolver: zodResolver(teachingSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      author: 'Sant Kabir Das',
      language: 'en',
      published: false,
      featured: false,
      coverImage: ''
    }
  });

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      const values = form.getValues();
      if (values.title || values.content) {
        localStorage.setItem(autoSaveKey, JSON.stringify(values));
        console.log('Auto-saved draft');
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [open, form, autoSaveKey]);

  // Load draft on mount
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem(autoSaveKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          form.reset(parsed);
          toast.info('Loaded saved draft');
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
      }
    }
  }, [open, form, autoSaveKey]);

  const onSubmit = async (data: TeachingFormData, saveAsDraft = false) => {
    setIsSubmitting(true);

    try {
      // Upload image if provided
      let imageUrl = data.coverImage;
      if (uploadedImage) {
        const formData = new FormData();
        formData.append('file', uploadedImage);
        formData.append('type', 'image');

        const uploadResponse = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // Create teaching
      const response = await fetch('/api/teachings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          coverImage: imageUrl,
          published: saveAsDraft ? false : data.published,
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          publishedAt: data.published && !saveAsDraft ? new Date().toISOString() : null
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create teaching');
      }

      // Clear auto-save draft
      localStorage.removeItem(autoSaveKey);

      toast.success(saveAsDraft ? 'Teaching saved as draft' : 'Teaching created successfully!');
      form.reset();
      setUploadedImage(null);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create teaching:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create teaching');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    const values = form.getValues();
    onSubmit(values, true);
  };

  const handleClose = () => {
    const values = form.getValues();
    if (values.title || values.content) {
      if (confirm('You have unsaved changes. Do you want to save a draft?')) {
        localStorage.setItem(autoSaveKey, JSON.stringify(values));
        toast.info('Draft saved locally');
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Teaching</DialogTitle>
          <DialogDescription>
            Share spiritual wisdom and teachings from Sant Kabir Das
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g., The Path of Divine Love"
                      className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Excerpt */}
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Brief summary of the teaching..."
                      className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent resize-none"
                    />
                  </FormControl>
                  <FormDescription>A short summary that appears in listings</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Write your teaching here... Use blockquotes for Kabir's verses."
                      minHeight={400}
                      maxHeight={800}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Two-column layout for Category and Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="love, devotion, spirituality"
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormDescription>Comma-separated tags</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ne">Nepali</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <FormLabel>Cover Image</FormLabel>
              <FileUpload
                onFilesAccepted={(files) => setUploadedImage(files[0])}
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                maxFiles={1}
                multiple={false}
                maxSize={5 * 1024 * 1024} // 5MB
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center space-x-6">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 text-dark-900 border-cream-300 rounded focus:ring-dark-400"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer">Publish immediately</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 text-dark-900 border-cream-300 rounded focus:ring-dark-400"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer">Mark as featured</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="px-4 py-2 text-dark-600 border border-cream-300 rounded-lg hover:bg-cream-50 transition-colors disabled:opacity-50"
              >
                Save as Draft
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-dark-600 border border-cream-300 rounded-lg hover:bg-cream-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-dark-900 text-white rounded-lg hover:bg-dark-800 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Teaching</span>
                  )}
                </button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}