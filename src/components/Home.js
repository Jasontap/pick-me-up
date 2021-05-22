import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";


class Home extends Component{
  render(){    
    const { user } = this.props;

    return (
      <div >
        <center>
          { user.name ? (
            <p>Hello, { user.name }!</p>
          ) : (
            <p>Welcome stranger</p>
          )}
        </center>
        <center>
          <div id= 'pick-up'className='border text-center mb-3 home-hover' style={{ width: 275 + 'px' }, { fontSize: 3 + 'rem' }} > 
            <Link className='nav nav-link text-dark card-body '  to='/request'>Pick Up</Link>
          </div>
        </center>
        <div className='border text-center mb-3 home home-hover'> 
          <Link className=' border nav-link text-dark card-body ' to='/games'>Find a Game</Link>
          <Link  className=' border nav-link text-dark card-body ' to='/mygames'>My Games</Link>
        </div>
      </div>
    );
  };
};


const mapState = ({ users }) => {
  return {
    user: users.single
  };
};

const mapDispatch = () => {
  return {};
};

export default connect(mapState, mapDispatch)(Home);

