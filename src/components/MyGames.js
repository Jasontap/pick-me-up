import React, { Component } from "react";
import { connect } from "react-redux";
import GameCard from "./GameCard";
import { loadAllGamesForUser } from "../store/games";
import axios from "axios";
import GameMap from './GameMap';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class MyGames extends Component {
	constructor() {
		super();

		this.leaveGame = this.leaveGame.bind(this);
	}

	componentDidMount() {
		const token = localStorage.getItem("pickmeup-token");
		this.props.loadAllGamesForUser(this.props.user.id, token);
	}

	async leaveGame(game) {
		const token = localStorage.getItem("pickmeup-token");
		await axios.delete(`/api/user_games/${game.id}/${this.props.user.id}`);
		this.props.loadAllGamesForUser(this.props.user.id, token);
	}

	render() {
		const { userGames, user } = this.props;
		const { leaveGame } = this;
    
		if(userGames.length > 0){
				return (
					<div>
						<div className='myGamesHeader' >
							<h1>You have {userGames.length} game{userGames.length > 1 ? 's' : ''}</h1>
						</div>
						<div className='courtFinder'>
							<div > 
								<div className='myGamesList' className = 'container justify-content-center'>
									{
                    userGames.map(userGame => {
                      const game = userGame.game;
                      const players = game.users;

                      return (
                        <div key={game.id} className='card-body' style={{ width: 375 + 'px' }}>
                          <GameCard game={game} players={players} />
                          <div >
                            <center>
                              <button type='button' className='text-center btn btn-primary' onClick={() => leaveGame(game)}>
                                Leave this game
                              </button>
                              <Link 
                                //this is setting the url path and persisting gameid in state when chat loads
                                to={{ 
                                  pathname:`/chat/${game.chatId}`,
                                  state: { gameId: game.id }
                                }}
                              >
                                <button className='text-center btn btn-primary'>
                                  Chat
                                </button>
                              </Link>
                            </center>
                          </div>
                        </div>
                      );
                    })
                  }
								</div>
							</div> 
							<div className='courtMap'>
                {/* <GameMap courts={games}/> */}
							</div>
						</div> 
					</div>
				);
		} else {
			return(
				<div>
					<h1>You have no upcoming games.</h1>
				</div>
			)
		}
	}
}

const mapState = ({ games, users }) => {
	return {
		userGames: games.openForUser,
		user: users.single,
	};
};

const mapDispatch = (dispatch) => {
	return {
		loadAllGamesForUser: (userId, token) =>
			dispatch(loadAllGamesForUser(userId, token)),
	};
};

export default connect(mapState, mapDispatch)(MyGames);
