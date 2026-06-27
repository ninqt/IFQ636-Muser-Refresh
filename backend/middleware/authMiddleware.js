const jwt = require('jsonwebtoken');
const User = require('../models/User');

// [Sean] Original protect middleware
// Handles token extraction, validation and user lookup
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};


// [Terry] Middleware Pattern
// Based on IFQ636 Module 4 - Design Patterns

// Muser Refresh structure:
// checkTokenExists -> checkTokenValid -> checkUserExists

// Base Middleware class
// Mirrors Module 4: class Middleware with next_middleware and process()
class Middleware {
    constructor(nextMiddleware = null) {
        this.nextMiddleware = nextMiddleware; // Reference to next handler in chain
    }

    process(req, res, next) {
        if (this.nextMiddleware) {
            this.nextMiddleware.process(req, res, next); // Pass to next handler
        } else {
            next(); // End of chain, proceed to route handler
        }
    }
}

// Concrete Middleware 1: Check if token exists in request header
// Mirrors Module 4: AuthenticationMiddleware
class CheckTokenExists extends Middleware {
    process(req, res, next) {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            req.token = req.headers.authorization.split(' ')[1]; // Extract token
            super.process(req, res, next); // Pass to next handler
        } else {
            res.status(401).json({ message: 'Not authorized, no token' }); // Break chain
        }
    }
}

// Concrete Middleware 2: Check if token is valid
// Mirrors Module 4: LoggingMiddleware
class CheckTokenValid extends Middleware {
    process(req, res, next) {
        try {
            const decoded = jwt.verify(req.token, process.env.JWT_SECRET); // Verify token
            req.decoded = decoded; // Attach decoded payload to request
            super.process(req, res, next); // Pass to next handler
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' }); // Break chain
        }
    }
}

// Concrete Middleware 3: Check if user exists in database
// Mirrors Module 4: ValidationMiddleware
class CheckUserExists extends Middleware {
    async process(req, res, next) {
        try {
            req.user = await User.findById(req.decoded.id).select('-password'); // Find user
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' }); // Break chain
            }
            super.process(req, res, next); // Pass to next handler (route handler)
        } catch (error) {
            res.status(401).json({ message: 'Server error' }); // Break chain
        }
    }
}

// Middleware Manager
// Mirrors Module 4: MiddlewareManager that sets up and processes the chain
class MiddlewareManager {
    constructor() {
        this.chain = null; // Start with empty chain
    }

    addMiddleware(middleware) {
        if (!this.chain) {
            this.chain = middleware; // First middleware becomes the head
        } else {
            let current = this.chain;
            while (current.nextMiddleware) {
                current = current.nextMiddleware; // Traverse to end of chain
            }
            current.nextMiddleware = middleware; // Append to end
        }
    }

    // Express-compatible handler
    handle() {
        return (req, res, next) => {
            if (this.chain) {
                this.chain.process(req, res, next); // Start processing from head
            } else {
                next();
            }
        };
    }
}

// Build the chain
// Mirrors Module 4: manager.add_middleware(AuthenticationMiddleware())
const authManager = new MiddlewareManager();
authManager.addMiddleware(new CheckTokenExists());
authManager.addMiddleware(new CheckTokenValid());
authManager.addMiddleware(new CheckUserExists());

// Export both protect (Sean) and protectChain (Terry)
const protectChain = authManager.handle();

module.exports = { protect, protectChain };