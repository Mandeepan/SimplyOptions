
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

const initialState={companyPendingTransactions:[],companyNonPendingTransactions:[], userTransactions:[]}
function transactionsReducer(state=initialState,action){
    switch (action.type) {
        case GET_ALL_TRN_BY_COMP_ID:
            return { ...state, 
                    companyPendingTransactions: action.payload.pending_transactions,
                    companyNonPendingTransactions: action.payload.non_pending_transactions   };
        case GET_ALL_TRN_BY_USER_ID:
            return {...state, userTransactions:action.payload.transactions}
        default:
            return state;
    }
}

export default transactionsReducer
