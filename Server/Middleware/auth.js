import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('Request origin:', req.headers.origin);
    console.log('All headers:', req.headers);
    console.log('Cookies received:', req.cookies);
    console.log('Access token from cookies:', req.cookies.accessToken);
    console.log('================================');

    const token = req.cookies.accessToken;

    if (!token) {
        console.log('❌ No access token found in cookies');
        return res.status(401).json({
            success: false,
            message: 'Access token required',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token verified successfully for user:', decoded.userId);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('❌ Token verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
