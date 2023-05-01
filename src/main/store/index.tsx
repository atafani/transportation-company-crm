// ** Toolkit imports
import {configureStore} from "@reduxjs/toolkit";
import {getAccessToken} from "main/configs/axios.config";

// ** Reducers
import {auth} from "main/store/features";
import {getCustomer, getUser} from "./features/auth";

const initStore = () => {
  const store = configureStore({
    reducer: {
      auth,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  !!getAccessToken() &&
    store
      .dispatch<any>(getUser())
      .then(() => store.dispatch<any>(getCustomer()));
  return store;
};
export const store = initStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
