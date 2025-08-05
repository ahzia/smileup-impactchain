import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../services/userService';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
}

export class AuthMiddleware {
  // ========================================
  // TOKEN VERIFICATION
  // ========================================

  static async verifyToken(request: NextRequest): Promise<AuthenticatedRequest | null> {
    try {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
      }

      const token = authHeader.substring(7);
      
      // Simple token validation for development
      if (!token.startsWith('jwt_')) {
        return null;
      }

      // Extract user ID from token (format: jwt_userId_timestamp)
      const parts = token.split('_');
      if (parts.length < 2) {
        return null;
      }

      const userId = parts[1];
      const user = await UserService.findUserById(userId);
      
      if (!user) {
        return null;
      }

      // Add user to request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'user',
      };

      return authenticatedRequest;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  // ========================================
  // MIDDLEWARE FUNCTIONS
  // ========================================

  static async requireAuth(request: NextRequest): Promise<NextResponse | AuthenticatedRequest> {
    const authenticatedRequest = await this.verifyToken(request);
    
    if (!authenticatedRequest) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }

    return authenticatedRequest;
  }

  static async optionalAuth(request: NextRequest): Promise<AuthenticatedRequest> {
    const authenticatedRequest = await this.verifyToken(request);
    
    if (!authenticatedRequest) {
      return request as AuthenticatedRequest;
    }

    return authenticatedRequest;
  }

  // ========================================
  // ROLE-BASED AUTHORIZATION
  // ========================================

  static async requireRole(request: NextRequest, requiredRole: string): Promise<NextResponse | AuthenticatedRequest> {
    const authenticatedRequest = await this.requireAuth(request);
    
    if (authenticatedRequest instanceof NextResponse) {
      return authenticatedRequest;
    }

    if (authenticatedRequest.user?.role !== requiredRole) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Role '${requiredRole}' required`,
          code: 'INSUFFICIENT_PERMISSIONS'
        },
        { status: 403 }
      );
    }

    return authenticatedRequest;
  }

  static async requireAdmin(request: NextRequest): Promise<NextResponse | AuthenticatedRequest> {
    return this.requireRole(request, 'admin');
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  static getCurrentUser(request: AuthenticatedRequest) {
    return request.user;
  }

  static getCurrentUserId(request: AuthenticatedRequest): string | null {
    return request.user?.id || null;
  }

  static isAuthenticated(request: AuthenticatedRequest): boolean {
    return !!request.user;
  }
} 