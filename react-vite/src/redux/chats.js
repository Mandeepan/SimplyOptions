export const ADD_USER_MESSAGE = 'ADD_USER_MESSAGE';
export const ADD_BOT_MESSAGE = 'ADD_BOT_MESSAGE';
export const FETCH_CHAT_RESPONSE_REQUEST = 'FETCH_CHAT_RESPONSE_REQUEST';
export const FETCH_CHAT_RESPONSE_SUCCESS = 'FETCH_CHAT_RESPONSE_SUCCESS';
export const FETCH_CHAT_RESPONSE_FAILURE = 'FETCH_CHAT_RESPONSE_FAILURE';

export const addUserMessage = (message) => ({
    type: ADD_USER_MESSAGE,
    payload: message,
});

export const addBotMessage = (message) => ({
    type: ADD_BOT_MESSAGE,
    payload: message,
    });

export const fetchChatResponseRequest = () => ({
    type: FETCH_CHAT_RESPONSE_REQUEST,
});

export const fetchChatResponseSuccess = (message) => ({
    type: FETCH_CHAT_RESPONSE_SUCCESS,
    payload: message,
});

export const fetchChatResponseFailure = (error) => ({
    type: FETCH_CHAT_RESPONSE_FAILURE,
    payload: error,
});


export const fetchChatResponse = (requestDataObject) => async (dispatch) => {
    dispatch(fetchChatResponseRequest());
    try {
        const response = await fetch('/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestDataObject),
        });
        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
        }

        dispatch(fetchChatResponseSuccess(data.message));
    } catch (error) {
        dispatch(fetchChatResponseFailure(error.message));
        throw error
    }
};




const initialState = {
    messages: [],
    loading: false,
    error: null,
};

const chatReducer = (state = initialState, action) => {
switch (action.type) {
    case ADD_USER_MESSAGE:
        return {
            ...state,
            messages: [...state.messages, { role: 'user', content: action.payload }],
        };
    case ADD_BOT_MESSAGE:
        return {
            ...state,
            messages: [...state.messages, { role: 'bot', content: action.payload }],
        };
    case FETCH_CHAT_RESPONSE_REQUEST:
        return {
            ...state,
            loading: true,
            error: null,
        };
    case FETCH_CHAT_RESPONSE_SUCCESS:
        return {
            ...state,
            loading: false,
            messages: [...state.messages, { role: 'bot', content: action.payload }],
        };
    case FETCH_CHAT_RESPONSE_FAILURE:
        return {
            ...state,
            loading: false,
            error: action.payload,
        };
    default:
    return state;
}
};

export default chatReducer;