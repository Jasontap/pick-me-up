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
  const [pwConfirm, setPwConfirm] = useState("");
  const [visiblePW, setVisiblePW] = useState(false);
  const [visiblePWConfirm, setVisiblePWConfirm] = useState(false);
	const [name, setName] = useState("");
  const [error, setError] = useState("");

	// Redux
	const dispatch = useDispatch();

	// Create user
	const registerUser = async () => {
    if (password !== pwConfirm) return setError('* Passwords do no match.');

		const request = {
			email,
			password,
			name,
		};

    const registerRes = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(request),
    })
    
    const registerData = await registerRes.json();

    if (registerData.error) {
      setError(registerData.message);
      return;
    }
    
    //the logic from Login.js so a user is automatically logged in after creating an account 
    const { data } = await axios.post("/api/login", request);
    localStorage.setItem("pickmeup-token", data.token);
    dispatch(loadUser(data.id));
    // const game = JSON.parse(localStorage.getItem("game"))
    // const newGame = JSON.parse(localStorage.getItem("newGame"))
    
    // if (game) joinGame(game, data.id);
    // if (newGame) joinNewGame(newGame, data.id);

    history.push('/');

	};

	// history, this will be useful once user is automatically logged in
	// after creating am account
	const history = useHistory();

  const togglePassword = (e) => {
    let type = e.target.previousSibling.type;
    e.target.previousSibling.type = (type === 'password') ? 'text' : 'password';
    (e.target.previousSibling.id === 'password') ? setVisiblePW(!visiblePW) : setVisiblePWConfirm(!visiblePWConfirm);
  }

  const passwordIcon = (visibility) => {
    return visibility ? (
      <img src='./images/util/view.png' width='20px' onClick={(e) => togglePassword(e)} /> 
    ) : (
      <img src='./images/util/hidden.png' width='20px' onClick={(e) => togglePassword(e)} /> 
    )
  }


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
            type="password"
            id="password"
            value={password}
            className="form-control"
            onChange={(ev) => {
              setPassword(ev.target.value);
            }}
          />
          { passwordIcon(visiblePW) }
				</div>
				<div className="form-group">
          <label htmlFor="pwConfirm">Confirm Password { (password !== pwConfirm) && '*' }</label>
          <input
            type="password"
            id="pwConfirm"
            value={pwConfirm}
            className="form-control"
            onChange={(ev) => {
              setPwConfirm(ev.target.value);
            }}
          />
          { passwordIcon(visiblePWConfirm) }
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
