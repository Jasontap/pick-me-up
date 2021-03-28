import axios from 'axios';

// can I just add a wins game here??
const LOAD_GAMES = 'LOAD_GAMES';
const LOAD_CLOSED_GAMES = 'LOAD_CLOSED_GAMES';
const LOAD_HOSTED_GAMES = 'LOAD_CLOSED_GAMES';
const CREATE_GAME = 'CREATE_GAME';
const DESTROY_GAME = 'DESTROY_GAME';
const UPDATE_GAME = 'UPDATE_GAME';


//*************************************************
const intialState = {open: [], closed: [], hosted: []}

const gamesReducer = (state = intialState, action) =>{
  if (action.type === LOAD_GAMES){
      state.open = action.games
  }
  if (action.type === LOAD_CLOSED_GAMES){
      state.closed = action.games
  }
  if (action.type === LOAD_HOSTED_GAMES){
    state.hosted = action.games
  }
  if (action.type === CREATE_GAME){
      state.open = [...state, action.game]
  }
  return {...state};
}

//ACTION CREATORS****************************************
const _loadGames = (games) =>{
  return {
      type: LOAD_GAMES,
      games
  };
};

const _loadClosedGames = (games) =>{
  return {
      type: LOAD_CLOSED_GAMES,
      games
  };
};

const _loadHostedGames = (games) =>{
  return {
      type: LOAD_HOSTED_GAMES,
      games
  };
};

const _createGame = (game) => {
  return {
      type: CREATE_GAME,
      game
  }
}

//THUNKS****************************************
export const loadGames = () =>{
  return async(dispatch)=>{
      const games = (await axios.get('/api/games')).data;
      dispatch(_loadGames(games));
  }
};

export const loadOpenGames = () =>{
  return async(dispatch)=>{
      const games = (await axios.get('/api/games/open')).data;
      dispatch(_loadGames(games));
  }
};

export const loadClosedGames = () =>{
  return async(dispatch)=>{
      const games = (await axios.get('/api/games/closed')).data;
      //can add a filter to check if user is in game 
      dispatch(_loadClosedGames(games));
  }
};


export const loadClosedGamesForUser = (userId) =>{
  return async(dispatch)=>{
    const games = (await axios.get('/api/games/closed')).data;
    //can add a filter to check if user is in game 
    
    let gamesForUser = []

    //sure this can be done with less code
    for (let i = 0; i<games.length; i++){
      if (games[i].finalScore !== null){
          for (let j = 0; j < games[i].users.length; j++){
          if (games[i].users[j].id === userId){
              gamesForUser.push(games[i])
          }
      }
    }
  }  

   dispatch(_loadClosedGames(gamesForUser));
  }
};

export const loadOpenGamesForUser = (userId)=> {
  return async(dispatch)=> {
    const games = (await axios.get(`/api/user_games/open/${userId}`)).data;
    dispatch(_loadGames(games));
  }
};

export const loadHostedGames = (userId) =>{
  return async(dispatch)=>{
      const games = (await axios.get(`/api/games/hosted/${userId}`)).data;
      console.log(games)
      dispatch(_loadHostedGames(games));
  }
};

export const createGame = () => {
  return async(dispatch) => {
    const game = (await axios.post('/api/games')).data;
    dispatch(_createGame(game));
  }
}


export const updateGame = (id, state, history)=>{
  return async(dispatch)=>{
      const { finalScore, host } = state;
      console.log(finalScore); 
      const game = (await axios.put(`/api/games/${id}`, { finalScore })).data;
      console.log('-----------in thunk--------------');
      console.log(id)
      console.log(state)
      console.log(host);
      loadHostedGames(host);
      //dispatch(_createGame(game));
      history.push('/gameshosted')
  }
}


//dstroying (deleting) a game and sening usre back to the 
// games they host were those game are reloaded into store so not needed here
//when a game is deleted 
export const destroyGame = (game, history) => {
  return async(dispatch) => {
    console.log(game.host)
    const host = game.host;
    await axios.delete(`/api/games/${game.id}`);
    loadHostedGames(host);
    //dispatch(_createGame(game));
    history.push('/gameshosted')
  }
}

// export default store;
export { gamesReducer };