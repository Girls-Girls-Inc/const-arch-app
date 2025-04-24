import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";

const store = createStore(
  combineReducers({ authReducer }),
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
