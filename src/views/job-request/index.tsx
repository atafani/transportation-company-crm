import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stat,
  StatLabel,
  Heading,
  Tag,
  TagLabel,
  useColorModeValue,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  ModalFooter,
  Spinner,
  IconButton,
  Alert,
  AlertIcon,
  Input,
  FormErrorMessage,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import {TableColumn} from "main/components/table/utils/types";
import {api} from "main/configs/axios.config";
import {useCallback, useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

type JobRequestsListProps = {
  query?: Record<string, any>;
};

type JobRequestDTO = {
  id: number;
  client_name: string;
  type: "both" | "collection" | "delivery";
  collection_address_name: string;
  collection_address: any;
  collection_time: string;
  delivery_address_name: string;
  delivery_address: any;
  delivery_time: string;
  accepted: boolean;
  refused_note: string;
};

const JobRequestsList = (props: JobRequestsListProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [columns, setColumns] = useState<Record<string, TableColumn>>();
  const [content, setContent] = useState<JobRequestDTO[]>([]);

  const fetchJobRequests = useCallback(async () => {
    const response: any = await api.get("job-request", {
      params: {
        pageNr: pageNumber,
        pageSize: 2,
        accepted: "null",
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
  }, [pageNumber]);

  useEffect(() => {
    fetchJobRequests();
  }, [fetchJobRequests]);

  const handleAcceptJob = async (id: number) => {
    const response = await api.patch(`job-request/${id}/accept`);
    response && fetchJobRequests();
  };

  const handleDeclineJob = async (data: {id?: number; note: string}) => {
    if (data && data.id) {
      const response = await api.patch(`job-request/${data.id}/decline`, {
        note: data.note,
      });
      response && fetchJobRequests();
    }
  };

  return (
    <>
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
        <Flex
          gap={6}
          direction='column'
          alignItems='center'
          justifyContent='center'
        >
          {content && content.length > 0 ? (
            <>
              {content.length > 0 &&
                content.map((data: JobRequestDTO) => (
                  <Request
                    key={data.id}
                    jobRequest={data}
                    handleAcceptJob={handleAcceptJob}
                    handleDeclineJob={handleDeclineJob}
                  />
                ))}

              <Flex
                flexDirection={"row"}
                justifyContent='center'
                alignItems='center'
                gap={3}
              >
                <IconButton
                  aria-label='Previous'
                  variant={"ghost"}
                  mx={2}
                  icon={<Icon as={IoIosArrowBack} />}
                  disabled={!hasPrev}
                  onClick={() => hasPrev && setPageNumber(pageNumber - 1)}
                />
                <Box>{`Page ${pageNumber} of ${totalPages}`}</Box>
                <IconButton
                  mx={2}
                  aria-label='Next'
                  variant={"ghost"}
                  icon={<Icon as={IoIosArrowForward} />}
                  disabled={!hasNext}
                  onClick={() => hasNext && setPageNumber(pageNumber + 1)}
                />
              </Flex>
            </>
          ) : (
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              w={"100%"}
              h={"100%"}
              my={10}
              textAlign={"center"}
            >
              <Alert status='info' mx={{base: 5, md: 0}} borderRadius={"md"}>
                <AlertIcon />
                There are no new requests.
              </Alert>
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};
type RequestProps = {
  jobRequest: JobRequestDTO;
  handleAcceptJob: (id: number) => void;
  handleDeclineJob: (data: {id?: number; note: string}) => void;
};
const Request = (props: RequestProps) => {
  const {jobRequest, handleAcceptJob, handleDeclineJob} = props;
  const {isOpen, onClose, onOpen} = useDisclosure();
  const {control, handleSubmit, getValues} = useForm({
    defaultValues: {id: jobRequest.id, note: ""},
  });

  return (
    <Box w='full'>
      <Box
        bg={useColorModeValue("white", "gray.800")}
        minW='sm'
        rounded='lg'
        shadow='lg'
        position='relative'
        p={6}
      >
        <Flex direction={"column"} gap={3}>
          <Tag w='fit-content' size='md' colorScheme='teal' borderRadius='full'>
            <TagLabel>{jobRequest.type}</TagLabel>
          </Tag>
          <SimpleGrid
            columns={{base: 1, sm: 2, lg: 3}}
            gap={4}
            textAlign={{base: "center", sm: "left"}}
            my={4}
          >
            <Stat flex={1}>
              <StatLabel>Client Name</StatLabel>
              <Heading fontWeight={"semibold"} variant={"body"} size={"md"}>
                {jobRequest.client_name}
              </Heading>
            </Stat>

            <Divider display={{base: "block", sm: "none"}} my={2} />
            <Stat>
              <StatLabel>Collection Date</StatLabel>
              <Heading fontWeight={"semibold"} variant={"body"} size={"md"}>
                {jobRequest.collection_time}
              </Heading>
            </Stat>
            {jobRequest.type === "both" && !!jobRequest.delivery_time && (
              <>
                <Divider display={{base: "block", sm: "none"}} my={2} />
                <Stat>
                  <StatLabel>Delivery Date</StatLabel>
                  <Heading fontWeight={"semibold"} variant={"body"} size={"md"}>
                    {jobRequest.delivery_time}
                  </Heading>
                </Stat>
              </>
            )}
          </SimpleGrid>
          <SimpleGrid
            columns={{base: 1, sm: 2}}
            gap={4}
            textAlign={{base: "center", sm: "left"}}
            my={4}
          >
            <Stat>
              <StatLabel>Collection Address</StatLabel>
              <Heading fontWeight={"semibold"} variant={"body"} size={"md"}>
                {jobRequest.collection_address_name}
              </Heading>
            </Stat>
            <Divider display={{base: "block", sm: "none"}} my={2} />
            <Stat>
              <StatLabel>Delivery Address</StatLabel>
              <Heading fontWeight={"semibold"} variant={"body"} size={"md"}>
                {jobRequest.delivery_address_name}
              </Heading>
            </Stat>
          </SimpleGrid>
        </Flex>

        <Flex gap={6} mt={4} justifyContent={{base: "center", sm: "end"}}>
          <Button colorScheme={"red"} variant='ghost' onClick={onOpen}>
            Decline
          </Button>
          <Button
            colorScheme={"teal"}
            onClick={() => handleAcceptJob(jobRequest.id)}
          >
            Accept
          </Button>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={{base: 5, md: 0}}>
          <ModalHeader>Decline Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={5}>
            <form onSubmit={(e) => e.preventDefault()}>
              <Controller
                control={control}
                name={"id"}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <FormControl hidden>
                    <Input value={value} type='number' />
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name={"note"}
                rules={{
                  required: "Note is required.",
                  minLength: {
                    value: 10,
                    message: "The note must be at least 10 characters.",
                  },
                }}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel>
                      Why are you declining this job request?
                    </FormLabel>
                    <Textarea value={value} onChange={onChange}></Textarea>
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant={"ghost"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              ml={5}
              colorScheme={"teal"}
              onClick={() => {
                handleSubmit(handleDeclineJob)();
                onClose();
              }}
            >
              Ok
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
export default JobRequestsList;
