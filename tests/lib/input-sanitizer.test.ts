/**
 * Input Sanitizer Tests
 * Tests for XSS protection and input sanitization
 */

import { InputSanitizer, SANITIZATION_PRESETS, sanitizer } from '@/lib/input-sanitizer';

describe('Input Sanitizer', () => {
  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = InputSanitizer.getInstance();
      const instance2 = InputSanitizer.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should provide a default export', () => {
      expect(sanitizer).toBeInstanceOf(InputSanitizer);
    });
  });

  describe('Basic Text Sanitization', () => {
    it('should remove HTML tags from plain text', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const result = sanitizer.sanitizeText(input);
      expect(result).toBe('Hello  World');
      expect(result).not.toContain('<script>');
    });

    it('should escape dangerous characters', () => {
      const input = 'Hello <>"&\' World';
      const result = sanitizer.sanitizeText(input);
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).toContain('&quot;');
      expect(result).toContain('&#x27;');
      expect(result).toContain('&amp;');
    });

    it('should respect length limits', () => {
      const input = 'a'.repeat(100);
      const result = sanitizer.sanitizeText(input, 50);
      expect(result.length).toBe(50);
    });

    it('should handle empty or null input', () => {
      expect(sanitizer.sanitizeText('')).toBe('');
      expect(sanitizer.sanitizeText(null as any)).toBe('');
      expect(sanitizer.sanitizeText(undefined as any)).toBe('');
    });
  });

  describe('HTML Sanitization', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>World</strong></p>';
      const result = sanitizer.sanitizeHTML(input, SANITIZATION_PRESETS.userContent);
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
    });

    it('should remove dangerous script tags', () => {
      const input = '<p>Hello</p><script>alert("xss")</script>';
      const result = sanitizer.sanitizeHTML(input, SANITIZATION_PRESETS.userContent);
      expect(result).toContain('<p>Hello</p>');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove dangerous event handlers', () => {
      const input = '<div onclick="alert(1)">Click me</div>';
      const result = sanitizer.sanitizeHTML(input, SANITIZATION_PRESETS.userContent);
      expect(result).not.toContain('onclick');
      expect(result).not.toContain('alert');
    });

    it('should remove javascript: protocols', () => {
      const input = '<a href="javascript:alert(1)">Link</a>';
      const result = sanitizer.sanitizeHTML(input, SANITIZATION_PRESETS.richContent);
      expect(result).not.toContain('javascript:');
    });

    it('should preserve allowed attributes', () => {
      const input = '<a href="https://example.com" title="Example">Link</a>';
      const result = sanitizer.sanitizeHTML(input, SANITIZATION_PRESETS.richContent);
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('title="Example"');
    });
  });

  describe('Email Sanitization', () => {
    it('should normalize valid email addresses', () => {
      const input = '  ADMIN@EXAMPLE.COM  ';
      const result = sanitizer.sanitizeEmail(input);
      expect(result).toBe('admin@example.com');
    });

    it('should throw error for invalid email', () => {
      expect(() => sanitizer.sanitizeEmail('invalid-email')).toThrow('Invalid email format');
      expect(() => sanitizer.sanitizeEmail('test@')).toThrow('Invalid email format');
      expect(() => sanitizer.sanitizeEmail('@example.com')).toThrow('Invalid email format');
    });

    it('should handle empty input', () => {
      expect(sanitizer.sanitizeEmail('')).toBe('');
      expect(sanitizer.sanitizeEmail(null as any)).toBe('');
    });
  });

  describe('URL Sanitization', () => {
    it('should validate and return valid URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://subdomain.example.com/path?query=1',
        'https://example.com:8080/secure/path'
      ];

      validUrls.forEach(url => {
        const result = sanitizer.sanitizeURL(url);
        expect(result).toBe(url);
      });
    });

    it('should reject dangerous protocols', () => {
      const dangerousUrls = [
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'vbscript:msgbox(1)',
        'file:///etc/passwd'
      ];

      dangerousUrls.forEach(url => {
        expect(() => sanitizer.sanitizeURL(url)).toThrow();
      });
    });

    it('should reject invalid URL formats', () => {
      const invalidUrls = [
        'not-a-url',
        'http://',
        'https://',
        'ftp://example.com' // Not in allowed protocols by default
      ];

      invalidUrls.forEach(url => {
        expect(() => sanitizer.sanitizeURL(url)).toThrow('Invalid URL format');
      });
    });
  });

  describe('Filename Sanitization', () => {
    it('should remove path traversal attempts', () => {
      const input = '../../../etc/passwd';
      const result = sanitizer.sanitizeFilename(input);
      expect(result).not.toContain('../');
      expect(result).not.toContain('/');
      expect(result).not.toContain('\\');
    });

    it('should remove dangerous characters', () => {
      const input = 'file<>:"|?*.txt';
      const result = sanitizer.sanitizeFilename(input);
      expect(result).toBe('file.txt');
    });

    it('should handle filenames starting with dots or dashes', () => {
      expect(sanitizer.sanitizeFilename('.htaccess')).toBe('file_.htaccess');
      expect(sanitizer.sanitizeFilename('-config')).toBe('file_-config');
    });

    it('should respect length limits', () => {
      const longFilename = 'a'.repeat(300) + '.txt';
      const result = sanitizer.sanitizeFilename(longFilename);
      expect(result.length).toBeLessThanOrEqual(255);
    });
  });

  describe('Specific Content Sanitization', () => {
    it('should sanitize teaching content with rich text support', () => {
      const input = `
        <h2>Teaching Title</h2>
        <p>This is a <strong>teaching</strong> with <em>emphasis</em>.</p>
        <script>alert("xss")</script>
        <ul>
          <li>Point 1</li>
          <li>Point 2</li>
        </ul>
      `;

      const result = sanitizer.sanitizeTeachingContent(input);

      expect(result).toContain('<h2>');
      expect(result).toContain('<strong>');
      expect(result).toContain('<em>');
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should sanitize user comments with basic formatting', () => {
      const input = `
        <p>This is a comment with <strong>bold</strong> text.</p>
        <script>alert("hack")</script>
        <iframe src="evil.com"></iframe>
      `;

      const result = sanitizer.sanitizeUserComment(input);

      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('<iframe>');
      expect(result).not.toContain('alert');
    });

    it('should sanitize search queries', () => {
      const input = '<script>alert("xss")</script>search term';
      const result = sanitizer.sanitizeSearchQuery(input);

      expect(result).toBe('search term');
      expect(result).not.toContain('<script>');
    });
  });

  describe('Data Object Sanitization', () => {
    it('should sanitize teaching data object', () => {
      const input = {
        title: '<script>alert("xss")</script>Teaching Title',
        content: '<p>Content</p><script>evil()</script>',
        excerpt: 'Brief <strong>description</strong>',
        author: 'Sant <script>hack()</script> Kabir',
        tags: ['<script>tag1</script>', 'tag2', '']
      };

      const result = sanitizer.sanitizeTeachingData(input);

      expect(result.title).toBe('Teaching Title');
      expect(result.content).toContain('<p>Content</p>');
      expect(result.content).not.toContain('<script>');
      expect(result.author).toBe('Sant  Kabir');
      expect(result.tags).toEqual(['tag1', 'tag2']);
    });

    it('should sanitize event data object', () => {
      const input = {
        title: 'Event <script>alert(1)</script> Title',
        description: '<p>Description</p><script>hack()</script>',
        location: 'Location <script>evil()</script>',
        virtualLink: 'https://example.com/meet'
      };

      const result = sanitizer.sanitizeEventData(input);

      expect(result.title).toBe('Event  Title');
      expect(result.description).toContain('<p>Description</p>');
      expect(result.description).not.toContain('<script>');
      expect(result.location).toBe('Location ');
      expect(result.virtualLink).toBe('https://example.com/meet');
    });

    it('should remove invalid virtual links', () => {
      const input = {
        title: 'Event Title',
        description: 'Description',
        location: 'Location',
        virtualLink: 'javascript:alert(1)'
      };

      const result = sanitizer.sanitizeEventData(input);
      expect(result.virtualLink).toBeUndefined();
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle nested XSS attempts', () => {
      const input = '<<script>script>alert("xss")<</script>/script>';
      const result = sanitizer.sanitizeText(input);
      expect(result).not.toContain('script');
      expect(result).not.toContain('alert');
    });

    it('should handle encoded malicious content', () => {
      const input = '&lt;script&gt;alert(1)&lt;/script&gt;';
      const result = sanitizer.sanitizeHTML(input, SANITIZATION_PRESETS.basicText);
      expect(result).not.toContain('script');
    });

    it('should handle mixed case XSS attempts', () => {
      const inputs = [
        '<ScRiPt>alert(1)</ScRiPt>',
        '<SCRIPT>alert(1)</SCRIPT>',
        '<script>ALERT(1)</script>'
      ];

      inputs.forEach(input => {
        const result = sanitizer.sanitizeHTML(input, SANITIZATION_PRESETS.basicText);
        expect(result.toLowerCase()).not.toContain('script');
        expect(result.toLowerCase()).not.toContain('alert');
      });
    });

    it('should handle extremely long inputs', () => {
      const longInput = '<script>'.repeat(1000) + 'alert(1)' + '</script>'.repeat(1000);
      const result = sanitizer.sanitizeHTML(longInput, SANITIZATION_PRESETS.basicText);

      expect(result).not.toContain('script');
      expect(result).not.toContain('alert');
    });

    it('should preserve legitimate content while removing threats', () => {
      const input = `
        <h1>Legitimate Title</h1>
        <p>This is <strong>important</strong> content.</p>
        <script>alert("This should be removed")</script>
        <p>This paragraph should remain.</p>
      `;

      const result = sanitizer.sanitizeHTML(input, SANITIZATION_PRESETS.richContent);

      expect(result).toContain('<h1>Legitimate Title</h1>');
      expect(result).toContain('<strong>important</strong>');
      expect(result).toContain('This paragraph should remain.');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });
  });
});