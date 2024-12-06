
// getting all listings by user ID 
const GET_ALL_LIST_BY_USER_ID ='listings/users/userId'

const getAllListingsForAUser= (listings) => ({
    type: GET_ALL_LIST_BY_USER_ID,
    payload : listings
})

export const getAllListingsForAUserThunk= (userId) => async (dispatch) => {
    const res = await fetch(`/api/listings/users/${userId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllListingsForAUser(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};

const initialState={userListings:[]}
function listingsReducer(state=initialState,action){
    switch (action.type) {
        case GET_ALL_LIST_BY_USER_ID:
            return {...state, userListings:action.payload.listings}
        default:
            return state;
    }
}

export default listingsReducer