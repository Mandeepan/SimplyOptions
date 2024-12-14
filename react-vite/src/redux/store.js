import {
    legacy_createStore as createStore,
    applyMiddleware,
    compose,
    combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import instrumentsReducer from './instrument';
import userReducer from './user';
import companyReducer from './company';
import transactionsReducer from './transaction';
import listingsReducer from './listings';
import OffersReducer from './offers';
import chatReducer from './chats';

const rootReducer = combineReducers({
    session: sessionReducer,
    instruments: instrumentsReducer,
    currentUser: userReducer,
    currentCompany: companyReducer,
    transactions: transactionsReducer,
    listings: listingsReducer,
    offers: OffersReducer,
    chats: chatReducer
});

let enhancer;
if (import.meta.env.MODE === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = (await import('redux-logger')).default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
