
// getting all transactions by company ID 
const GET_ALL_TRN_BY_COMP_ID ='transactions/companies/companyId'

const getAllTransactionsForACompany = (transactions) => ({
    type: GET_ALL_TRN_BY_COMP_ID,
    payload : transactions
})

export const getAllTransactionsForACompanyThunk= (companyId) => async (dispatch) => {
    const res = await fetch(`/api/transactions/companies/${companyId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllTransactionsForACompany(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};


// getting all transactions by user ID 
const GET_ALL_TRN_BY_USER_ID ='transactions/users/userId'

const getAllTransactionsForAUser= (transactions) => ({
    type: GET_ALL_TRN_BY_USER_ID,
    payload : transactions
})

export const getAllTransactionsForAUserThunk= (userId) => async (dispatch) => {
    const res = await fetch(`/api/transactions/users/${userId}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(getAllTransactionsForAUser(data));
    } else {
        const errors = await res.json();
        return errors;
    }
};


// add a new transaction
const ADD_A_TRN = 'transactions/addATransaction'

const addATransaction = (TransactionObjectData) => ({
    type: ADD_A_TRN,
    payload : TransactionObjectData
})

export const addATransactionThunk= (requestData) => async (dispatch) => {
    const res = await fetch(`/api/transactions/`,{
        method :'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(addATransaction(data));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
};

// update a transaction
const UPDATE_A_TRN = 'transactions/updateATransaction'

const updateATransaction = (transactionObjectData) => ({
    type:UPDATE_A_TRN,
    payload : transactionObjectData
})

export const updateATransactionThunk= (transactionId, requestData) => async (dispatch) => {
    const res = await fetch(`/api/transactions/${transactionId}`,{
        method :'PATCH',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(updateATransaction(data));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
};


// cancel a transaction
const DELETE_A_TRN = 'transactions/deleteATransaction'

const deleteATransaction = (transactionObjectData) => ({
    type: DELETE_A_TRN,
    payload : transactionObjectData
})

export const deleteATransactionThunk= (transactionId) => async (dispatch) => {
    const res = await fetch(`/api/transactions/${transactionId}`,{
        method :'DELETE',
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(deleteATransaction(data));
        return data
    } else {
        const errors = await res.json();
        return errors;
    }
};

const initialState={companyPendingTransactions:[],companyNonPendingTransactions:[], userTransactions:[], currentTransaction:{}}
function transactionsReducer(state=initialState,action){
    switch (action.type) {
        case GET_ALL_TRN_BY_COMP_ID:
            return { ...state, 
                    companyPendingTransactions: action.payload.pending_transactions,
                    companyNonPendingTransactions: action.payload.non_pending_transactions   };
        case GET_ALL_TRN_BY_USER_ID:
            return {...state, userTransactions:action.payload.transactions}
        case ADD_A_TRN:
            return {...state, currentTransactions:action.payload}
        case UPDATE_A_TRN:
            return {...state, currentTransactions:action.payload}
        case DELETE_A_TRN:
            return {...state, currentTransactions:{}}
        default:
            return state;
    }
}

export default transactionsReducer
