import React, { Component } from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import moment from 'moment';

/**
 * COMPONENT
 */
class GameCard extends Component{
  constructor(){
    super();
    this.state = {
      gameRequests: [],
      players: []
    }
  }

  async componentDidMount(){
    const game = this.props.game;
    // was getting a slight error when deleting games  && game.open fixes it
    // should not break anything else 
    if(Date.now() > game.time * 1 && game.open){
      await axios.put(`/api/games/${game.id}`, { open: false });
    }
  }
  
  render(){
    const { game, players, openGame } = this.props;
    const playerCount = players.length;
    const maxPlayers = game.maxPlayerCount;
    
    return (
      <div className='game-card ' >
        <div className='game-card-header' className='center text-center text-white bg-danger mb-3' >
          <h3>Game { game.id }</h3>
        </div>
        <div className='game-card-content'>
          {
            game.open ? (
              <h4>
                {
                  players ? (
                    <div>
                      <p>Player Count: {playerCount}</p>
                      <p>Waiting on {maxPlayers - playerCount} more to join.</p>
                    </div>
                  ) : (
                    ''
                  )
                }
              </h4>
              ) : (
              <div>  
                <h4>Score: { game.finalScore }</h4>
                <h4>Winner: { game.winner }</h4>
              </div>  
            )
          }
          {
            players ? (
              <h4 className='name-list'>Player Names: 
                { 
                //maybe use reduce() here to list/join the names in a nicer way
                  players.map(player => {
                    return (
                      <span key={player.id}> 
                        {' ' + player.name}
                      </span>
                    )
                  }) 
                }
              </h4>
            ) : (
              ''
            )
          }
          <h4>Court: { game.location }</h4>
          <h4>Date: { moment(game.dateAndTime).format('MMM D, YYYY') }</h4>
          <h4>Time: { moment(game.dateAndTime).format('h:mm a') }</h4>
        </div>
      </div>
    )
  }
}

const mapState = ({ users }) => {
  return {
    users: users.all
  }
}


export default connect(mapState, null)(GameCard)

