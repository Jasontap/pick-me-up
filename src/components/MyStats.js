import React, { Component } from 'react';
import { connect } from 'react-redux';
import GameCard from './GameCard';
import { loadClosedGamesForUser, loadUserWToken } from '../store/';

export class MyStats extends Component{
  constructor(props){
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidMount(){
    const token = localStorage.getItem("pickmeup-token");
    
		if(token){
			// this.props.loadUserWToken(null, token);
      let user = this.props.users.single;
      this.props.bootstrap(user.id, token);
		}
   
  }

  render(){
    
    let user = this.props.users.single;
    let games = this.props.games.closed
  
    let wins = [];
    let loses = [];

    //seperating out wins from loses
    for (let i = 0; i<games.length; i++){
      for (let j = 0; j < games[i].users.length; j++){
       if (games[i].users[j].usergame.team === games[i].winner && user.id === games[i].users[j].usergame.userId){
              wins.push(games[i])
          } else if (user.id === games[i].users[j].usergame.userId) {
        loses.push(games[i])
      }
      }
    }   

    return (
        <div className='container'>
          <div className='header'>
            {
              //replace email with user's name
            }
            <h1>{user.email}: Stats</h1>
          </div>
          <div className='sub-header'>
            <div >
              {
                // need to calculate total wins and losses
              }
              <h3>Wins: { wins.length }</h3>
              {  
                wins.map( game => { 
                  const players = game.users;
                  return (
        
                      <div key={game.id } className='card  mb-3' style={{ width: 450 + 'px' }}>
                   <GameCard game={game} players={players} openGame={false}/>
                    </div>
                  );
                })
              }
            </div>

            <div>
              <h3>Losses: { loses.length }</h3>
              {  
                  loses.map( game => { 
                    const players = game.users;
                    return (
          
                        <div key={game.id} className='card  mb-3' style={{ width: 450 + 'px' }}>
                     <GameCard game={game} players={players} openGame={false}/>
                      </div>
                    );
                  })
              }
            </div>
          </div>
        </div>
    );
  
  }
}

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    bootstrap: (userId, token)=> {
      // dispatch(loadUser(4));
      dispatch(loadClosedGamesForUser(userId, token));
    },
    		loadUserWToken: (userId, token) =>
			dispatch(loadUserWToken(userId, token)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyStats);

