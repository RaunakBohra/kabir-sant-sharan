'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { Label } from '@/components/ui/label';

interface AddSubscriberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddSubscriberDialog({ open, onOpenChange, onSuccess }: AddSubscriberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    preferences: {
      teachings: true,
      events: true,
      meditation: true
    }
  });
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (field: string, value: string | boolean) => {
    if (field.startsWith('preferences.')) {
      const prefKey = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { email?: string; name?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          name: formData.name.trim() || undefined,
          preferences: formData.preferences
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add subscriber');
      }

      toast.success('Subscriber added successfully');
      onSuccess();
      onOpenChange(false);

      // Reset form
      setFormData({
        email: '',
        name: '',
        preferences: {
          teachings: true,
          events: true,
          meditation: true
        }
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to add subscriber:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add subscriber');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-dark-900">
            Add New Subscriber
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-dark-900 font-medium">
              Email Address *
            </Label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.email ? 'border-red-500' : 'border-cream-300'
              }`}
              placeholder="devotee@example.com"
              required
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-dark-900 font-medium">
              Name (Optional)
            </Label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Devotee Name"
            />
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <Label className="text-dark-900 font-medium">
              Email Preferences
            </Label>
            <div className="space-y-2 bg-cream-50 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferences.teachings}
                  onChange={(e) => handleChange('preferences.teachings', e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-cream-300 rounded focus:ring-teal-500"
                />
                <div>
                  <span className="text-sm font-medium text-dark-900">Weekly Teachings</span>
                  <p className="text-xs text-dark-500">Kabir's verses and spiritual wisdom</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferences.events}
                  onChange={(e) => handleChange('preferences.events', e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-cream-300 rounded focus:ring-teal-500"
                />
                <div>
                  <span className="text-sm font-medium text-dark-900">Event Announcements</span>
                  <p className="text-xs text-dark-500">Satsang, meditation sessions, and gatherings</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferences.meditation}
                  onChange={(e) => handleChange('preferences.meditation', e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-cream-300 rounded focus:ring-teal-500"
                />
                <div>
                  <span className="text-sm font-medium text-dark-900">Meditation Reminders</span>
                  <p className="text-xs text-dark-500">Daily practice reminders and guidance</p>
                </div>
              </label>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-dark-700 bg-cream-200 rounded-lg hover:bg-cream-300 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>Add Subscriber</span>
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}