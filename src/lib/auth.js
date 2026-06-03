import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Перевірка наявності JWT_SECRET при запуску
if (!JWT_SECRET && process.env.NODE_ENV !== 'production') {
  console.warn('⚠️ WARNING: JWT_SECRET is not defined in .env.local');
  console.warn('⚠️ Authentication will not work correctly!');
}

// Generate JWT token
export function generateToken(userId, email, role = 'user') {
  if (!JWT_SECRET) {
    console.error('❌ Cannot generate token: JWT_SECRET is missing');
    throw new Error('JWT_SECRET not configured');
  }
  
  console.log('🔐 Generating token for user:', userId);
  
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token) {
  if (!token) {
    console.log('❌ verifyToken: No token provided');
    return null;
  }
  
  if (!JWT_SECRET) {
    console.error('❌ verifyToken: JWT_SECRET is missing');
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified for user:', decoded.userId);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('❌ Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      console.log('❌ Invalid token:', error.message);
    } else {
      console.log('❌ Token verification error:', error.message);
    }
    return null;
  }
}

/** Cookie (httpOnly) or Authorization: Bearer for API routes */
export function getTokenFromRequest(request) {
  let token = request.cookies.get('auth-token')?.value;
  if (!token || token.length < 10) {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }
  return token && token.length > 10 ? token : null;
}

// Generate random token for email verification
export function generateRandomToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Format user response (exclude sensitive data)
export function formatUserResponse(user) {
  const userObj = user.toJSON ? user.toJSON() : user;
  
  return {
    id: userObj._id,
    firstName: userObj.firstName,
    lastName: userObj.lastName,
    email: userObj.email,
    emailVerified: userObj.emailVerified,
    kycStatus: userObj.kycStatus,
    phone: userObj.phone,
    address: userObj.address,
    createdAt: userObj.createdAt,
  };
}