import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import user from './reducer/user';

const reducer = combineReducers({
  user,
});

export default createStore(reducer, applyMiddleware(thunkMiddleware));
