import axios, {AxiosError} from "axios";
import {GetServerSidePropsContext} from "next";
import Router from "next/router";
import {toast} from "react-toastify";

type Token = {
  plain_token: string;
  expires: number;
};

const storageTokenKeyName = "access_token";
const storageRefreshTokenKeyName = "refresh_token";

let context: GetServerSidePropsContext;
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL!;

const setToken = (access_token: Token, refresh_token: Token) => {
  localStorage.setItem(storageTokenKeyName, JSON.stringify(access_token));
  localStorage.setItem(
    storageRefreshTokenKeyName,
    JSON.stringify(refresh_token)
  );
};

export const clearToken = () => {
  localStorage.removeItem(storageTokenKeyName);
  localStorage.removeItem(storageRefreshTokenKeyName);
  Router.replace("/login");
};

export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem(storageTokenKeyName);
    const access_token: Token | null = accessToken
      ? JSON.parse(accessToken)
      : null;
    if (access_token) {
      const isTokenExpired: boolean = checkTokenExpiration(access_token);
      if (!isTokenExpired) return access_token.plain_token;
    }
  }
};

export const setContext = (_context: GetServerSidePropsContext) => {
  context = _context;
};

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(storageTokenKeyName);
  const refreshToken = localStorage.getItem(storageRefreshTokenKeyName);

  const access_token: Token | null = accessToken
    ? JSON.parse(accessToken)
    : null;
  const refresh_token: Token | null = refreshToken
    ? JSON.parse(refreshToken)
    : null;

  if (config && config.headers && config.url?.includes("auth/refresh-token")) {
    if (refresh_token) {
      config.headers.Authorization = `Bearer ${refresh_token.plain_token}`;
      return config;
    }
  }

  if (access_token && config && config.headers) {
    config.headers.Authorization = `Bearer ${access_token.plain_token}`;
    config.headers["Access-Control-Allow-Origin"] = "*";
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response?.config?.url?.includes("auth/token")) {
      setToken(
        response.data.data.access_token,
        response.data.data.refresh_token
      );
    }
    return response.data.data;
  },
  (error: AxiosError<any>) => {
    // check conditions to refresh token
    if (
      error.response?.status === 401 &&
      !error.response?.config?.url?.includes("auth/refresh-token") &&
      !error.response?.config?.url?.includes("auth/token")
    ) {
      return refreshToken(error);
    } else {
      if (error.response?.status === 401) {
        clearToken();
        return;
      }
      toast.error(error.response?.data?.message);
    }
    return Promise.reject(error);
  }
);

let fetchingToken = false;
let subscribers: ((token: string) => any)[] = [];

const onAccessTokenFetched = (token: string) => {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
};

const addSubscriber = (callback: (token: string) => any) => {
  subscribers.push(callback);
};

const refreshToken = async (oError: AxiosError) => {
  try {
    const {response} = oError;

    // create new Promise to retry original request
    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber((token: string) => {
        if (response! && response!.config && response!.config.headers)
          response!.config.headers["Authorization"] = `Bearer ${token}`;
        resolve(axios(response!.config));
      });
    });

    const refreshToken = localStorage.getItem(storageRefreshTokenKeyName);
    const refresh_token: Token | null = refreshToken
      ? JSON.parse(refreshToken)
      : null;
    // check whether refreshing token or not
    if (!fetchingToken && refresh_token) {
      fetchingToken = true;

      // refresh token
      const response: any = await api.post("auth/refresh-token", null, {
        headers: {
          Authorization: `Bearer ${refresh_token.plain_token}`,
        },
      });
      if (response && response.access_token && response.refresh_token) {
        setToken(response.access_token, response.refresh_token);
      } else {
        clearToken();
      }
      // when new token arrives, retry old requests
      onAccessTokenFetched(response.access_token.plain_token);
    } else {
      clearToken();
    }
    return retryOriginalRequest;
  } catch (error) {
    // on error go to login page
    if (!Router.asPath.includes("auth/token")) {
      clearToken();
    }

    return Promise.reject(oError);
  } finally {
    fetchingToken = false;
  }
};
const checkTokenExpiration = (token?: Token | null) => {
  if (!token) return true;
  const now = Math.round(new Date().getTime() / 1000);
  return token.expires <= now;
};
