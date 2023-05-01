import {Flex, Icon, Text} from "@chakra-ui/react";
import {handleURLQueries} from "main/components/table/utils/functions";
import {useRouter} from "next/router";
import Link from "next/link";
import {NavItemType} from "main/configs/navigation.config";

interface NavItemProps extends NavItemType {
  fixed: boolean;
  navHover: boolean;
  setHidden: (value: boolean) => void;
}

const NavItem = ({
  icon,
  name,
  path,
  fixed,
  navHover,
  setHidden,
  ...rest
}: NavItemProps) => {
  const router = useRouter();
  const isNavLinkActive = () => {
    if (router.pathname === path || handleURLQueries(router, path)) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <Link href={path} style={{textDecoration: "none"}}>
      <Flex
        onClick={() => setHidden(true)}
        align='center'
        py={3}
        px={5}
        gap={3}
        m='2'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        transition={"background 0.3s ease"}
        sx={{
          bg: isNavLinkActive() ? "teal.400" : undefined,
          color: isNavLinkActive() ? "#fff" : undefined,
        }}
        _hover={{
          bg: isNavLinkActive() ? undefined : "teal.50",
        }}
        {...rest}
      >
        {icon && <Icon fontSize='16' as={icon} />}
        <Text
          sx={{
            opacity: fixed || navHover ? 1 : 0,
            transition: "opacity 0.3s ease-in",
          }}
        >
          {name}
        </Text>
      </Flex>
    </Link>
  );
};
export default NavItem;
