import {
  Avatar,
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorModeValue,
  VStack,
  Text,
  IconButton,
  CloseButton,
} from "@chakra-ui/react";
import {Breadcrumbs} from "main/components";
import {getNavigationContent} from "main/configs/navigation.config";
import {FiMenu} from "react-icons/fi";
import Link from "next/link";

type AppBarProps = {
  fixed: boolean;
  userName: string;
  userRole: string;
  handleLogout: () => void;
  handleOpenMenu: () => void;
};
const AppBar = (props: AppBarProps) => {
  const {fixed, userName, userRole, handleLogout, handleOpenMenu} = props;
  return (
    <Flex
      justifyContent={"space-between"}
      ml={{base: 0, md: fixed ? 60 : 20}}
      alignItems='center'
      p={3}
      shadow='md'
      position={"sticky"}
      top={0}
      zIndex={"docked"}
      bg='#fff'
    >
      <HStack display={{base: "none", md: "block"}}>
        <Flex alignItems={"center"}>
          <Breadcrumbs
            navItems={getNavigationContent(userRole)}
            hidden={false}
          />
        </Flex>
      </HStack>
      <IconButton
        display={{base: "flex", md: "none"}}
        onClick={handleOpenMenu}
        variant='ghost'
        aria-label='open menu'
        icon={<FiMenu />}
      />
      <Menu>
        <MenuButton py={2} transition='all 0.3s' _focus={{boxShadow: "none"}}>
          <HStack>
            <VStack alignItems='flex-end' spacing={0} ml='2'>
              <Text fontSize='sm'>{userName}</Text>
              <Text fontSize='xs' color='gray.400' textTransform={"capitalize"}>
                {userRole === "supermanager" ? "Administrator" : userRole}
              </Text>
            </VStack>
            <Box>
              <Avatar size={"sm"} />
            </Box>
          </HStack>
        </MenuButton>
        <MenuList
          bg={useColorModeValue("white", "gray.900")}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          zIndex={9}
        >
          <Link href={"/profile"}>
            <MenuItem>Profile</MenuItem>
          </Link>
          <MenuDivider />
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
export default AppBar;
