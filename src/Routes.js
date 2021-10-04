import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import {
	MyStats,
	GamesHosted,
	Game,
	Home,
	RequestForm,
	MyProfile,
	Login,
	SignUp,
	FindGame,
	MyGames,
	Chat
} from "./components";

class Routes extends Component {
	// there was a router but I don't know how to use that router
	render() {
		return (
			<Switch>
				<Route path="/login" component={Login} />
				<Route path="/signup" component={SignUp} />
				<Route path="/mygames" component={MyGames} />
				<Route path="/gameshosted" component={GamesHosted} />
				<Route exact path="/games" component={FindGame} />
				<Route path="/games/:id" component={Game} />
				<Route path="/stats" component={MyStats} />
				<Route path="/request" component={RequestForm} />
				<Route path='/chat/:id' component={ Chat } />
				<Route exact path="/account" component={MyProfile} />
				<Route path="/" component={Home} />
				<Redirect to="/home" />
			</Switch>
		);
	}
}

const mapState = (state) => {
	return state;
};


export default withRouter(connect(mapState)(Routes));
