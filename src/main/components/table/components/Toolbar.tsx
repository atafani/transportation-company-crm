import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  FormControl,
  FormErrorMessage,
  FormLabel,
  SimpleGrid,
} from "@chakra-ui/react";
import {FiFilter, FiSearch} from "react-icons/fi";
import {IoIosClose} from "react-icons/io";
import {BsFillCircleFill} from "react-icons/bs";
import "react-datepicker/dist/react-datepicker.css";
import {Controller, useForm} from "react-hook-form";
import DatePicker from "main/components/form-elements/date-picker";
import {TableColumn} from "../utils/types";
import {useState, useEffect} from "react";

interface ToolbarProps {
  searchValue: string;
  onSearch: (value: string) => void;
  columns?: Record<string, TableColumn>;
  filters?: Record<string, any>;
  setFilters?: (setFilters: Record<string, any>) => void;
}

const Toolbar = (props: ToolbarProps) => {
  const {searchValue, onSearch, columns, filters, setFilters} = {...props};
  const {isOpen, onClose, onToggle} = useDisclosure();
  const {control, handleSubmit, reset} = useForm();

  const [searchTerm, setSearchTerm] = useState(searchValue);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const renderInput = (name: string, searchColumn: TableColumn) => {
    const controller: React.ReactNode = !searchColumn.data_type.includes(
      "date"
    ) ? (
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <FormControl isInvalid={!!error}>
            <FormLabel sx={{textTransform: "capitalize"}}>{name}</FormLabel>
            <Input
              type={searchColumn.data_type === "number" ? "number" : "text"}
              value={value}
              onChange={onChange}
            />
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        )}
      />
    ) : (
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <FormControl isInvalid={!!error}>
            <FormLabel sx={{textTransform: "capitalize"}}>{name}</FormLabel>
            <DatePicker value={value} onChange={onChange} />
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        )}
      />
    );
    return (
      <GridItem key={name} w='100%'>
        {controller}
      </GridItem>
    );
  };

  return (
    <Flex my={3} justifyContent='space-between'>
      <Box w={"100%"}>
        <Popover
          placement='bottom-start'
          isOpen={isOpen}
          closeOnBlur
          onClose={onClose}
        >
          <PopoverTrigger>
            <IconButton
              variant={
                isOpen || (filters && Object.keys(filters).length > 0)
                  ? "solid"
                  : "ghost"
              }
              aria-label='Filter'
              colorScheme={"teal"}
              icon={
                <Box style={{position: "relative"}}>
                  <Icon as={FiFilter} />
                </Box>
              }
              onClick={onToggle}
              disabled={columns === undefined}
            />
          </PopoverTrigger>
          <PopoverContent
            width={"fit-content"}
            maxHeight={"50vh"}
            overflowY={{base: "scroll", lg: "hidden"}}
          >
            <PopoverArrow />
            <PopoverBody>
              <Box p={5}>
                <form>
                  <SimpleGrid columns={{base: 1, md: 2, lg: 4}} gap={5}>
                    {columns &&
                      Object.keys(columns)
                        .filter((key: string) => columns[key].search)
                        .map((key: string, index) => {
                          return renderInput(columns[key].title, columns[key]);
                        })}
                  </SimpleGrid>
                  <Flex mt={5} justifyContent='end' gap={3}>
                    <Button
                      variant={"ghost"}
                      colorScheme={"teal"}
                      disabled={filters && Object.keys(filters).length === 0}
                      onClick={() => {
                        setFilters && setFilters({});
                        reset();
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      variant={"solid"}
                      colorScheme={"teal"}
                      disabled={filters && Object.keys(filters).length === 0}
                      onClick={() => {
                        handleSubmit(
                          (data: any) => setFilters && setFilters(data)
                        )();
                        onClose();
                      }}
                    >
                      Filter
                    </Button>
                  </Flex>
                </form>
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
      <InputGroup w={200}>
        <InputLeftElement pointerEvents='none'>
          <Icon as={FiSearch} color='teal' />
        </InputLeftElement>
        <Input
          type='text'
          placeholder='Search'
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
        />
        {searchTerm.length > 0 && (
          <InputRightElement
            onClick={() => setSearchTerm("")}
            sx={{"&:hover": {cursor: "pointer"}}}
          >
            <Icon as={IoIosClose} />
          </InputRightElement>
        )}
      </InputGroup>
    </Flex>
  );
};

export default Toolbar;
