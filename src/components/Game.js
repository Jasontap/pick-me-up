import React, { Component } from 'react';
import { connect } from 'react-redux';
import { destroyGame, updateGame } from '../store/';
import moment from 'moment';
import axios from 'axios';
import CourtMap from './CourtMap'

const COURT_API = process.env.COURT_API

//this will list the games a user is hosting, they will be able to update the time, location, delete the game
//they will also be able to add a winner and update the score, not sure if these two things should be seperated out 
//so for finished games you can update the score but for games not started you can change time and such, that would be better but first I will 
//just let you change everything 

export class Game extends Component{
  constructor(props){
    super(props);
    this.state = {
      location: this.props.game.location ? this.props.game.location : null,
      dateAndTime: this.props.game.dateAndTime ? this.props.game.dateAndTime : '',
      time: this.props.game.time ? this.props.game.time : '',
      finalScore: this.props.game.finalScore ? this.props.game.finalScore : '',
      winner: this.props.game.winner ? this.props.game.winner : '',
      done: this.props.game.done ? this.props.game.done : '',
      error: '',
      zipcode: '',
      courts: [],
      searched: false,
      startLocation: this.props.game.location ? this.props.game.location : null
  };

  this.onChange = this.onChange.bind(this);
  this.onSave = this.onSave.bind(this);
  this.courtSubmit = this.courtSubmit.bind(this)
  this.handleInputs = this.handleInputs.bind(this)
  this.handleMarkers = this.handleMarkers.bind(this)
}
componentDidUpdate(prevProps){
  //does not mater for the moment as refresh just logs you off
  if (!prevProps.game.id && this.props.game.id){
    this.setState({ location: this.props.game.location, dateAndTime: this.props.game.dateAndTime, time: this.props.game.time, finalScore: this.props.game.finalScore, winner: this.props.game.winner, done: this.props.game.done });
  }
}
onChange(ev){
  const change = {};
  change[ev.target.name] = ev.target.value;
  this.setState(change);
}
async onSave(ev){
  ev.preventDefault();
  try {
      await this.props.update(this.props.game.id, this.state);
  }
  catch(ex){
      this.setState({ error: ex.response});
  }
}

async courtSubmit(ev){
  ev.preventDefault()
  const courts =  (await axios.get(`https://data.cityofnewyork.us/resource/9wwi-sb8x.json?$$app_token=${COURT_API}&basketball=Yes&zipcode=${this.state.zipcode}`)).data
  this.setState({courts: courts, searched: true})
}
handleInputs(ev){
  const {name, value} = ev.target
  this.setState({[name] : value})
}
handleMarkers(court){
  this.setState({location: court.objectid})
}

  render(){
    const { game, destroy } = this.props;
    const { location, finalScore, error, winner, time } = this.state;
    let { dateAndTime } = this.state;
    const { onChange, onSave} = this;
    //for some reason there are strange end characters being added to the date and time 
    // this is a temporary way of dealing with them :)
    dateAndTime = dateAndTime.slice(0, 16);

    let willPlay = true;
    if(Date.now() > game.time * 1){
      willPlay = false;
    } 

    return (
        <div>
          <form onSubmit = { onSave }>
            <pre>
                {
                    !!error && JSON.stringify(error, null, 2)
                }
            </pre>
            {willPlay ? (
              <div className='container justify-content-center'>
                <h4>This Game will be played on :</h4>
                {/* ideally this would hring up the map again not a clue how to do that might ask Taylor */}
                <p>Location</p>  
                {!this.state.searched ? (
                  <div>
                    <label htmlFor='zipcode'>Zipcode:</label>
                    <input type="text" id="zipcode" name="zipcode" onChange={this.handleInputs}/>
                    <button onClick={this.courtSubmit}>Find Courts</button>
                  </div>
                ): (
                  <div className='courtFinder'>
                    <div className= 'courtForm'>
                    <label htmlFor='court'>Court:</label>
                    <select onChange={this.handleInputs} name='location' >
                      {this.state.location !== this.state.startLocation ? (
                        <option value={this.state.location} >Court: {this.state.location}</option>
                      ): (
                        <option>Select One</option>
                      )}
                      {this.state.courts.map((court, idx)=>{
                        if(court.objectid === this.state.location){
                          return
                        }else{
                          return(<option key={idx} value={court.objectid} >Court: {court.objectid}</option>)
                        }
                      })}
                    </select>     
                    </div>
                    <div className='courtMap'>
                      <CourtMap courts={this.state.courts} handleMarkers={this.handleMarkers}/>
                    </div>
                  </div>
                )}
                <p>Current Location: {this.state.startLocation}</p>
                <br/>
                <label htmlFor='date'>Date and Time:</label>
                <hr/>
                {/* Time is a pain, there is a weird extra character on ours */}
                <input type="dateTime-local" value={ dateAndTime }  className='form-control' name="dateAndTime" onChange={ onChange }/>   
                <hr></hr>
                <h4>Please change the Time or Location</h4>
                <button className='btn btn-primary' disabled = { !location || !dateAndTime } >SAVE</button>
                
                {/* <button onClick={()=>destroy(game)}>delete this game</button> */}
              </div> 

            ) :  (
              
              <div className='container justify-content-center'>
                <h4>This game was played on: </h4> 
                <hr></hr>
                <h4>Date: { moment(game.dateAndTime).format('MMM D, YYYY') }</h4>
                <hr></hr>
                <h4>Time: { moment(game.dateAndTime).format('h:mm a') }</h4>
                <hr></hr>
                <h4>number of players: {game.users ? game.users.length : 0}</h4>               
                <hr></hr>
                <h4>Please update the final score and winner: </h4> 
                <hr></hr>
                <p>Final Score</p> 
                {/* would be better if there was error checking */}
                <input name='finalScore' value={ finalScore } className = 'form-control' onChange = { onChange }/>
                <hr/>
                {/* will make this a drop down menu of just TEAM A and TEAM B for the moment */}
                <p>Winner</p> 
                {/* <input name='winner' value={ winner } onChange = { onChange }/> */}
                <select name='winner' value={ winner } className = 'form-control' onChange = { onChange }>
                    {/* so this need to be linked with the the actual schools and I need to figure 
                    out how to do the update but one step at a time */}
                    <option value = ''>How won??</option>
                    <option value = 'TEAM A'>TEAM A</option>
                    <option value = 'TEAM B'>TEAM B</option>
                </select>
                <button className='btn btn-primary' disabled = { !finalScore || !winner }>SAVE</button>
                <hr/>
                {/* <button onClick={()=>destroy(game)}>delete this game</button> */}
              </div>
              
              
              
            )  }
            

          </form>
          <div className='container justify-content-center'>
          <h4>This will permanately delete your game</h4>  
          <button className='btn btn-danger' onClick={()=>destroy(game)}>delete this game</button>
          </div>         
        </div>            
    );
  
  }
}

const mapStateToProps = (state, otherProps) => {
  const game = state.games.hosted.find(game => game.id === otherProps.match.params.id * 1) || {};
  return {
    game, 
  };
}

const mapDispatchToProps = (dispatch, { history }) => {
  return {
    destroy: (game)=> {
      dispatch(destroyGame(game, history));
    },
    update: (id, state)=> {
      dispatch(updateGame(id, state, history));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
