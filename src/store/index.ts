import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import user from './reducer/user';
import message from './reducer/message';

const reducer = combineReducers({
  user,
  message,
});

export default createStore(reducer, applyMiddleware(thunkMiddleware));
