import React, { Component } from "react";
import { connect } from "react-redux";
import GameCard from "./GameCard";
import { loadOpenGamesForUser } from "../store/games";
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
		this.props.loadOpenGamesForUser(this.props.user.id, token);
	}

	async leaveGame(game) {
		const token = localStorage.getItem("pickmeup-token");
		await axios.delete(`/api/user_games/${game.id}/${this.props.user.id}`);
		this.props.loadOpenGamesForUser(this.props.user.id, token);
	}

	render() {
		const { games, user } = this.props;
		const { leaveGame } = this;
		if(games.length >0){
				return (
					<div>
						<div className='myGamesHeader' >
							<h1>You have {games.length} upcoming games!</h1>
						</div>
						<div className='courtFinder'>
							<div > 
								<div className='myGamesList' className = 'container justify-content-center'>
									{games.map((game) => {
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
									})}
								</div>
							</div>
							<div className='courtMap'>
                <GameMap courts={games}/>
							</div>
						</div>
					</div>
				);
		}else{
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
		games: games.openForUser,
		user: users.single,
	};
};

const mapDispatch = (dispatch) => {
	return {
		loadOpenGamesForUser: (userId, token) =>
			dispatch(loadOpenGamesForUser(userId, token)),
	};
};

export default connect(mapState, mapDispatch)(MyGames);
