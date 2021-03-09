import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import store from './store/index';
import { MyStats, MyProfile, RequestForm } from './components';
import { loadRequests, loadGames, loadUsers } from './store/';


class _App extends Component{
  constructor(){
    super();
    this.state = {};
  }

  componentDidMount(){
    this.props.bootstrap();
  }


  //this works fine now need to figure out how to put my data into Material UI table and add search
  render(){
    console.log(this.props)
    return (
        <div>
          <MyStats />
          <MyProfile/>
          {/* so you need to be hooked  */}
          <RequestForm />
        </div>
    );
  }
}

// not sure if I need either of these maybe if I want length??
const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    bootstrap: ()=> {
      dispatch(loadUsers());
      dispatch(loadRequests());
      dispatch(loadGames());
    }
  };
}

const App = connect(mapStateToProps, mapDispatchToProps)(_App);

render(<Provider store = {store}><App /></Provider>, document.querySelector('#root'));
