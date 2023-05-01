import {Box} from "@chakra-ui/react";
import {useAuth} from "main/hooks";
import {ReactNode, useState} from "react";
import AppBar from "./components/appbar";
import SideBar from "./components/sidebar";

import PerfectScrollbar from "react-perfect-scrollbar";
type LayoutProps = {
  children: ReactNode;
};

const Layout = (props: LayoutProps) => {
  const {children} = props;
  const [navHidden, setNavHidden] = useState(true);
  const [navFixed, setNavFixed] = useState(true);
  const [navHover, setNavHover] = useState(false);

  const {user, handleLogout} = useAuth();

  const handleOpenMenu = () => {
    setNavHidden(false);
  };
  const handleCloseMenu = () => {
    setNavHidden(true);
  };

  return (
    user && (
      <Box minH={"100vh"} bg='gray.50'>
        <SideBar
          hidden={navHidden}
          userRole={user.role}
          fixed={navFixed}
          navHover={navHover}
          setFixed={setNavFixed}
          setNavHover={setNavHover}
          handleCloseMenu={handleCloseMenu}
          setHidden={setNavHidden}
        />
        <AppBar
          userName={user.name}
          userRole={user.role}
          handleLogout={handleLogout}
          handleOpenMenu={handleOpenMenu}
          fixed={navFixed}
        />

        <Box ml={{base: 0, md: navFixed ? 60 : 20}} p={{base: 0, md: 8}}>
          {children}
        </Box>
      </Box>
    )
  );
};
export default Layout;
