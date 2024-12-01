

// getting a user
const GET_A_USER ='users/getUser'

const getAUser= (userObjectData) => ({
  type: GET_A_USER,
  payload : userObjectData
})

export const getAUserThunk= (userId) => async (dispatch) => {
  const res = await fetch(`/api/users/${userId}`);
  if (res.ok) {
      const data = await res.json();
      dispatch(getAUser(data));
  } else {
      const errors = await res.json();
      return errors;
  }
};

// update a user
const UPDATE_A_USER = 'users/updateUser'

const updateAUser = (userObjectData) => ({
    type: UPDATE_A_USER,
    payload : userObjectData
})

export const updateAUserThunk= (userId, requestData) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}`,{
        method :'PATCH',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(updateAUser(data));
        return data
    } else {
        const errors = await res.json();
        console.log("API Response on PATCH users/:userId: ",errors)
        return errors;
    }
};

// delete a user
const DELETE_A_USER = 'users/deleteAUser'

const deleteAUser = (UserObjectData) => ({
    type: DELETE_A_USER,
    payload : UserObjectData
})

export const deleteAUserThunk= (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}`,{
        method :'DELETE',
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(deleteAUser(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};



const initialState={currentUser:{}}
function userReducer(state=initialState,action){
    switch (action.type) {
        case GET_A_USER:
            return { ...state, currentUser: action.payload };
        case UPDATE_A_USER:
            return { ...state, currentUser: action.payload };
        case DELETE_A_USER:
            return { ...state, currentUser:{}}
        default:
            return state;
    }
}

export default userReducer