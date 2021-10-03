import axios from "axios";

// can I just add a wins game here??
const LOAD_GAMES = "LOAD_GAMES";
const LOAD_GAMES_FOR_USER = "LOAD_GAMES_FOR_USER";
const LOAD_SINGLE_GAME = "LOAD_SINGLE_GAME";
const LOAD_CLOSED_GAMES = "LOAD_CLOSED_GAMES";
const LOAD_HOSTED_GAMES = "LOAD_CLOSED_GAMES";
const CREATE_GAME = "CREATE_GAME";
const DESTROY_GAME = "DESTROY_GAME";
const UPDATE_GAME = "UPDATE_GAME";

//*************************************************
const intialState = { open: [], openForUser: [], closed: [], hosted: [], single: {} };

const gamesReducer = (state = intialState, action) => {
	if (action.type === LOAD_GAMES) {
		state.open = action.games;
	}
	if (action.type === LOAD_GAMES_FOR_USER) {
		state.openForUser = action.games;
	}
	if (action.type === LOAD_SINGLE_GAME) {
		state.single = action.game;
	}
	if (action.type === LOAD_CLOSED_GAMES) {
		state.closed = action.games;
	}
	if (action.type === LOAD_HOSTED_GAMES) {
		state.hosted = action.games;
	}
	if (action.type === CREATE_GAME) {
		state.open = [...state, action.game];
	}
	return { ...state };
};

//ACTION CREATORS****************************************
const _loadGames = (games) => {
	return {
		type: LOAD_GAMES,
		games,
	};
};

const _loadGamesForUser = (games) => {
	return {
		type: LOAD_GAMES_FOR_USER,
		games,
	};
};

const _loadSingleGame = (game) => {
	return {
		type: LOAD_SINGLE_GAME,
		game,
	};
};

const _loadClosedGames = (games) => {
	return {
		type: LOAD_CLOSED_GAMES,
		games,
	};
};

const _loadHostedGames = (games) => {
	return {
		type: LOAD_HOSTED_GAMES,
		games,
	};
};

const _createGame = (game) => {
	return {
		type: CREATE_GAME,
		game,
	};
};

//THUNKS****************************************
export const loadGames = () => {
	return async (dispatch) => {
		const games = (await axios.get("/api/games")).data;
		dispatch(_loadGames(games));
	};
};

export const loadOpenGames = (zipcode) => {
	return async (dispatch) => {
		const games = (await axios.get(`/api/games/open/${zipcode}`)).data;
		dispatch(_loadGames(games));
	};
};

export const loadSingleGame = (userId) => {
	return async (dispatch) => {
		const game = (await axios.get(`/api/games/${userId}`)).data;
		dispatch(_loadSingleGame(game));
	}
}

export const loadAllOpenGames = () => {
	return async (dispatch) => {
		const games = (await axios.get(`/api/games/open/`)).data;
		dispatch(_loadGames(games));
	};
};

export const loadClosedGames = () => {
	return async (dispatch) => {
		const games = (await axios.get("/api/games/closed")).data;
		//can add a filter to check if user is in game
		dispatch(_loadClosedGames(games));
	};
};

export const loadClosedGamesForUser = (userId, token) => {
	return async (dispatch) => {
		const games = (await axios.get(`/api/games/closed/${userId}?pickmeup-token=${token}`)).data;
		dispatch(_loadClosedGames(games));
	};
};

export const loadOpenGamesForUser = (userId, token) => {
	return async (dispatch) => {
		const games = (
			await axios.get(`/api/user_games/open/${userId}?pickmeup-token=${token}`)
		).data;
		dispatch(_loadGamesForUser(games));
	};
};

export const loadHostedGames = (userId, token) => {
	return async (dispatch) => {
		const games = (await axios.get(`/api/games/hosted/${userId}?pickmeup-token=${token}`)).data;
		dispatch(_loadHostedGames(games));
	};
};

export const createGame = () => {
	return async (dispatch) => {
		const game = (await axios.post("/api/games")).data;
		dispatch(_createGame(game));
	};
};

//this works can possibly be split in two one for games going to be played
// and one for games played but it works
export const updateGame = (id, state, history) => {
	//will put logic to mark games done in here
	let done = false;
	if (state.finalScore !== "" && state.winner !== "") {
		done = true;
	}
	return async (dispatch) => {
		const { finalScore, winner, host, location, dateAndTime } = state;
		let time = new Date(dateAndTime).getTime();
		const game = (
			await axios.put(`/api/games/${id}`, {
				done,
				finalScore,
				winner,
				location,
				dateAndTime,
				time,
			})
		).data;

		loadHostedGames(host);
		loadSingleGame(id)
		//dispatch(_createGame(game));
		history.push("/gameshosted");
	};
};

//dstroying (deleting) a game and sending user back to the
// games they host where those game are reloaded into store so not needed here
//when a game is deleted
export const destroyGame = (game, history) => {
	return async (dispatch) => {
		const host = game.host;
		await axios.delete(`/api/games/${game.id}`);
		loadHostedGames(host);
		//dispatch(_createGame(game));
		history.push("/gameshosted");
	};
};

// export default store;
export { gamesReducer };
