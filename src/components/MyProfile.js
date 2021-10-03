import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadUser, updateUser } from '../store/';


export class MyProfile extends Component{
  constructor(props) {
		super(props);
		this.state = {
			email: this.props.user ? this.props.user.email : '',
			name: this.props.user ? this.props.user.name : '' ,
			age: this.props.user ? this.props.user.age : '' ,
      height: this.props.user ? this.props.user.height : '',
      description: this.props.user ? this.props.user.description : '',
      photo: this.props.user ? this.props.user.photo : ''
      
		}
		this.onChange = this.onChange.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
	// 	// this.handleDestroy = this.handleDestroy.bind(this);
  }

  componentDidMount(){
    // this.props.bootstrap();
   
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const { users, history } = this.props;
    let user = users.single;
    
    //TODO : perform some kind of update to selected user through redux thunks
    //await axios.update("/user/:id", {...this.state})
    await this.props.updateUser({...this.state, id: user.id});
    history.push("/");
    
	}
  async onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
	}

  //Eventually, clicking on MyProfile on the navbar
  //Will send in user information to my component as props from the user who is logged in

  render(){
    const { users } = this.props;
    let user = users.single;
    const { email, name, age, height, description, photo } = this.state;
    
    return (
        <div id='user-form' className='container justify-content-center'>
          <div> 
          <h2 className='display-1 text-dark text-center'>Update My Profile</h2>
          <form onSubmit={(e) => this.handleSubmit(e, user)} >
            <div className='form-group'>
            <label htmlFor="email">Current Email : {user.email}</label>
            <hr />
            <label> New Email : </label>
            <input
							className='form-control'
							name="email"
							value={email}
              onChange={(e) => this.onChange(e)}
						/>
            <hr />
            </div>
            <div className='form-group'>
            <label htmlFor="name">Current Name : {user.name}</label>
            <hr />
            <label> New Name : </label>
            <input
							className='form-control'
							name="name"
							value={name}
              onChange={(e) => this.onChange(e)}
						/>
            <hr />
            </div>
            <div className='form-group'>
            <label htmlFor="age"> Age : {user.age}</label>
            <hr />
            </div>
            <div className='form-group'>
            <label htmlFor="height"> Height : {user.height}</label>
            <hr />
            <label> Updated Height : </label>
            <input
							className='form-control'
							name="height"
							value={height}
              onChange={(e) => this.onChange(e)}
						/>
            <hr />
            </div>
            <div className='form-group'>
            <label htmlFor="description"> Description : {user.description}</label>
            <hr />
            <label> Update Description : </label>
            <input
							className='form-control'
							name="description"
							value={description}
              onChange={(e) => this.onChange(e)}
						/>
            <hr />
            </div>
            <div className='form-group'>
            <label htmlFor="photo"> Current Photo : <img style={{ height:"100px", width:"100px" }} src={user.photo}></img> </label>
            <hr />
            <label> New Photo : </label>
            <input
							className='form-control'
							name="photo"
							value={photo}
              onChange={(e) => this.onChange(e)}
						/>
            <hr />
            </div>                    
          <div id='user-form-buttons'>
						<button
							type='submit'
							className='btn btn-primary'
              >
							Submit Update </button>
					
					</div>
          </form>
          
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
}


const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (user) => dispatch(updateUser(user)),
    bootstrap: ()=> {
      dispatch(loadUser(4));
    }
  };
}



export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
