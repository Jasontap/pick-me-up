import React, { Component } from "react";
import { render } from "react-dom";
import { Provider, connect } from "react-redux";
import { HashRouter, Router, BrowserRouter } from "react-router-dom";
import { NavBar } from "./components";
import { Login } from "./components";
import Routes from "./Routes";
import history from "./history";
import store from "./store/index";
import { loadUserWToken } from "./store/users";

class _App extends Component {
	constructor() {
		super();
		this.state = {};
	}

	componentDidMount() {
		//I assume once we have the token we should be able to use it load the user 
		// but not sure how, i mean the token just can store the user ID 
		const token = localStorage.getItem("pickmeup-token");
		if(token){
			this.props.loadUserWToken( token );
		}
	}

	//hashrouter has the most functionality at the moment but has the hash that looks
	// slightly funny.  Will use this for the moment
	render() {
		return (
			<HashRouter>
				<div>
					<NavBar />
					<Routes />
					{/* <Login /> */}
				</div>
			</HashRouter>
		);
	}
}

// not sure if I need either of these maybe if I want length??
const mapStateToProps = (state) => {
	return state;
};
const mapDispatch = (dispatch) => {
	return {
		loadUserWToken: (token) =>
			dispatch(loadUserWToken(token)),
	};
};

const App = connect(mapStateToProps, mapDispatch)(_App);

//so this just takes care of rendering and should be passing history but does not seem too


//the router should have worked but does not and I have no way of testing it
// so we are using the simplier hashrouter
render(
	<Provider store={store}>
		{/* <Router history = {history}> */}
		<App />
		{/* </Router> */}
	</Provider>,
	document.querySelector("#root")
);
