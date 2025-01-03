
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


// getting all listings by instrtument ID 
const GET_ALL_LIST_BY_INS_ID ='listings/instruments/instrumentId'

const getAllListingsForAnInstrument= (listings) => ({
    type: GET_ALL_LIST_BY_INS_ID,
    payload : listings
})

export const getAllListingsForAnInstrumentThunk= (instrumentId) => async (dispatch) => {
    const res = await fetch(`/api/listings/instruments/${instrumentId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllListingsForAnInstrument(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};

// add a new listing
const ADD_A_LISTING = 'listings/addAListing'

const addAListing = (ListingObjectData) => ({
    type: ADD_A_LISTING,
    payload : ListingObjectData
})

export const addAListingThunk= (instrumentId, requestData) => async (dispatch) => {
    const res = await fetch(`/api/listings/instruments/${instrumentId}`,{
        method :'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(addAListing(data));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
};


// update a listing
const UPDATE_A_LISTING= 'listings/updateAListing'

const updateAListing = (listingObjectData) => ({
    type: UPDATE_A_LISTING,
    payload : listingObjectData
})

export const updateAListingThunk= (listingId, requestData) => async (dispatch) => {
    const res = await fetch(`/api/listings/${listingId}`,{
        method :'PATCH',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(updateAListing(data));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
};

// delete a listing
const DELETE_A_LISTING = 'listings/deleteAListing'

const deleteAListing = (listingObjectData) => ({
    type: DELETE_A_LISTING,
    payload : listingObjectData
})

export const deleteAListingThunk= (listingId) => async (dispatch) => {
    const res = await fetch(`/api/listings/${listingId}`,{
        method :'DELETE',
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(deleteAListing(data));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
};


const initialState={userListings:[], instrumentListings:[], currentListing:{}}
function listingsReducer(state=initialState,action){
    switch (action.type) {
        case GET_ALL_LIST_BY_USER_ID:
            return {...state, userListings:action.payload.listings}
        case GET_ALL_LIST_BY_INS_ID:
            return {...state, instrumentListings:action.payload.listings}
        case ADD_A_LISTING:
            return {...state, currentListing:action.payload}
        case UPDATE_A_LISTING:
            return {...state, currentListing:action.payload}
        case DELETE_A_LISTING:
            return {...state, currentListing:{}}
        default:
            return state;
    }
}

export default listingsReducer