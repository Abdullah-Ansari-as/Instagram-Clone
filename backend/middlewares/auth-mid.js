import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
	try {
		const token = req.cookies.token;
		if(!token) {
			return res.status(401).json({
				message: "User not Authenticated",
				success: false
			});
		}
	
		const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
		if(!decode) {
			return res.status(401).json({
				message: "Invalid",
				success: false
			});
		}

		req.id = decode.userId;
		next();

	} catch (error) {
		return res.status(401).json({
			message: `Invalid access token: ${error}`
		})
	}
}