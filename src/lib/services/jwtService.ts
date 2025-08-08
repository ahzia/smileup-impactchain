import jwt from 'jsonwebtoken';
import { User } from '../../generated/prisma';

// JWT Configuration
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-secret-key-development';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-development';
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface DecodedToken {
  userId: string;
  email: string;
  role?: string;
  iat: number;
  exp: number;
}

export class JWTService {
  // ========================================
  // TOKEN GENERATION
  // ========================================

  static generateAccessToken(payload: TokenPayload): string {
    if (!JWT_ACCESS_SECRET) {
      throw new Error('JWT_ACCESS_SECRET is not configured');
    }
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
      issuer: 'smileup-impactchain',
      audience: 'smileup-users',
    } as any);
  }

  static generateRefreshToken(payload: TokenPayload): string {
    if (!JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'smileup-impactchain',
      audience: 'smileup-users',
    } as any);
  }

  static generateTokenPair(payload: TokenPayload): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    
    // Calculate expiration time in seconds
    const expiresIn = 15 * 60; // 15 minutes in seconds
    
    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  // ========================================
  // TOKEN VERIFICATION
  // ========================================

  static verifyAccessToken(token: string): DecodedToken {
    try {
      if (!JWT_ACCESS_SECRET) {
        throw new Error('JWT_ACCESS_SECRET is not configured');
      }
      return jwt.verify(token, JWT_ACCESS_SECRET, {
        issuer: 'smileup-impactchain',
        audience: 'smileup-users',
      } as any) as unknown as DecodedToken;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): DecodedToken {
    try {
      if (!JWT_REFRESH_SECRET) {
        throw new Error('JWT_REFRESH_SECRET is not configured');
      }
      return jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: 'smileup-impactchain',
        audience: 'smileup-users',
      } as any) as unknown as DecodedToken;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // ========================================
  // TOKEN REFRESH
  // ========================================

  static refreshAccessToken(refreshToken: string): TokenPair {
    const decoded = this.verifyRefreshToken(refreshToken);
    
    const payload: TokenPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    return this.generateTokenPair(payload);
  }

  // ========================================
  // TOKEN UTILITIES
  // ========================================

  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as DecodedToken;
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as DecodedToken;
      if (!decoded || !decoded.exp) return null;
      
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }

  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  // ========================================
  // USER TOKEN GENERATION
  // ========================================

  static generateUserTokens(user: User): TokenPair {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: 'user', // Default role
    };

    return this.generateTokenPair(payload);
  }

  // ========================================
  // TOKEN BLACKLIST (for logout)
  // ========================================

  private static blacklistedTokens = new Set<string>();

  static blacklistToken(token: string): void {
    this.blacklistedTokens.add(token);
  }

  static isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  static clearBlacklistedTokens(): void {
    this.blacklistedTokens.clear();
  }
} 