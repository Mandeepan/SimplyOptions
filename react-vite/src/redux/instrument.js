import { normalizer } from './utils';


// getting all instruments
const GET_ALL_INS ='instruments/getAllInstruments'

const getAllInstruments = (instruments) => ({
  type: GET_ALL_INS,
  payload : instruments
})

export const getAllInstrumentsThunk= () => async (dispatch) => {
  const res = await fetch('/api/instruments');
  if (res.ok) {
      const data = await res.json();
    //   console.log("API Response: ", data);
      dispatch(getAllInstruments(data.instruments));
  } else {
      const errors = await res.json();
      return errors;
  }
};

//get an instrument by instrument ID
const GET_AN_INSTRUMENT ='instruments/getAnInstrument'

const getAnInstrument = (instrumentObjectData) => ({
  type: GET_AN_INSTRUMENT,
  payload : instrumentObjectData
})

export const getAnInstrumentThunk= (instrumentId) => async (dispatch) => {
    const res = await fetch(`/api/instruments/${instrumentId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getAnInstrument(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};




// add a new instrument
const ADD_AN_INSTRUMENT = 'instruments/addAInstrument'

const addAnInstrument = (instrumentObjectData) => ({
    type: ADD_AN_INSTRUMENT,
    payload : instrumentObjectData
})

export const addAnInstrumentThunk= (requestData) => async (dispatch) => {
    const res = await fetch(`/api/instruments/`,{
        method :'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(addAnInstrument(data));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
};

// update an instrument
const UPDATE_AN_INSTRUMENT = 'instruments/updateAnInstrument'

const updateAnInstrument = (instrumentObjectData) => ({
    type: UPDATE_AN_INSTRUMENT,
    payload : instrumentObjectData
})

export const updateAnInstrumentThunk= (instrumentId, requestData) => async (dispatch) => {
    const res = await fetch(`/api/instruments/${instrumentId}`,{
        method :'PATCH',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(updateAnInstrument(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};


// delete an instrument
const DELETE_AN_INSTRUMENT = 'instruments/deleteAnInstrument'

const deleteAnInstrument = (instrumentObjectData) => ({
    type: DELETE_AN_INSTRUMENT,
    payload : instrumentObjectData
})

export const deleteAnInstrumentThunk= (instrumentId) => async (dispatch) => {
    const res = await fetch(`/api/instruments/${instrumentId}`,{
        method :'DELETE',
    });
    console.log("API response: ============")
    console.log(res)
    if (res.ok) {
        const data = await res.json();
        dispatch(deleteAnInstrument(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};


const initialState={allInstruments:[],currentInstrument:{}}
function instrumentsReducer(state=initialState,action){
    switch (action.type) {
        case GET_ALL_INS:
            return { ...state, allInstruments: normalizer(action.payload) };
        case GET_AN_INSTRUMENT:
            return { ...state, currentInstrument:action.payload}
            case ADD_AN_INSTRUMENT:
            return { ...state, currentInstrument:action.payload}
        case UPDATE_AN_INSTRUMENT:
            return { ...state, currentInstrument:action.payload}
        case DELETE_AN_INSTRUMENT:
            return { ...state, currentInstrument:{}}
        default:
            return state;
    }
}

export default instrumentsReducer