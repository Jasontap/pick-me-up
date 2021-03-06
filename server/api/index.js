const express = require("express");
const { static } = express;
const path = require("path");
const passport = require("passport");

const app = express();
module.exports = app;

app.use(express.json());
app.use(passport.initialize());

app.use("/dist", static(path.join(__dirname, "..", "..", "dist")));
// static file-serving middleware
app.use(express.static(path.join(__dirname, "..", "..", "public")));

app.get("/", (req, res, next) =>
	res.sendFile(path.join(__dirname, "..", "..", "public/index.html"))
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


//final error catcher 
app.use((err, req, res, next)=>{
  res.status(500).send({ error: err });
});
