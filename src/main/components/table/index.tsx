import {
  Table as ChakraTable,
  Tbody,
  TableContainer,
  Alert,
  AlertIcon,
  Flex,
  Box,
  Button,
  BoxProps,
  TableContainerProps,
  Tr,
} from "@chakra-ui/react";
import {useCallback, useEffect, useState} from "react";
import {Footer, Header, Row, Toolbar} from "./components";
import {Spinner} from "@chakra-ui/react";
import {api} from "main/configs/axios.config";
import {Sort, TableColumn, TableProps} from "./utils/types";
import styled from "@emotion/styled";

const Table = (props: TableProps) => {
  const {
    controller,
    actions,
    footerActions,
    filterable = true,
    showAdd = false,
    showEdit = true,
    showDelete = true,
    detailForm,
    handleAdd,
    handleEdit,
    query,
  } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<Sort>();
  const [filters, setFilters] = useState<Record<string, any>>();
  const [columns, setColumns] = useState<Record<string, TableColumn>>();
  const [content, setContent] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    document.addEventListener(`refreshTable${controller}`, refreshTableData);
    return () => {
      document.removeEventListener(
        `refreshTable${controller}`,
        refreshTableData
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller]);

  const fetchTableData = useCallback(async () => {
    const response: any = await api.get(controller, {
      params: {
        pageNr: pageNumber,
        pageSize: pageSize,
        searchQuery: searchQuery,
        ...sort,
        ...filters,
        ...query,
      },
    });
    if (response) {
      setContent(response.content);
      setColumns(response.columns);
      setPageNumber(response.current_page);
      setTotalPages(response.total_pages);
      setHasPrev(response.current_page > 1);
      setHasNext(response.current_page < response.total_pages);
    }
    setLoading(false);
  }, [controller, searchQuery, pageNumber, pageSize, filters, sort, query]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const refreshTableData = () => {
    fetchTableData();
  };
  const StyledTable = styled(TableContainer)<TableContainerProps>((theme) => ({
    "&::-webkit-scrollbar": {
      height: "0.7em",
    },
    "&::-webkit-scrollbar-track:horizontal": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb:horizontal": {
      backgroundColor: "rgb(240,240,240)",
      transition: "background 250ms ease",
    },
    "&::-webkit-scrollbar-thumb:horizontal:hover": {
      backgroundColor: "rgb(211,211,211)",
    },
  }));
  return (
    <Box backgroundColor={"#fff"} py={4} borderRadius={5}>
      {loading ? (
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          w={"100%"}
          h={"100%"}
          my={10}
        >
          <Spinner />
        </Flex>
      ) : (
        <>
          {filterable && (
            <Toolbar
              searchValue={searchQuery}
              onSearch={(value: string) => {
                setSearchQuery(value);
              }}
              columns={columns}
              filters={filters}
              setFilters={setFilters}
            />
          )}
          <Box position={"relative"} borderRadius={5}>
            <StyledTable>
              {content && (
                <ChakraTable variant='simple'>
                  <Header
                    columns={columns}
                    showActions={showDelete || (actions && actions.length > 0)}
                    sort={sort}
                    setSort={setSort}
                    showDelete={content.length === 0 ? false : showDelete}
                    showEdit={content.length === 0 ? false : showEdit}
                  />
                  <Tbody>
                    {content.length === 0 && (
                      <Tr w={"100%"} my={20} display='block'>
                        <Alert
                          status='warning'
                          position={"absolute"}
                          bottom={7}
                          left={0}
                          right={0}
                          display='flex'
                          flexDirection={"row"}
                          justifyContent='center'
                          alignItems={"center"}
                        >
                          <AlertIcon />
                          No records!
                        </Alert>
                      </Tr>
                    )}
                    {content.map((data: Record<string, any>) => {
                      return (
                        <Row
                          key={data.id}
                          columns={columns}
                          row={data}
                          controller={controller}
                          onRefreshTable={refreshTableData}
                          showDelete={showDelete}
                          showEdit={showEdit}
                          handleEdit={() => handleEdit && handleEdit(data.id)}
                          actions={actions}
                        />
                      );
                    })}
                  </Tbody>
                </ChakraTable>
              )}
            </StyledTable>
          </Box>
          <Flex
            flexDirection={"row"}
            alignItems='center'
            justifyContent={"space-between"}
          >
            {showAdd && handleAdd && (
              <Button
                size={"sm"}
                px={5}
                colorScheme={"teal"}
                onClick={() => handleAdd()}
              >
                Add
              </Button>
            )}
            <Footer
              hasNext={hasNext}
              hasPrev={hasPrev}
              pageSize={pageSize}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              totalPages={totalPages}
              setPageSize={setPageSize}
            />
          </Flex>
        </>
      )}
    </Box>
  );
};

export default Table;
