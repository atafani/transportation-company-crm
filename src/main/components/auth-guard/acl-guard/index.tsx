import {Flex, Spinner} from "@chakra-ui/react";
import {ACLObj, AppAbility, buildAbility} from "main/configs/acl.config";
import {AbilityContext} from "main/context/abilityContext";
import {useAuth} from "main/hooks";
import {useRouter} from "next/router";
import NotAuthorized from "pages/401";
import {ReactNode, useEffect, useState} from "react";

type AclGuardProps = {
  children: ReactNode;
  aclAbilities: ACLObj;
};
const AclGuard = (props: AclGuardProps) => {
  const {children, aclAbilities} = props;
  const {user, isAuthorized, isAuthenticated} = useAuth();

  const router = useRouter();

  const [ability, setAbility] = useState<AppAbility | undefined>(undefined);

  if (
    router.route === "/404" ||
    router.route === "/500" ||
    router.route === "/"
  ) {
    return <>{children}</>;
  }
  // User is logged in, build ability for the user based on his role
  if (user && !ability) {
    setAbility(buildAbility(user.role));
  }
  // Check the access of current user and render pages
  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return (
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    );
  }

  // Render Not Authorized component if the current user has limited access
  return <NotAuthorized />;
};

export default AclGuard;
