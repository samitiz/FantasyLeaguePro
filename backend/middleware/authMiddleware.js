import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); 
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }
    
    try {
      // Decode the JWT token to get the user id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;  // Attach user ID to the request object
      next();
    } catch (error) {
      return res.status(401).json({ message: `Invalid token, ${error}` });
    }
  };

export { authenticateJWT };