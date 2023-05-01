import {AppDispatch, RootState} from "./../store/index";
import {useDispatch, useSelector} from "react-redux";
import {getCustomer, getUser, login, logout} from "main/store/features/auth";
import {PermissionDTO, LoginDTO} from "main/types";
import {useRouter} from "next/router";
import {FieldValues, UseFormSetError} from "react-hook-form";
import {useAppDispatch} from "./useAppDispatch";
import {CustomerDTO} from "main/models";

const useAuth = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.auth.user);
  const customer: CustomerDTO = useSelector(
    (state: RootState) => state.auth.customer
  );
  const router = useRouter();

  const handleLogin = (data: LoginDTO) => {
    dispatch(login(data)).then((res) => {
      if (res.type === "auth/token/fulfilled") {
        handleGetCustomer();
        res.payload && res.payload.user && res.payload.user.role === "admin"
          ? router.replace("/users")
          : router.replace("/dashboard");
      }
    });
  };
  const handleLogout = () => {
    dispatch(logout()).then(() => router.replace("/login"));
  };
  const handleGetUser = () => {
    dispatch(getUser()).then(() => handleGetCustomer());
  };
  const handleGetCustomer = () => {
    dispatch(getCustomer());
  };
  // acl
  const isAuthorized = () => {
    return authState.user !== null;
  };

  const isAuthenticated = (permission: PermissionDTO) => {
    return (
      authState.user.permissions.find(
        (p: PermissionDTO) => p === permission
      ) !== null
    );
  };

  return {
    authState,
    user,
    customer,
    handleLogin,
    handleLogout,
    handleGetCustomer,
    handleGetUser,
    isAuthorized,
    isAuthenticated,
  };
};
export default useAuth;
