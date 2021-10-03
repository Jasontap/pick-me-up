import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadHostedGames } from '../store/';
import GameCard from './GameCard';
import GameMap from './GameMap'

//this will list the games a user is hosting, they will be able to update the time, location, delete the game
//they will also be able to add a winner and update the score, not sure if these two things should be seperated out 
//so for finished games you can update the score but for games not started you can change time and such, that would be better but first I will 
//just let you change everything 

export class GamesHosted extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    
    // just hard coding it in for convience at the moment 
    // this.props.bootstrap(1);

    const token = localStorage.getItem("pickmeup-token");
    
		if(token){
			// this.props.loadUserWToken(null, token);
      let user = this.props.users.single;
      this.props.bootstrap(user.id, token);
		}

  }

  render(){

    let games = this.props.games.hosted;
    let pastGames = [];
    let futureGames = [];
    let scoredGames = [];

    // could split past games into already marked done, and need score
    games.forEach(game => {if(Date.now() > game.time * 1){
      if (!game.finalScore && !game.winner ){
        pastGames.push(game) 
      } else {
        scoredGames.push(game)  } 
      }
      else {
        futureGames.push(game)
      }
    });

    futureGames.sort((a, b) => a.time - b.time);
    pastGames.sort((a, b) => a.time - b.time);  
    scoredGames.sort((a, b) => a.time - b.time);

    //idealy would also be able to enter teams for players of done games or have the computer 
    //do it
    if(games.length > 0){
      return (
        <div className= 'container'>
          <div className= "gamesHostedHeader">
            {
              games.length > 0 ? (
                <h1>You have {games.length} hosted games!</h1>
              ) : (
                <h1>You have no upcoming games.</h1>
              )
            }
          </div>
          <div className='courtFinder'>
            <div className= 'myGamesList'>
              <div className='listOfGames'>
                <h3>Games you will Host: { futureGames.length }</h3>
                <hr></hr>
                  {  
                    futureGames.map( game => { 
                      const players = game.users;
                      return (
                        <div key={game.id} >
                          <a href={`#/games/${game.id}`}><h4>Edit game {game.id}</h4></a>
                          <GameCard game={game} players={players} openGame={true}/>
                        </div>
                      );
                    })
                  }
                  <br></br>
              </div>
              <div className='listOfGames'>
                <h3>Games that need to be scored: { pastGames.length }</h3>
                <hr></hr>
                  {  
                    pastGames.map( game => { 
                      const players = game.users;
                      return (
                        <div key={game.id}>
                        <a href={`#/games/${game.id}`}><h4>Edit game {game.id}</h4></a>
                        <GameCard game={game} players={players} openGame={false}/>
                        </div>
                      );
                    })
                  }
                  <br></br>
              </div>
              <div className='listOfGames'>
                <h3>Games Hosted: { scoredGames.length }</h3>
                <hr></hr>
                  {  
                    scoredGames.map( game => { 
                      const players = game.users;
                      return (
                        <div key={game.id}>
                        <a href={`#/games/${game.id}`}><h4>Edit game {game.id}</h4></a>
                        <GameCard game={game} players={players} openGame={false}/>
                        </div>
                      );
                    })
                  }
              </div>
            </div>
            <div className='courtMap'>
              <GameMap courts={games}/>
            </div>
          </div>
        </div>
      );
    }else{
      return (
        <h1>You have {games.length} hosted games!</h1>
    );
    }
  
  }
}

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    bootstrap: (userId, token)=> {
      dispatch(loadHostedGames(userId, token));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesHosted);

