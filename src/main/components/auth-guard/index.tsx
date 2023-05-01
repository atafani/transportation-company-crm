import {Flex, Spinner} from "@chakra-ui/react";
import {ACLObj, AppAbility, buildAbility} from "main/configs/acl.config";
import {getAccessToken} from "main/configs/axios.config";
import {AbilityContext} from "main/context/abilityContext";
import {useAuth} from "main/hooks";
import {useRouter} from "next/router";
import NotAuthorized from "pages/401";
import {ReactNode, useEffect, useState} from "react";
import AclGuard from "./acl-guard";

type AuthGuardProps = {
  children: ReactNode;
  authGuard: boolean;
  aclAbilities: ACLObj;
};
const AuthGuard = (props: AuthGuardProps) => {
  const {children, authGuard, aclAbilities} = props;
  const {user, authState, isAuthorized, isAuthenticated} = useAuth();
  const router = useRouter();

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (
        !getAccessToken() ||
        (!authState.isLoading && (user === null || user === undefined))
      ) {
        router.replace("/login");
      }

      if (
        !!getAccessToken() &&
        user !== null &&
        user !== undefined &&
        router.asPath === "/login"
      ) {
        user.role === "admin"
          ? router.replace("/users")
          : router.replace("/dashboard");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  );

  if (!authGuard) {
    return <>{children}</>;
  }
  if (
    authGuard &&
    authState.isLoading &&
    (user === null || user === undefined)
  ) {
    return (
      <Flex
        width={"100vw"}
        height={"100vh"}
        justifyContent='center'
        alignItems={"center"}
      >
        <Spinner />
      </Flex>
    );
  }
  return <AclGuard aclAbilities={aclAbilities}>{children}</AclGuard>;
};

export default AuthGuard;
