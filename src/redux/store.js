import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./auth";

export default configureStore(
  {
    reducer: {
      auth: AuthReducer,
    },
  },
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
