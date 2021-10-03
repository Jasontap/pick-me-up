import axios from 'axios';
import faker from 'faker';

const LOAD_USERS = 'LOAD_USERS';
const LOAD_USER = 'LOAD_USER';
const CREATE_USER = 'CREATE_USER';
const DESTROY_USER = 'DESTROY_USER';
const UPDATE_USER = 'UPDATE_USER';


const intialState = {all: [], single: {}}

const usersReducer = (state = intialState, action) =>{
    if (action.type === LOAD_USERS){
        state.all = action.users
    }
    if (action.type === LOAD_USER){
        state.single = action.user
    }
    // these thre have yet to be tested LOAD_USER works fine
    if (action.type === CREATE_USER){
        state['all'] = [...state, action.user]
    }
    if (action.type === DESTROY_USER){
        state['all'] = state.filter(user => user.id !== action.user.id);
    }
    if (action.type === UPDATE_USER){
        state['all'] = state['all'].map(user => user.id !== action.user.id ? user : action.user);
    }

    return {...state};
}


//THUNKS****************************************

const _loadUsers = (users) =>{
    return {
        type: LOAD_USERS,
        users
    };
};

export const loadUsers = () =>{
    return async(dispatch)=>{
        const users = (await axios.get('/api/users')).data;
        dispatch(_loadUsers(users));
    }
};

const _loadUser = (user) =>{
    return {
        type: LOAD_USER,
        user
    };
};

export const loadUser = (userId) =>{
    return async(dispatch)=>{
        const user = (await axios.get(`/api/users/${userId}`)).data;
        //so we don't load password into the store 
        const clone = Object.assign({}, user, {password: undefined});
        dispatch(_loadUser(clone));
    }
};

export const loadUserWToken = (token) =>{
    return async(dispatch)=>{
        // there is probably a better way to do this but this seems to work 
        const user = (await axios.get(`/api/users/token/null?pickmeup-token=${token}`)).data;
        //so we don't load password into the store 
        const clone = Object.assign({}, user, {password: undefined});
        dispatch(_loadUser(clone));
    }
};

export const clearUser = () =>{
    return async(dispatch)=>{
        dispatch(_loadUser({}));
        //history.push('/');
    }
};


const _createUser = (user) =>{
    return {
        type: CREATE_USER,
        user
    };
};

// just the generic structure not actually working
export const createUser = (data, history)=>{
    return async(dispatch)=>{
        let user = (await axios.post('/api/users', { data })).data;
        dispatch(_createUser(user));
        history.push(`/user/${user.id}`)
    }
}

//using this for testing purposes. will need to remove when we can login as a user
export const createRandomUser = ()=>{
    return async(dispatch)=>{
        let age = Math.floor(Math.random() * 20 + 16);
        let description = faker.lorem.sentence();
        let email = "test"+Math.ceil(Math.random() * 100)+"@email.com";
        let height = Math.ceil(Math.random() * 3 + 4) + '\'';
        let name = faker.name.lastName();
        let user = (await axios.post('/api/users', { age, description, email, height, name })).data;
        dispatch(_createUser(user));
        // history.push(`/user/${user.id}`)
    }
}


//might want to stop people from completely deleting the account as it will mess up 
// the records of the games they have played, not really sure
const _destroyUser = user =>({ type: DESTROY_USER, user});

export const destroyUser = (user, history)=>{
    return async(dispatch)=>{
        await axios.delete(`/api/users/${user.id}`)
        dispatch(_destroyUser(user))
        history.push('/users')
    }
}

const _updateUser = user =>({ type: UPDATE_USER, user});

//the change was not showing up in the database but not in the component so just vopied the code from loadUser
export const updateUser = ( user )=>{
    return async(dispatch)=>{
        const singleUser = (await axios.put(`/api/users/update/${user.id}`, user )).data;
        const clone = Object.assign({}, singleUser, {password: undefined});
        dispatch(_loadUser(clone));
    }
}


export { usersReducer };
