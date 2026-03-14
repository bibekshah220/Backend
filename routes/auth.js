





export const protect = async (req, res, next) => {

    try {
        let token;      
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            const decoded = verifyToken(token);
            req.user = await User.findById(decoded.id).select("-password");         
            next();
        } else {
            return res.status(401).json({ success: false, error: "Not authorized, no token" });
        }       
    } catch (error) {
        return res.status(401).json({ success: false, error: "Not authorized, token failed" });
    }   
}