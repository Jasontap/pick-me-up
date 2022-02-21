import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { loadUser } from "../store/users";
import { useDispatch } from "react-redux";


function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
  const [error, setError] = useState("");

	// Redux
	const dispatch = useDispatch();

	// Create user
	const registerUser = async () => {
		const request = {
			email,
			password,
			name,
		};

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(request),
    })
    
    const data = await response.json();

    if (data.error) {
      setError(data.message);
      return;
    }
    
    //the logic from Login.js so a user is automatically logged in after creating an account 
    const response2 = await axios.post("/api/login", request);
    localStorage.setItem("pickmeup-token", response2.data.token);
    dispatch(loadUser(response2.data.id));
    const game = JSON.parse(localStorage.getItem("game"))
    const newGame = JSON.parse(localStorage.getItem("newGame"))
    
    if (game){
      joinGame(game, response2.data.id);
    }
    if (newGame) {
      joinNewGame(newGame, response2.data.id)	
    } 
    history.push('/');

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
      { error && <p>{error}</p> }
			<p>
				Already a user? <Link to="/login">Log in to existing account.</Link>
			</p>
		</div>
	);
}

export default SignUp;
