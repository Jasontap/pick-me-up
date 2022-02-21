import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loadUser } from "../store/users";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

const Login = () => {
	// state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  const [visiblePW, setVisiblePW] = useState("");
	const [error, setError] = useState("");

	// Redux
	const dispatch = useDispatch();


	// history 
	const history = useHistory();

	// form submit
	const login = async () => {
		


		if (!email || !password) {
			setError("Error: Please fill out both email and password fields");
		} else {
			try {
				const request = { email, password };
				const response = await axios.post("/api/login", request);

				localStorage.setItem("pickmeup-token", response.data.token);
				dispatch(loadUser(response.data.id));
				setError("Success");
				history.push('/');

			} catch (er) {
				console.log(er);
				setError("Error: Invalid email or password. Please try again.");
			}
		}
	};

  const togglePassword = (e) => {
    const type = e.target.previousSibling.type;
    e.target.previousSibling.type = (type === 'password') ? 'text' : 'password';
    setVisiblePW(!visiblePW);
  }

  const passwordView = (visibility) => {
    return visibility ? (
      <img src='./images/util/view.png' width='20px' onClick={ (e) => togglePassword(e)} /> 
    ) : (
      <img src='./images/util/hidden.png' width='20px' onClick={ (e) => togglePassword(e)} /> 
    )
  };

	return (
		<div className='container justify-content-center'  > 
			
			<form> 
				<div className='form-group'> 
				<label htmlFor="email">Email Address</label>
				<input
					type="text"
					id="email"
					value={email}
					className='form-control'
					onChange={(ev) => {
						setEmail(ev.target.value);
					}}
				/>
				</div>
				<div className='form-group'>
				<label htmlFor="password">Password</label>
				<input
					type="password"
					id="password"
					value={password}
					className='form-control'
					onChange={(ev) => {
						setPassword(ev.target.value);
					}}
				/>
        { passwordView(visiblePW) }
				</div>
			</form>
			<button onClick={login}>Log In</button>
			{error && <p>{error}</p>}
			<p>
				Not a user yet? <Link to="/signup">Sign up for a new account.</Link>
			</p>
		</div>
	);
};

export default Login;
