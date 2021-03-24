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
    if(Date.now() > game.time * 1){
      await axios.put(`/api/games/${game.id}`, { open: false });
    }
  }
  
  render(){
    const { game, players, openGame } = this.props;
    // console.log(game);
    
    return (
      <div className='game-card'>
        <div className='game-card-header'>
          <h3>Game { game.id }</h3>
        </div>
        <div className='game-card-content'>
          {
            openGame ? (
              <h4>
                {
                  players ? (
                    <span>Player Count: {players.length}</span>
                  ) : (
                    ''
                  )
                }
              </h4>
              ) : (
              <h4>Score: { game.finalScore }</h4>
            )
          }
          {/* <h4 className='name-list'>Player Names: 
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
          </h4> */}
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
