
// getting all offers by user ID 
const GET_ALL_OFFER_BY_USER_ID ='offerings/users/userId'

const getAllOffersForAUser= (offers) => ({
    type: GET_ALL_OFFER_BY_USER_ID,
    payload : offers
})

export const getAllOffersForAUserThunk= (userId) => async (dispatch) => {
    const res = await fetch(`/api/offerings/users/${userId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllOffersForAUser(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};

const initialState={userOffers:[]}
function OffersReducer(state=initialState,action){
    switch (action.type) {
        case GET_ALL_OFFER_BY_USER_ID:
            return {...state, userOffers:action.payload.offerings}
        default:
            return state;
    }
}

export default OffersReducer