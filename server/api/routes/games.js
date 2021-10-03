const router = require('express').Router();
const { models: {User, Game}  } = require('../../db');
const { Op } = require("sequelize");
const passport = require("passport");

//gets all games
router.get("/", async (req, res, next) => {
	try {
		res.send(await Game.findAll());
	} catch (ex) {
		next(ex);
	}
});




router.get('/open/', async(req, res, next)=> {
  try {
    let games = await Game.findAll({
      where: {
        open: true,
      },
			include: [ User ]
    });

		res.send(games)

  }
  catch(ex){
    next(ex);
  }
});

//gets all closed games
router.get('/closed', async(req, res, next)=> {
  try {
    res.send(await Game.findAll({
			where: {
				[Op.and]: [
					{ open: false },
					{ finalScore: { [Op.not]: null } }
				],
			},
			include: { 
				model: User,
			} 
    }));
  }
  catch(ex){
    next(ex);
  }
});

// get an individual game
router.get("/:id", async (req, res, next) => {
	try {
		res.send(await Game.findByPk(req.params.id));
	} catch (ex) {
		next(ex);
	}
});

//gets all open games
router.get('/open/:zipcode', async(req, res, next)=> {
  try {
    let games = await Game.findAll({
      where: {
        open: true,
				zipcode: req.params.zipcode
      },
			include: [ User ]
    });

		res.send(games)

  }
  catch(ex){
    next(ex);
  }
});


//gets all closed games for user
router.get('/closed/:id', 
passport.authenticate("jwt", { session: false }),
async(req, res, next)=> {
  try {
    let games = await Game.findAll({
			where: {
				[Op.and]: [
					{ open: false },
					{ finalScore: { [Op.not]: null } }
				],
			},
			include: { 
				model: User,
			} 
    });

		let closedGames = [];
		for (let i = 0; i < games.length; i++) {
			if (games[i].finalScore !== null) {	
				for (let j = 0; j < games[i].users.length; j++) {
					if (games[i].users[j].id === req.user.id) {

						closedGames.push(games[i]);
					}
				}
			}
		}

		res.send(closedGames);
  }
  catch(ex){
    next(ex);
  }
});


//gets all hosted games for a user
router.get('/hosted/:id', 
passport.authenticate("jwt", { session: false }),
async(req, res, next)=> {
	
  try {
    res.send(await Game.findAll({
			where: {
				host: req.user.id
			},
			include: { 
				model: User,
			} 
    }));
  }
  catch(ex){
    next(ex);
  }
});

//gets a game
router.get('/:id', async(req, res, next)=> {
  try {
    res.send(await Game.findByPk(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

// creates a game
router.post("/", async (req, res, next) => {
	try {
		res.status(201).send(await Game.create(req.body));
	} catch (ex) {
		next(ex);
	}
});

// updates a game
router.put("/:id", async (req, res, next)=> {
	try{
		const game = await Game.findByPk(req.params.id);
		res.status(201).send(await game.update(req.body));
	}
	catch(ex){
		next(ex);
	}
})

//deletes a game
router.delete("/:id", async (req, res, next) => {
	try {
		const game = await Game.findByPk(req.params.id);
		await game.destroy();
		res.sendStatus(204);
	} catch (ex) {
		next(ex);
	}
});





module.exports = router;
