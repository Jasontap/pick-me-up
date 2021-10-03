const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("../middleware/auth");

// POST /login
router.post(
	"/",
	passport.authenticate("local", { session: false }), (req, res) => {
		// Generate token on successful login
		const token = jwt.sign(req.user, process.env.JWT);
		req.user.token = token;
		res.status(200).send(req.user);
	}
);

module.exports = router;
