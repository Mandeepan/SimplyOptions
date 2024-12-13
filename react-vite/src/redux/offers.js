
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

//get all offers by instrument ID
const GET_ALL_OFFER_BY_INS_ID ='offerings/instruments/instrumentId'

const getAllOffersForAnInstrument= (offers) => ({
    type: GET_ALL_OFFER_BY_INS_ID,
    payload : offers
})

export const getAllOffersForAnInstrumentThunk= (instrumentId) => async (dispatch) => {
    const res = await fetch(`/api/offerings/instruments/${instrumentId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllOffersForAnInstrument(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};

// add a new offer
const ADD_AN_OFFER = 'offers/addAnOffer'

const addAnOffer = (OfferObjectData) => ({
    type: ADD_AN_OFFER,
    payload : OfferObjectData
})

export const addAnOfferThunk= (instrumentId, requestData) => async (dispatch) => {
    const res = await fetch(`/api/offerings/instruments/${instrumentId}`,{
        method :'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(addAnOffer(data));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
};


// update an offer
const UPDATE_AN_OFFER = 'offerings/updateAnOffer'

const updateAnOffer = (offerObjectData) => ({
    type: UPDATE_AN_OFFER,
    payload : offerObjectData
})

export const updateAnOfferThunk= (offerId, requestData) => async (dispatch) => {
    const res = await fetch(`/api/offerings/${offerId}`,{
        method :'PATCH',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(updateAnOffer(data));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
};

const initialState={userOffers:[], instrumentOffers:[], currentOffer:{}}
function OffersReducer(state=initialState,action){
    switch (action.type) {
        case GET_ALL_OFFER_BY_USER_ID:
            return {...state, userOffers:action.payload.offerings}
        case GET_ALL_OFFER_BY_INS_ID:
            return {...state, instrumentOffers:action.payload.offerings}
        case ADD_AN_OFFER:
            return {...state, currentOffer:action.payload}
        case UPDATE_AN_OFFER:
            return {...state, currentOffer:action.payload}
        default:
            return state;
    }
}

export default OffersReducer