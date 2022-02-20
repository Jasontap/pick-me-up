const express = require("express");
const { static } = express;
const path = require("path");
const passport = require("passport");
const volleyball = require('volleyball');

const app = express();
module.exports = app;

app.use(express.json());
app.use(passport.initialize());
app.use(volleyball);

app.use("/dist", static(path.join(__dirname, "..", "..", "dist")));
// static file-serving middleware
app.use(express.static(path.join(__dirname, "..", "..", "public")));

app.get("/", (req, res, next) =>
	res.sendFile(path.join(__dirname, "..", "..", "public/index.html"))
);

app.get("/images/paving", (req, res, next) =>
	res.sendFile(path.join(__dirname, "..", "..", "public/images/paving.jpg"))
);

//the router :)
app.use("/api", require("./routes"));


//gets players of a single game
app.get('/api/user_games/:gameId/players', async(req, res, next)=> {
  try{
    const gameUsers = await UserGame.findAll({
      where: {
        gameId: req.params.gameId
      },
      include: [ User ]
    });
    const players = gameUsers.map(user => user.user);
    res.send(players);
  }
  catch(ex){
    next(ex);
  }
})

//creates a user-game link
app.post('/api/user_games', async(req, res, next)=> {
	try{
		res.status(201).send(await UserGame.create(req.body));
	}
	catch(ex){
		next(ex);
	}
})


const logError = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};

const clientErrorHandler = (err, req, res, next) => {
  // res.status(404).send('error', { error: err });
  if (req.hxr) {
    res.status(500).send({ error: 'something failed!'});
  } else {
    next(err);
  }
};

const errorHandler = (err, req, res, next) => {
  // res.status(500);
  res.render('error', { error: err });
};

app.use(logError);
app.use(clientErrorHandler);
app.use(errorHandler);
