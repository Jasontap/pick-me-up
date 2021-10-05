const router = require("express").Router();
const { models: { User, Game, UserGame } } = require("../../db");
const passport = require("passport");

require("../middleware/auth");

//gets all user_games
router.get("/", async (req, res, next) => {
	try {
		res.send(await UserGame.findAll({ include: [User, Game] }));
	} catch (ex) {
		next(ex);
	}
});

//gets players of a single game
router.get("/:gameId/players", async (req, res, next) => {
	try {
		const gameUsers = await UserGame.findAll({
			where: {
				gameId: req.params.gameId,
			},
			include: [User],
		});
		const players = gameUsers.map((user) => user.user);
		res.send(players);
	} catch (ex) {
		next(ex);
	}
});

//gets all games for a single user (including all respective players in game)
router.get(
	"/all/:userId",
	passport.authenticate("jwt", { session: false }),
	async (req, res, next) => {
		try {
			const gameLinksForUser = await UserGame.findAll({
        where: {
          userId: req.user.id
        }
      });
			const gameIds = gameLinksForUser.map((link) => link.gameId);
      const userGames = await Promise.all(gameIds.map(gameId => {
        return UserGame.findAll({
          where: {
            gameId: gameId
          },
          include: [User, Game]
        })
      }))
			// const upcomingGames = games.filter((game) => game.time > Date.now());

			res.send(userGames);
		} catch (ex) {
			next(ex);
		}
	}
);

//creates a user-game link --- joins a player to a game
router.post("/", async (req, res, next) => {
	try {
		const [addPlayerToGame, created] = await UserGame.findOrCreate({
			where: {
				gameId: req.body.gameId,
				userId: req.body.userId,
			},
			defaults: req.body,
		});

		if (created) {
			const gameInfo = await UserGame.findAll({
				where: {
					gameId: req.body.gameId,
				},
				include: [Game],
			});
			const playerCount = gameInfo.length;
			const game = await Game.findByPk(req.body.gameId);

			if (playerCount === game.maxPlayerCount) {
				await game.update({
					open: false,
				});
			}
			res.status(201).send({ created, addPlayerToGame });
		} else {
			res.send({ created, addPlayerToGame });
		}
	} catch (ex) {
		next(ex);
	}
});

// deletes a user-game link
router.delete("/:gameId/:userId", async (req, res, next) => {
	try {
		const userGame = await UserGame.findOne({
			where: {
				gameId: req.params.gameId,
				userId: req.params.userId,
			},
			include: Game,
		});

		if (userGame.game.time * 1 > Date.now()) {
			userGame.game.open = true;
			await userGame.game.save();
		}

		await userGame.destroy();
		res.sendStatus(204);
	} catch (ex) {
		next(ex);
	}
});

module.exports = router;
