

// getting a company
const GET_A_COMPANY ='companies/getACompany'

const getACompany= (companyObjectData) => ({
  type: GET_A_COMPANY,
  payload : companyObjectData
})

export const getACompanyThunk= (companyId) => async (dispatch) => {
    const res = await fetch(`/api/companies/${companyId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getACompany(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};

// add a company
const ADD_A_COMPANY = 'companies/addACompany'

const addACompany = (companyObjectData) => ({
    type: ADD_A_COMPANY,
    payload : companyObjectData
})

export const addACompanyThunk= (requestData) => async (dispatch) => {
    const res = await fetch(`/api/companies`,{
        method :'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(addACompany(data));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
};



// update a company
const UPDATE_A_COMPANY = 'companies/updateACompany'

const updateACompany = (companyObjectData) => ({
    type: UPDATE_A_COMPANY,
    payload : companyObjectData
})

export const updateACompanyThunk= (companyId, requestData) => async (dispatch) => {
    const res = await fetch(`/api/companies/${companyId}`,{
        method :'PATCH',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(updateACompany(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};

// delete a company
const DELETE_A_COMPANY = 'companies/deleteACompany'

const deleteACompany = (companyObjectData) => ({
    type: DELETE_A_COMPANY,
    payload : companyObjectData
})

export const deleteACompanyThunk= (companyId) => async (dispatch) => {
    const res = await fetch(`/api/companies/${companyId}`,{
        method :'DELETE',
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(deleteACompany(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};


const initialState={currentCompany:{}}
function companyReducer(state=initialState,action){
    switch (action.type) {
        case GET_A_COMPANY:
            return { ...state, currentCompany: action.payload };
        case ADD_A_COMPANY:
            return { ...state, currentCompany: action.payload };
        case UPDATE_A_COMPANY:
            return { ...state, currentCompany: action.payload };
        case DELETE_A_COMPANY:
            return { ...state, currentCompany: {} };
        default:
            return state;
    }
}

export default companyReducer