const router = require('express').Router();
const { models: { User }  } = require('../../db');
const passport = require("passport");

require("../middleware/auth");


//gets all users
router.get("/", async (req, res, next) => {
	try {
		res.send(await User.findAll());
	} catch (ex) {
		next(ex);
	}
});

//gets a user
router.get("/:id", async (req, res, next) => {
	try {
		res.send(await User.findByPk(req.params.id));
	} catch (ex) {
		next(ex);
	}
});


//gets a user with token
router.get(
  "/token/:id", 
  passport.authenticate("jwt", { session: false }), 
  async (req, res, next) => {
    try {
      res.send(await User.findByPk(req.user.id));
    } catch (ex) {
      next(ex);
    }
  }
);

// creates a user
router.post("/", async (req, res, next) => {
	try {
		res.status(201).send(await User.create(req.body));
	} catch (ex) {
    next(ex);
	}
});

//Update user
router.put("/update/:id", async (req, res, next) => {
	try {
		const user = await User.findByPk(req.params.id);
		res.send(
			await user.update({
				email: req.body.email,
				name: req.body.name,
				height: req.body.height,
				description: req.body.description,
				photo: req.body.photo,
			})
		);
	} catch (error) {
		next(error);
	}
});


//deletes a user
router.delete("/:id", async (req, res, next) => {
	try {
		const user = await User.findByPk(req.params.id);
		await user.destroy();
		res.sendStatus(204);
	} catch (ex) {
		next(ex);
	}
});

module.exports = router;


