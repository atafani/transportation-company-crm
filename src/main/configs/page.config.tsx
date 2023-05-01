import {NextPage} from "next";
import {ReactElement, ReactNode} from "react";
import {ACLObj} from "./acl.config";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  authGuard?: boolean;
  acl?: ACLObj;
};
