import {
  Icon,
  IconButton,
  Input,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Box,
  Flex,
  RadioGroup,
  useRadio,
  useRadioGroup,
  Alert,
  AlertIcon,
  InputRightElement,
  InputLeftElement,
} from "@chakra-ui/react";
import {api} from "main/configs/axios.config";
import {ReactElement, useCallback, useEffect, useState} from "react";
import {BsBoxArrowUp} from "react-icons/bs";
import {FiSearch} from "react-icons/fi";
import {IoIosArrowBack, IoIosArrowForward, IoIosClose} from "react-icons/io";

type LookupProps = {
  value: any;
  onChange: (value: any) => void;
  controller: string;
  multiple?: boolean;
  hidden?: boolean;
  title?: string;
  button?: ReactElement;
  query?: Record<string, any>;
  label?: string;
  disabled?: boolean;
  filters?: number[];
};

const Lookup = (props: LookupProps) => {
  const {
    value,
    onChange,
    controller,
    multiple,
    label,
    button,
    title,
    query,
    disabled = false,
    filters,
  } = props;

  const [content, setContent] = useState<Record<string, any>[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [inputValue, setInputValue] = useState<string>("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>();
  const {isOpen, onOpen, onClose} = useDisclosure();

  const {getRootProps, getRadioProps} = useRadioGroup({
    value: value,
    name: `${controller}`,
    onChange: (value: any) => {
      const [inputValue, inputLabel] = value.split(";");
      setSelectedId(parseInt(inputValue));
      setInputValue(inputLabel);
    },
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchTerm && handleOpenLookup();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleCloseLookup = () => {
    setSearchTerm(undefined);
    setSelectedId(undefined);
    onClose();
  };

  useEffect(() => {
    label && setInputValue(label);
  }, [label]);

  const handleOpenLookup = async () => {
    const response: any = await api.get(controller, {
      params: {
        pageNr: pageNumber,
        pageSize: 5,
        ...query,
        searchQuery: searchTerm,
      },
    });

    if (response) {
      setContent(
        response.content
          ? response.content.filter((obj: any) => {
              let result = obj.id !== value;
              if (filters) result = result && !filters.includes(obj.id);
              return result;
            })
          : []
      );
      setPageNumber(response.current_page);
      setTotalPages(response.total_pages);
      onOpen();
    }
  };

  const group = getRootProps();

  return (
    <>
      {button ? (
        <Box onClick={handleOpenLookup}>{button}</Box>
      ) : (
        <InputGroup>
          <Input
            px={3}
            readOnly
            value={inputValue}
            onClick={!disabled ? handleOpenLookup : undefined}
          />
          {!disabled && (
            <InputRightElement>
              <IconButton
                title='Open'
                aria-label='Open'
                bg='none'
                border='none'
                onClick={handleOpenLookup}
                icon={<Icon as={BsBoxArrowUp} />}
              />
            </InputRightElement>
          )}
        </InputGroup>
      )}

      <Modal isOpen={isOpen} onClose={handleCloseLookup}>
        <ModalOverlay />
        <ModalContent mx={{base: 5, md: 0}}>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody sx={{textTransform: "capitalize"}}>
            <InputGroup w={"full"} mb={5}>
              <InputLeftElement pointerEvents='none'>
                <Icon as={FiSearch} color='teal' />
              </InputLeftElement>
              <Input
                type='text'
                placeholder='Search'
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
              />
              {searchTerm && searchTerm.length > 0 && (
                <InputRightElement
                  onClick={() => setSearchTerm("")}
                  sx={{"&:hover": {cursor: "pointer"}}}
                >
                  <Icon as={IoIosClose} />
                </InputRightElement>
              )}
            </InputGroup>
            <Box>
              <RadioGroup value={value}>
                <Flex flexDirection={"column"} {...group}>
                  {(!content || content.length === 0) && (
                    <Alert status='warning' w={"100%"}>
                      <AlertIcon />
                      No records!
                    </Alert>
                  )}
                  {content &&
                    content.length > 0 &&
                    content.map((data: Record<string, any>) => {
                      const radio = getRadioProps({
                        value: `${data["id"]};${data[Object.keys(data)[1]]}`,
                      });
                      return (
                        <RadioCard key={data["id"]} {...radio}>
                          {data[Object.keys(data)[1]]}
                        </RadioCard>
                      );
                    })}
                </Flex>
              </RadioGroup>
            </Box>
            {content && content.length > 0 && (
              <Flex
                flexDirection={"row"}
                alignItems='center'
                justifyContent={"center"}
                my={3}
                gap={3}
              >
                <IconButton
                  mx={2}
                  aria-label='Previous'
                  variant={"ghost"}
                  icon={<Icon as={IoIosArrowBack} />}
                  disabled={pageNumber === 1}
                  onClick={() =>
                    pageNumber > 1 && setPageNumber(pageNumber - 1)
                  }
                />
                <Box>{`Page ${pageNumber} of ${totalPages}`}</Box>
                <IconButton
                  mx={2}
                  aria-label='Next'
                  variant={"ghost"}
                  icon={<Icon as={IoIosArrowForward} />}
                  disabled={pageNumber === totalPages}
                  onClick={() =>
                    pageNumber < totalPages && setPageNumber(pageNumber + 1)
                  }
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={handleCloseLookup}>
              Close
            </Button>
            {content && content.length > 0 && (
              <Button
                colorScheme='teal'
                onClick={() => {
                  onChange(selectedId);
                  handleCloseLookup();
                }}
              >
                Choose
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default Lookup;

const RadioCard = (props: any) => {
  const {getInputProps, getCheckboxProps} = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        width='100%'
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        _checked={{
          bg: "teal.600",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};
