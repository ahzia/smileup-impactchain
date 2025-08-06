import { NextResponse } from 'next/server';

// ========================================
// ERROR TYPES
// ========================================

export enum ErrorCode {
  // Authentication Errors
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',

  // Database Errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',

  // Business Logic Errors
  INSUFFICIENT_SMILES = 'INSUFFICIENT_SMILES',
  MISSION_ALREADY_COMPLETED = 'MISSION_ALREADY_COMPLETED',
  COMMUNITY_FULL = 'COMMUNITY_FULL',
  REWARD_OUT_OF_STOCK = 'REWARD_OUT_OF_STOCK',

  // System Errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: any;
  statusCode: number;
  timestamp: string;
  requestId?: string;
}

// ========================================
// ERROR HANDLER CLASS
// ========================================

export class ErrorHandler {
  // ========================================
  // ERROR CREATION
  // ========================================

  static createError(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: any
  ): AppError {
    return {
      code,
      message,
      details,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  // ========================================
  // SPECIFIC ERROR CREATORS
  // ========================================

  static authenticationRequired(): AppError {
    return this.createError(
      ErrorCode.AUTH_REQUIRED,
      'Authentication required',
      401
    );
  }

  static invalidCredentials(): AppError {
    return this.createError(
      ErrorCode.INVALID_CREDENTIALS,
      'Invalid email or password',
      401
    );
  }

  static tokenExpired(): AppError {
    return this.createError(
      ErrorCode.TOKEN_EXPIRED,
      'Access token has expired',
      401
    );
  }

  static invalidToken(): AppError {
    return this.createError(
      ErrorCode.INVALID_TOKEN,
      'Invalid or malformed token',
      401
    );
  }

  static insufficientPermissions(): AppError {
    return this.createError(
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      'Insufficient permissions for this action',
      403
    );
  }

  static validationError(message: string, details?: any): AppError {
    return this.createError(
      ErrorCode.VALIDATION_ERROR,
      message,
      400,
      details
    );
  }

  static missingRequiredField(field: string): AppError {
    return this.createError(
      ErrorCode.MISSING_REQUIRED_FIELD,
      `Required field '${field}' is missing`,
      400,
      { field }
    );
  }

  static invalidFormat(field: string, expectedFormat: string): AppError {
    return this.createError(
      ErrorCode.INVALID_FORMAT,
      `Invalid format for field '${field}'`,
      400,
      { field, expectedFormat }
    );
  }

  static recordNotFound(resource: string, id?: string): AppError {
    return this.createError(
      ErrorCode.RECORD_NOT_FOUND,
      `${resource} not found`,
      404,
      { resource, id }
    );
  }

  static duplicateRecord(resource: string, field: string): AppError {
    return this.createError(
      ErrorCode.DUPLICATE_RECORD,
      `${resource} with this ${field} already exists`,
      409,
      { resource, field }
    );
  }

  static insufficientSmiles(required: number, available: number): AppError {
    return this.createError(
      ErrorCode.INSUFFICIENT_SMILES,
      'Insufficient smiles for this action',
      400,
      { required, available }
    );
  }

  static missionAlreadyCompleted(missionId: string): AppError {
    return this.createError(
      ErrorCode.MISSION_ALREADY_COMPLETED,
      'Mission has already been completed',
      409,
      { missionId }
    );
  }

  static communityFull(communityId: string): AppError {
    return this.createError(
      ErrorCode.COMMUNITY_FULL,
      'Community has reached maximum capacity',
      409,
      { communityId }
    );
  }

  static rewardOutOfStock(rewardId: string): AppError {
    return this.createError(
      ErrorCode.REWARD_OUT_OF_STOCK,
      'Reward is out of stock',
      409,
      { rewardId }
    );
  }

  static databaseError(operation: string, details?: any): AppError {
    return this.createError(
      ErrorCode.DATABASE_ERROR,
      `Database operation failed: ${operation}`,
      500,
      { operation, details }
    );
  }

  static internalServerError(message: string = 'Internal server error'): AppError {
    return this.createError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      message,
      500
    );
  }

  // ========================================
  // ERROR LOGGING
  // ========================================

  static logError(error: AppError, context?: any): void {
    const logEntry = {
      ...error,
      context,
      timestamp: new Date().toISOString(),
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Application Error:', logEntry);
    } else {
      // In production, you would send to a logging service
      console.error('🚨 Application Error:', logEntry);
      // TODO: Send to logging service (e.g., Sentry, LogRocket)
    }
  }

  static logDatabaseError(operation: string, error: any): void {
    const dbError = this.databaseError(operation, {
      message: error.message,
      code: error.code,
      constraint: error.constraint,
    });

    this.logError(dbError, { operation, originalError: error });
  }

  static logValidationError(field: string, value: any, rule: string): void {
    const validationError = this.validationError(
      `Validation failed for field '${field}'`,
      { field, value, rule }
    );

    this.logError(validationError);
  }

  // ========================================
  // ERROR RESPONSE CREATION
  // ========================================

  static createErrorResponse(error: AppError): NextResponse {
    const response = {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details,
      timestamp: error.timestamp,
    };

    return NextResponse.json(response, { status: error.statusCode });
  }

  // ========================================
  // ERROR HANDLING MIDDLEWARE
  // ========================================

  static async handleAsyncError(
    operation: () => Promise<any>,
    context?: string
  ): Promise<any> {
    try {
      return await operation();
    } catch (error) {
      const appError = this.convertToAppError(error, context);
      this.logError(appError, { context });
      throw appError;
    }
  }

  static convertToAppError(error: any, context?: string): AppError {
    // If it's already an AppError, return it
    if (error.code && error.statusCode) {
      return error as AppError;
    }

    // Convert common database errors
    if (error.code === 'P2002') {
      return this.duplicateRecord('Record', 'unique field');
    }

    if (error.code === 'P2025') {
      return this.recordNotFound('Record');
    }

    // Convert validation errors
    if (error.name === 'ValidationError') {
      return this.validationError(error.message, error.details);
    }

    // Convert authentication errors
    if (error.message?.includes('Invalid credentials')) {
      return this.invalidCredentials();
    }

    if (error.message?.includes('Authentication required')) {
      return this.authenticationRequired();
    }

    // Default to internal server error
    return this.internalServerError(
      context ? `${context}: ${error.message}` : error.message
    );
  }

  // ========================================
  // VALIDATION HELPERS
  // ========================================

  static validateRequired(data: any, fields: string[]): void {
    for (const field of fields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        throw this.missingRequiredField(field);
      }
    }
  }

  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw this.invalidFormat('email', 'valid email address');
    }
  }

  static validatePassword(password: string): void {
    if (password.length < 6) {
      throw this.validationError('Password must be at least 6 characters long');
    }
  }

  static validatePositiveNumber(value: number, field: string): void {
    if (typeof value !== 'number' || value < 0) {
      throw this.validationError(`${field} must be a positive number`);
    }
  }
} 