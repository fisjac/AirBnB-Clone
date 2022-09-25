import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import sessionReducer from './session'
import spotReducer from './spots';
import reviewsReducer from './reviews';


const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotReducer,
  reviews: reviewsReducer
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
  const composeEnhancers = compose;
  // window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; //delete when finished
  const logger = require('redux-logger').default; //delete when finished
  enhancer = composeEnhancers(applyMiddleware(thunk, logger)); //delete when finished
  // enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}


const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
