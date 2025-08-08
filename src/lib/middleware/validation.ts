import { NextRequest, NextResponse } from 'next/server';
import { ErrorHandler } from '../utils/errorHandler';

// ========================================
// VALIDATION SCHEMAS
// ========================================

export interface ValidationSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any) => boolean;
    message?: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData: any;
}

export class ValidationMiddleware {
  // ========================================
  // SCHEMA VALIDATION
  // ========================================

  static validateSchema(data: any, schema: ValidationSchema): ValidationResult {
    const errors: string[] = [];
    const sanitizedData: any = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      // Check if required field is missing
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(rules.message || `Field '${field}' is required`);
        continue;
      }

      // Skip validation if field is not required and value is empty
      if (!rules.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Type validation
      if (!this.validateType(value, rules.type)) {
        errors.push(rules.message || `Field '${field}' must be of type ${rules.type}`);
        continue;
      }

      // Length validation for strings
      if (rules.type === 'string' && typeof value === 'string') {
        if (rules.min && value.length < rules.min) {
          errors.push(rules.message || `Field '${field}' must be at least ${rules.min} characters long`);
          continue;
        }
        if (rules.max && value.length > rules.max) {
          errors.push(rules.message || `Field '${field}' must be at most ${rules.max} characters long`);
          continue;
        }
      }

      // Number range validation
      if (rules.type === 'number' && typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(rules.message || `Field '${field}' must be at least ${rules.min}`);
          continue;
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push(rules.message || `Field '${field}' must be at most ${rules.max}`);
          continue;
        }
      }

      // Pattern validation for strings
      if (rules.type === 'string' && rules.pattern && typeof value === 'string') {
        if (!rules.pattern.test(value)) {
          errors.push(rules.message || `Field '${field}' has invalid format`);
          continue;
        }
      }

      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(rules.message || `Field '${field}' must be one of: ${rules.enum.join(', ')}`);
        continue;
      }

      // Custom validation
      if (rules.custom && !rules.custom(value)) {
        errors.push(rules.message || `Field '${field}' failed custom validation`);
        continue;
      }

      // Sanitize and add to result
      sanitizedData[field] = this.sanitizeValue(value, rules.type);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData,
    };
  }

  // ========================================
  // TYPE VALIDATION
  // ========================================

  private static validateType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      default:
        return true;
    }
  }

  // ========================================
  // VALUE SANITIZATION
  // ========================================

  private static sanitizeValue(value: any, type: string): any {
    switch (type) {
      case 'string':
        return typeof value === 'string' ? value.trim() : value;
      case 'number':
        return typeof value === 'number' ? value : parseFloat(value);
      case 'boolean':
        return Boolean(value);
      case 'array':
        return Array.isArray(value) ? value : [value];
      case 'object':
        return typeof value === 'object' && value !== null ? value : {};
      default:
        return value;
    }
  }

  // ========================================
  // COMMON VALIDATION SCHEMAS
  // ========================================

  static readonly USER_REGISTRATION_SCHEMA: ValidationSchema = {
    name: {
      type: 'string',
      required: true,
      min: 2,
      max: 50,
      message: 'Name must be between 2 and 50 characters long',
    },
    email: {
      type: 'string',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please provide a valid email address',
    },
    password: {
      type: 'string',
      required: true,
      min: 6,
      message: 'Password must be at least 6 characters long',
    },
    bio: {
      type: 'string',
      required: false,
      max: 500,
      message: 'Bio must be at most 500 characters long',
    },
    interests: {
      type: 'array',
      required: false,
    },
  };

  static readonly USER_LOGIN_SCHEMA: ValidationSchema = {
    email: {
      type: 'string',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please provide a valid email address',
    },
    password: {
      type: 'string',
      required: true,
      message: 'Password is required',
    },
  };

  static readonly COMMUNITY_CREATION_SCHEMA: ValidationSchema = {
    name: {
      type: 'string',
      required: true,
      min: 3,
      max: 100,
      message: 'Community name must be between 3 and 100 characters long',
    },
    description: {
      type: 'string',
      required: true,
      min: 10,
      max: 1000,
      message: 'Description must be between 10 and 1000 characters long',
    },
    category: {
      type: 'string',
      required: true,
      enum: ['sustainability', 'technology', 'healthcare', 'education', 'environment', 'community'],
      message: 'Please select a valid category',
    },
    logo: {
      type: 'string',
      required: false,
      pattern: /^https?:\/\/.+/,
      message: 'Logo must be a valid URL',
    },
    banner: {
      type: 'string',
      required: false,
      pattern: /^https?:\/\/.+/,
      message: 'Banner must be a valid URL',
    },
    location: {
      type: 'string',
      required: false,
      max: 100,
      message: 'Location must be at most 100 characters long',
    },
    website: {
      type: 'string',
      required: false,
      pattern: /^https?:\/\/.+/,
      message: 'Website must be a valid URL',
    },
  };

  static readonly MISSION_CREATION_SCHEMA: ValidationSchema = {
    title: {
      type: 'string',
      required: true,
      min: 5,
      max: 200,
      message: 'Mission title must be between 5 and 200 characters long',
    },
    description: {
      type: 'string',
      required: true,
      min: 10,
      max: 1000,
      message: 'Description must be between 10 and 1000 characters long',
    },
    reward: {
      type: 'number',
      required: true,
      min: 1,
      max: 10000,
      message: 'Reward must be between 1 and 10000 smiles',
    },
    proofRequired: {
      type: 'boolean',
      required: false,
    },
    deadline: {
      type: 'string',
      required: false,
      pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
      message: 'Deadline must be a valid ISO date string',
    },
    effortLevel: {
      type: 'string',
      required: true,
      enum: ['Low', 'Medium', 'High'],
      message: 'Effort level must be Low, Medium, or High',
    },
    requiredTime: {
      type: 'string',
      required: true,
      min: 3,
      max: 50,
      message: 'Required time must be between 3 and 50 characters long',
    },
    icon: {
      type: 'string',
      required: true,
      min: 1,
      max: 10,
      message: 'Icon must be between 1 and 10 characters long',
    },
    category: {
      type: 'string',
      required: true,
      enum: ['daily', 'weekly', 'monthly', 'special', 'community'],
      message: 'Please select a valid category',
    },
    communityId: {
      type: 'string',
      required: true,
      message: 'Community ID is required',
    },
  };

  static readonly REWARD_CREATION_SCHEMA: ValidationSchema = {
    title: {
      type: 'string',
      required: true,
      min: 3,
      max: 100,
      message: 'Reward title must be between 3 and 100 characters long',
    },
    description: {
      type: 'string',
      required: true,
      min: 10,
      max: 500,
      message: 'Description must be between 10 and 500 characters long',
    },
    type: {
      type: 'string',
      required: true,
      enum: ['experience', 'certificate', 'digital', 'event', 'voucher', 'award', 'discount', 'merchandise', 'service'],
      message: 'Please select a valid reward type',
    },
    cost: {
      type: 'number',
      required: true,
      min: 0,
      max: 10000,
      message: 'Cost must be between 0 and 10000 smiles',
    },
    validity: {
      type: 'string',
      required: true,
      min: 3,
      max: 100,
      message: 'Validity must be between 3 and 100 characters long',
    },
    emoji: {
      type: 'string',
      required: true,
      min: 1,
      max: 10,
      message: 'Emoji must be between 1 and 10 characters long',
    },
    imageUrl: {
      type: 'string',
      required: true,
      pattern: /^https?:\/\/.+/,
      message: 'Image URL must be a valid URL',
    },
    communityId: {
      type: 'string',
      required: true,
      message: 'Community ID is required',
    },
  };

  static readonly FEED_POST_CREATION_SCHEMA: ValidationSchema = {
    title: {
      type: 'string',
      required: true,
      min: 5,
      max: 200,
      message: 'Post title must be between 5 and 200 characters long',
    },
    description: {
      type: 'string',
      required: true,
      min: 10,
      max: 1000,
      message: 'Description must be between 10 and 1000 characters long',
    },
    mediaType: {
      type: 'string',
      required: true,
      enum: ['image', 'video', 'text'],
      message: 'Media type must be image, video, or text',
    },
    mediaUrl: {
      type: 'string',
      required: false,
      pattern: /^https?:\/\/.+/,
      message: 'Media URL must be a valid URL',
    },
    challenge: {
      type: 'string',
      required: false,
      max: 200,
      message: 'Challenge must be at most 200 characters long',
    },
    callToAction: {
      type: 'array',
      required: false,
    },
    links: {
      type: 'array',
      required: false,
    },
    communityId: {
      type: 'string',
      required: true,
      message: 'Community ID is required',
    },
  };

  // ========================================
  // MIDDLEWARE FUNCTIONS
  // ========================================

  static validateRequest(schema: ValidationSchema) {
    return async (request: NextRequest) => {
      try {
        const body = await request.json();
        const validation = this.validateSchema(body, schema);

        if (!validation.isValid) {
          const error = ErrorHandler.validationError(
            'Validation failed',
            { errors: validation.errors }
          );
          return ErrorHandler.createErrorResponse(error);
        }

        // Replace request body with sanitized data
        (request as any).body = validation.sanitizedData;
        return null; // Continue to next middleware
      } catch (error) {
        const appError = ErrorHandler.convertToAppError(error, 'Validation middleware');
        return ErrorHandler.createErrorResponse(appError);
      }
    };
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static sanitizeString(value: string): string {
    return value.trim().replace(/[<>]/g, '');
  }

  static sanitizeHtml(value: string): string {
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
} 