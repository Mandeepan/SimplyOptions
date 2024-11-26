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

const initialState={allInstruments:[]}
function instrumentsReducer(state=initialState,action){
    switch (action.type) {
        case GET_ALL_INS:
            return { ...state, allInstruments: normalizer(action.payload) };
        default:
            return state;
    }
}

export default instrumentsReducer