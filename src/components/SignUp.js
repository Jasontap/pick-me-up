import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { loadUser } from "../store/users";
import { useDispatch } from "react-redux";


function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	// Redux
	const dispatch = useDispatch();

	const joinGame = async (game, userId) =>{
    let teamToJoin = '';
    //check if there are an even or odd number of players assigns the new player accordingly (team A if this player will be odd Tean B for even) 
    if ((game.users.length * 1) % 2 === 0){
      teamToJoin = 'TEAM A';
    }
    else {
      teamToJoin = 'TEAM B';
    }
    if(Date.now() < game.time * 1){
      const addPlayer = (await axios.post('/api/user_games', { gameId: game.id, userId: userId, team: teamToJoin })).data;
      
      if(!addPlayer.created){
        window.alert('You have already joined this game.');
      } else {
        window.alert(`You\'ve joined game ${game.id}!`)
      }
    } else {
      window.alert('Sorry this game has already started. Please select another game.');
      await axios.put(`/api/games/${game.id}`, { open: false });
    }
    // this.props.loadOpenGames();
  };

	const joinNewGame = async (newGame, userId) =>{
		newGame.host = userId;
		const game = (await axios.post('/api/games', newGame)).data
    await axios.post('/api/user_games', { gameId: game.id, userId: userId, team: 'TEAM A' });
  };

	// Create user
	const registerUser = async () => {
		const request = {
			email,
			password,
			name,
		};

		const response = await axios.post("/api/users", request);
    // const results = await response.json();
    console.log(response)
    console.log('hello')
    
		// if (response) {
		// 	//the logic from Login.js so a user is automatically logged in after creating an account 
		// 	const response2 = await axios.post("/api/login", request);
		// 	localStorage.setItem("pickmeup-token", response2.data.token);
		// 	dispatch(loadUser(response2.data.id));
		// 	const game = JSON.parse(localStorage.getItem("game"))
		// 	const newGame = JSON.parse(localStorage.getItem("newGame"))
			
		// 	if (game){
		// 		joinGame(game, response2.data.id);
		// 	}
		// 	if (newGame) {
		// 		joinNewGame(newGame, response2.data.id)	
		// 	} 
		// 	history.push('/');

		// } else {
		// 	console.log("Failed");
		// }
	};

	// history, this will be useful once user is automatically logged in
	// after creating am account
	const history = useHistory();

	return (
		<div className='container justify-content-center'>
			<h2 className='text-center'>New User Sign Up</h2>
			<form>
				<div className="form-group">
				<label htmlFor="name">Full Name</label>
				<input
					type="text"
					id="name"
					value={name}
					className="form-control"
					onChange={(ev) => {
						setName(ev.target.value);
					}}
				/>
				</div>
					<div className="form-group">
				<label htmlFor="email">Email Address</label>
				<input
					type="text"
					id="email"
					value={email}
					className="form-control"
					onChange={(ev) => {
						setEmail(ev.target.value);
					}}
				/>
				</div>
				<div className="form-group">
				<label htmlFor="password">Password</label>
				<input
					type="text"
					id="password"
					value={password}
					className="form-control"
					onChange={(ev) => {
						setPassword(ev.target.value);
					}}
				/>
				</div>
			</form>
			<button onClick={registerUser}>Sign Up</button>
			<p>
				Already a user? <Link to="/login">Log in to existing account.</Link>
			</p>
		</div>
	);
}

export default SignUp;
