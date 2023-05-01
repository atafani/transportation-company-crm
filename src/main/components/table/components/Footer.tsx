import {
  Box,
  Flex,
  Icon,
  IconButton,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import React from "react";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

type FooterProps = {
  hasNext: boolean;
  hasPrev: boolean;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  setPageSize: (value: number) => void;
  setPageNumber: (value: number) => void;
};

const Footer = (props: FooterProps) => {
  const {
    hasNext,
    hasPrev,
    pageSize,
    pageNumber,
    totalPages,
    setPageSize,
    setPageNumber,
  } = props;

  return (
    <>
      <Flex justifyContent='flex-end' alignItems='center' w='100%' my={5}>
        <SimpleGrid columns={{base: 1, sm: 2}}>
          <Flex alignItems='center' gap={3}>
            <Box w='fit-content'>Rows per page:</Box>
            <Select
              value={pageSize}
              onChange={(e: any) => setPageSize(e.target.value)}
              w={"fit-content"}
            >
              <option value={5}>5</option>
              <option value={30}>30</option>
              <option value={30}>50</option>
            </Select>
          </Flex>
          <Flex align={"center"}>
            <IconButton
              mx={2}
              aria-label='Previous'
              variant={"ghost"}
              icon={<Icon as={IoIosArrowBack} />}
              disabled={!hasPrev}
              onClick={() => hasPrev && setPageNumber(pageNumber - 1)}
            />
            <Box>{`Page ${pageNumber} of ${totalPages}`}</Box>
            <IconButton
              aria-label='Next'
              mx={2}
              variant={"ghost"}
              icon={<Icon as={IoIosArrowForward} />}
              disabled={!hasNext}
              onClick={() => hasNext && setPageNumber(pageNumber + 1)}
            />
          </Flex>
        </SimpleGrid>
      </Flex>
    </>
  );
};

export default Footer;
