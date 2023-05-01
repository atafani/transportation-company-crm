import React from "react";
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import Link from "next/link";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from "@chakra-ui/react";
const generatePathParts = (pathStr: string) => {
  const pathWithoutQuery = pathStr.split("?")[0];
  return pathWithoutQuery.split("/").filter((v) => v.length > 0);
};

const generateText = (
  title: string,
  param: string,
  value: any,
  href: string
) => {
  const text =
    param.toLocaleLowerCase() === "id"
      ? value === "new"
        ? "Add"
        : "Edit"
      : param.toLocaleLowerCase() === "name"
      ? value
      : title;
  return text;
};

interface BreadcrumbProps {
  navItems: any;
  hidden: boolean;
}

const Breadcrumbs = (props: BreadcrumbProps) => {
  const {navItems, hidden} = props;
  const router = useRouter();
  const breadcrumbs = React.useMemo(
    function generateBreadcrumbs() {
      const asPathNestedRoutes = generatePathParts(router.asPath);
      const pathnameNestedRoutes = generatePathParts(router.pathname);
      const query: ParsedUrlQuery = router.query;

      const crumblist = asPathNestedRoutes.map((subpath, idx) => {
        const param: string = pathnameNestedRoutes[idx]
          .replace("[", "")
          .replace("]", "");
        const href: string = `${
          idx > 0 ? `/${asPathNestedRoutes[idx - 1]}` : ``
        }/${subpath}`;
        const titleObj = navItems.find((item: any) => item.path === href);
        return {
          href,
          text: generateText(
            titleObj ? titleObj.name : "",
            param,
            query[param],
            href
          ),
        };
      });
      return [...crumblist];
    },
    [navItems, router.asPath, router.pathname, router.query]
  );
  return hidden ? (
    <></>
  ) : (
    <Box
      fontSize='sm'
      display={"flex"}
      flexDirection='row'
      alignItems='center'
      gap={2}
      fontWeight='medium'
    >
      {breadcrumbs.map((crumb, idx) => (
        <Crumb {...crumb} key={idx} last={idx === breadcrumbs.length - 1} />
      ))}
    </Box>
  );
};

const Crumb = ({text, href, last = false}: any) => {
  if (last) {
    return (
      <Text textTransform={"capitalize"} color='teal'>
        {text}
      </Text>
    );
  }

  return (
    <>
      <Link href={href}>
        <Text
          textTransform={"capitalize"}
          sx={{"&:hover": {cursor: "pointer"}}}
        >
          {text}
        </Text>
      </Link>
      <Text>/</Text>
    </>
  );
};
export default Breadcrumbs;
