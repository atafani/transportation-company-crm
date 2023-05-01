import {Box, Text, CloseButton, Flex, Icon, IconButton} from "@chakra-ui/react";
import {
  getNavigationContent,
  NavItemType,
} from "main/configs/navigation.config";
import {useRef} from "react";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import PerfectScrollbar from "react-perfect-scrollbar";
import NavItem from "./navitem";

type SideBarProps = {
  hidden: boolean;
  setHidden: (value: boolean) => void;
  fixed: boolean;
  setFixed: (value: boolean) => void;
  navHover: boolean;
  setNavHover: (value: boolean) => void;
  userRole: string;
  handleCloseMenu: () => void;
};

const SideBar = (props: SideBarProps) => {
  const {
    hidden,
    userRole,
    fixed,
    navHover,
    setFixed,
    setNavHover,
    handleCloseMenu,
    setHidden,
  } = props;

  return (
    <Box
      transition={"0.5s ease"}
      position={"fixed"}
      top={0}
      left={0}
      w={{base: hidden ? 0 : "full", md: fixed || navHover ? 60 : 20}}
      height='full'
      zIndex={999}
      bg='#fff'
      shadow={"md"}
      pb={15}
      onMouseEnter={() => {
        setNavHover(true);
      }}
      onMouseLeave={() => {
        setNavHover(false);
      }}
    >
      <Flex
        transition={"0.2s ease"}
        h='20'
        alignItems='center'
        mx='5'
        justifyContent='space-between'
        visibility={{base: hidden ? "hidden" : "visible", md: "visible"}}
      >
        <Text fontSize='xl' fontFamily='monospace' fontWeight='bold'>
          TBM
        </Text>
        <IconButton
          size={"sm"}
          variant='ghost'
          colorScheme='teal'
          aria-label='toggle-nav'
          icon={<Icon as={fixed ? IoIosArrowBack : IoIosArrowForward} />}
          display={{base: "none", md: "flex"}}
          sx={{opacity: fixed || navHover ? 1 : 0}}
          onClick={() => {
            setFixed(!fixed);
          }}
        />
        <CloseButton
          display={{base: "block", md: "none"}}
          onClick={handleCloseMenu}
        />
      </Flex>
      <PerfectScrollbar options={{wheelPropagation: false}}>
        {getNavigationContent(userRole).map((link: NavItemType) => (
          <NavItem
            key={link.name}
            {...link}
            fixed={fixed}
            navHover={navHover}
            setHidden={setHidden}
          />
        ))}
      </PerfectScrollbar>
    </Box>
  );
};
export default SideBar;
