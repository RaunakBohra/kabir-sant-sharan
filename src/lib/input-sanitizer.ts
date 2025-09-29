/**
 * Input Sanitization and XSS Protection
 * Comprehensive input sanitization for preventing XSS and injection attacks
 */

import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

/**
 * Configuration for different sanitization contexts
 */
export interface SanitizationConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowDataAttributes?: boolean;
  stripComments?: boolean;
  stripScripts?: boolean;
  maxLength?: number;
}

/**
 * Predefined sanitization presets for different use cases
 */
export const SANITIZATION_PRESETS = {
  // For user-generated text content (comments, descriptions)
  userContent: {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'blockquote'],
    allowedAttributes: {},
    stripComments: true,
    stripScripts: true,
    maxLength: 10000
  },

  // For rich text content (articles, teachings)
  richContent: {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li',
      'blockquote', 'a', 'img'
    ],
    allowedAttributes: {
      'a': ['href', 'title'],
      'img': ['src', 'alt', 'width', 'height']
    },
    stripComments: true,
    stripScripts: true,
    maxLength: 50000
  },

  // For basic text input (titles, names)
  basicText: {
    allowedTags: [],
    allowedAttributes: {},
    stripComments: true,
    stripScripts: true,
    maxLength: 255
  },

  // For search queries
  searchQuery: {
    allowedTags: [],
    allowedAttributes: {},
    stripComments: true,
    stripScripts: true,
    maxLength: 500
  }
} as const;

/**
 * Main input sanitizer class
 */
export class InputSanitizer {
  private static instance: InputSanitizer;

  private constructor() {
    // Configure DOMPurify for server-side use
    this.configureDOMPurify();
  }

  public static getInstance(): InputSanitizer {
    if (!InputSanitizer.instance) {
      InputSanitizer.instance = new InputSanitizer();
    }
    return InputSanitizer.instance;
  }

  private configureDOMPurify(): void {
    // Add custom hooks for additional security
    DOMPurify.addHook('beforeSanitizeElements', (node) => {
      // Remove any data attributes that might contain malicious code
      if (node.nodeType === 1) { // Element node
        const element = node as Element;
        const attributes = Array.from(element.attributes);

        attributes.forEach(attr => {
          if (attr.name.startsWith('on') ||
              attr.name.includes('script') ||
              attr.value.includes('javascript:') ||
              attr.value.includes('data:text/html')) {
            element.removeAttribute(attr.name);
          }
        });
      }
    });
  }

  /**
   * Sanitize HTML content with specified configuration
   */
  public sanitizeHTML(input: string, config: SanitizationConfig = SANITIZATION_PRESETS.basicText): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Apply length limit first
    let sanitized = config.maxLength ? input.slice(0, config.maxLength) : input;

    // Configure DOMPurify options
    const purifyConfig: any = {
      ALLOWED_TAGS: config.allowedTags || [],
      ALLOWED_ATTR: this.flattenAllowedAttributes(config.allowedAttributes || {}),
      ALLOW_DATA_ATTR: config.allowDataAttributes || false,
      KEEP_CONTENT: true,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM_IMPORT: false,
      SANITIZE_DOM: true,
      SAFE_FOR_TEMPLATES: true
    };

    // Add attribute-specific permissions
    if (config.allowedAttributes) {
      Object.entries(config.allowedAttributes).forEach(([tag, attrs]) => {
        attrs.forEach(attr => {
          DOMPurify.addHook('uponSanitizeAttribute', (node, hookevent) => {
            if (node.tagName?.toLowerCase() === tag.toLowerCase() &&
                hookevent.attrName === attr) {
              hookevent.keepAttr = true;
            }
          });
        });
      });
    }

    // Additional security measures
    if (config.stripScripts !== false) {
      purifyConfig.FORBID_TAGS = ['script', 'object', 'embed', 'applet', 'iframe'];
      purifyConfig.FORBID_ATTR = ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'];
    }

    // Sanitize with DOMPurify
    sanitized = DOMPurify.sanitize(sanitized, purifyConfig);

    // Additional manual cleaning for edge cases
    sanitized = this.additionalCleaning(sanitized);

    return sanitized.trim();
  }

  /**
   * Sanitize plain text input (removes all HTML)
   */
  public sanitizeText(input: string, maxLength?: number): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input;

    // First, use DOMPurify to remove dangerous content, then strip all HTML
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });

    // Remove any remaining HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    // Strip low ASCII characters
    sanitized = validator.stripLow(sanitized, true);

    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>'"&]/g, (match) => {
      const htmlEntities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return htmlEntities[match] || match;
    });

    // Apply length limit
    if (maxLength) {
      sanitized = sanitized.slice(0, maxLength);
    }

    return sanitized.trim();
  }

  /**
   * Sanitize email addresses
   */
  public sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      return '';
    }

    // Normalize and validate email
    const normalized = validator.normalizeEmail(email.trim().toLowerCase());

    if (!normalized || !validator.isEmail(normalized)) {
      throw new Error('Invalid email format');
    }

    return normalized;
  }

  /**
   * Sanitize URLs
   */
  public sanitizeURL(url: string, allowedProtocols: string[] = ['http', 'https']): string {
    if (!url || typeof url !== 'string') {
      return '';
    }

    const sanitized = url.trim();

    // Check if URL is valid
    if (!validator.isURL(sanitized, {
      protocols: allowedProtocols,
      require_protocol: true,
      allow_underscores: true
    })) {
      throw new Error('Invalid URL format');
    }

    // Additional checks for malicious protocols
    const lowerUrl = sanitized.toLowerCase();
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'ftp:'];

    if (dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
      throw new Error('Dangerous URL protocol detected');
    }

    return sanitized;
  }

  /**
   * Sanitize filename for upload
   */
  public sanitizeFilename(filename: string): string {
    if (!filename || typeof filename !== 'string') {
      return '';
    }

    // Remove path traversal attempts
    let sanitized = filename.replace(/[\/\\]/g, '');

    // Remove dangerous characters
    sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');

    // Limit length
    sanitized = sanitized.slice(0, 255);

    // Ensure filename doesn't start with dangerous prefixes
    if (sanitized.startsWith('.') || sanitized.startsWith('-')) {
      sanitized = 'file_' + sanitized;
    }

    return sanitized.trim();
  }

  /**
   * Flatten allowed attributes object into array for DOMPurify
   */
  private flattenAllowedAttributes(allowedAttributes: Record<string, string[]>): string[] {
    const flattened = new Set<string>();
    Object.values(allowedAttributes).forEach(attrs => {
      attrs.forEach(attr => flattened.add(attr));
    });
    return Array.from(flattened);
  }

  /**
   * Additional manual cleaning for edge cases
   */
  private additionalCleaning(input: string): string {
    let cleaned = input;

    // Remove any remaining JavaScript protocols
    cleaned = cleaned.replace(/javascript:/gi, '');
    cleaned = cleaned.replace(/vbscript:/gi, '');
    cleaned = cleaned.replace(/data:/gi, '');

    // Remove HTML comments
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

    // Remove CDATA sections
    cleaned = cleaned.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');

    // Remove any remaining event handlers
    cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^>]*/gi, '');

    // Remove style attributes that might contain expressions
    cleaned = cleaned.replace(/\s*style\s*=\s*[^>]*/gi, '');

    return cleaned;
  }

  /**
   * Sanitize teaching content specifically
   */
  public sanitizeTeachingContent(content: string): string {
    return this.sanitizeHTML(content, SANITIZATION_PRESETS.richContent);
  }

  /**
   * Sanitize user comment
   */
  public sanitizeUserComment(comment: string): string {
    return this.sanitizeHTML(comment, SANITIZATION_PRESETS.userContent);
  }

  /**
   * Sanitize search query
   */
  public sanitizeSearchQuery(query: string): string {
    return this.sanitizeText(query, SANITIZATION_PRESETS.searchQuery.maxLength);
  }

  /**
   * Validate and sanitize teaching data
   */
  public sanitizeTeachingData(data: any): any {
    return {
      ...data,
      title: this.sanitizeText(data.title, 255),
      content: this.sanitizeTeachingContent(data.content),
      excerpt: this.sanitizeText(data.excerpt, 500),
      author: this.sanitizeText(data.author, 100),
      tags: Array.isArray(data.tags)
        ? data.tags.map((tag: string) => this.sanitizeText(tag, 50)).filter(Boolean)
        : []
    };
  }

  /**
   * Validate and sanitize event data
   */
  public sanitizeEventData(data: any): any {
    const sanitized = {
      ...data,
      title: this.sanitizeText(data.title, 255),
      description: this.sanitizeHTML(data.description, SANITIZATION_PRESETS.userContent),
      location: this.sanitizeText(data.location, 255)
    };

    // Sanitize virtual link if present
    if (data.virtualLink) {
      try {
        sanitized.virtualLink = this.sanitizeURL(data.virtualLink);
      } catch (error) {
        delete sanitized.virtualLink;
      }
    }

    return sanitized;
  }
}

/**
 * Convenience function to get sanitizer instance
 */
export const sanitizer = InputSanitizer.getInstance();

/**
 * Express-style middleware for automatic input sanitization
 */
export function createSanitizationMiddleware(options: { deep?: boolean } = {}) {
  return function sanitizeInput(req: any, res: any, next: () => void) {
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return sanitizer.sanitizeText(obj);
      }

      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }

      if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = options.deep ? sanitizeObject(value) : value;
        }
        return sanitized;
      }

      return obj;
    };

    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    if (req.query) {
      req.query = sanitizeObject(req.query);
    }

    next();
  };
}

export default sanitizer;