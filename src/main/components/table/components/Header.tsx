import {Button, Icon, IconButton, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {Sort, TableColumn} from "../utils/types";
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";
import {AiOutlineLine} from "react-icons/ai";

interface HeaderProps {
  columns?: Record<string, TableColumn>;
  showEdit: boolean;
  showDelete: boolean;
  showActions?: boolean;
  sort?: Sort;
  setSort?: (value: Sort | undefined) => void;
}

const Header = (props: HeaderProps) => {
  const {
    columns,
    showActions = false,
    sort,
    setSort,
    showEdit,
    showDelete,
  } = props;

  const handleSort = (columnName: string) => {
    if ((!sort || columnName !== sort?.sortBy) && setSort) {
      setSort({sortBy: columnName, sortDir: "asc"});
    } else if (sort && sort.sortDir === "asc" && setSort) {
      setSort({sortBy: columnName, sortDir: "desc"});
    } else if (sort && sort.sortDir === "desc" && setSort) setSort(undefined);
  };

  return (
    <Thead bg={"gray.50"}>
      <Tr>
        {columns &&
          Object.keys(columns).map(function (key: string, index) {
            return (
              <Th
                key={key}
                position='relative'
                isNumeric={typeof columns[key].data_type === "number"}
                sx={{
                  textTransform: "uppercase",
                  "&:hover .sort-icon": {
                    visibility: "visible",
                  },
                }}
              >
                {columns[key].title}
                <IconButton
                  aria-label='sort'
                  className='sort-icon'
                  icon={
                    <Icon
                      as={
                        !sort || sort.sortDir === "asc"
                          ? IoIosArrowUp
                          : IoIosArrowDown
                      }
                    />
                  }
                  variant='ghost'
                  colorScheme={"teal"}
                  size='xs'
                  ms={10}
                  onClick={() => handleSort(key)}
                  sx={{
                    visibility: `${
                      !sort || sort.sortBy !== key ? "hidden" : "visible"
                    }`,
                    transition: "visibility 0.2s ease",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  borderRadius='50%'
                />
                {index > 0 && (
                  <Icon
                    as={AiOutlineLine}
                    color={"gray.400"}
                    sx={{
                      position: "absolute",
                      top: 4,
                      left: 0,
                      transform: "rotate(90deg)",
                    }}
                  />
                )}
              </Th>
            );
          })}
        {(showActions || showEdit || showDelete) && (
          <Th
            sx={{
              position: "sticky",
              right: 0,
              width: "20px",
              backgroundColor: "gray.50",
            }}
            px={0}
          />
        )}
      </Tr>
    </Thead>
  );
};

export default Header;
