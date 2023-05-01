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
  Drawer,
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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
  Collapse,
  useOutsideClick,
  SimpleGrid,
  Divider,
  DrawerOverlay,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerContent,
} from "@chakra-ui/react";
import {TableColumn} from "main/components/table/utils/types";
import {api} from "main/configs/axios.config";
import {useAuth} from "main/hooks";
import {useCallback, useEffect, useRef, useState} from "react";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {BsInfoCircle} from "react-icons/bs";
import {Controller, FormProvider, useForm} from "react-hook-form";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import {Autocomplete, ImageInput, Table} from "main/components";
import CollectForm from "./CollectForm";
import DeliverForm from "./DeliverForm";
import ReturnForm from "./ReturnForm";
import {toast} from "react-toastify";

type DriverJobsProps = {
  query?: Record<string, any>;
};
export type JobRequestDTO = {
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
  job_id: number;
  status: string;
};
const DriverJobs = (props: DriverJobsProps) => {
  const {user, customer} = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [columns, setColumns] = useState<Record<string, TableColumn>>();
  const [content, setContent] = useState<JobRequestDTO[]>([]);

  const {isOpen, onClose, onOpen} = useDisclosure();

  const fetchJobRequests = useCallback(async () => {
    const response: any = await api.get("job-request", {
      params: {
        pageNr: pageNumber,
        pageSize: 2,
        accepted: 1,
        cancelled: 0,
        completed: 0,
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

  const handleCollect = async (
    id: number,
    type: "both" | "collection" | "delivery",
    data: any
  ) => {
    const response = await api.patch(
      `job/${id}/${type === "delivery" ? "collect-middle" : "collect"}`,
      data
    );
    fetchJobRequests();
  };

  const handleReturn = async (
    id: number,
    type: "both" | "collection" | "delivery",
    data: any
  ) => {
    const response = await api.patch(`job/${id}/return`, data);
    fetchJobRequests();
  };

  const handleComplete = async (
    jobId: number,
    type: "both" | "collection" | "delivery",
    data: any
  ) => {
    if (data && jobId) {
      const formData = new FormData();
      formData.append("image", data.image);
      formData.append("latitude", data.latitude);
      formData.append("longitude", data.longitude);
      formData.append("_method", "PATCH");
      const url: string =
        type === "collection" ? `job/${jobId}/middle` : `job/${jobId}/finish`;
      const response = await api.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) toast.success("Job Completed.");
    }
    fetchJobRequests();
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
        <Flex gap={6} direction='column'>
          <Flex
            justifyContent={"start"}
            px={{base: 5, md: 0}}
            pt={{base: 10, md: 0}}
          >
            <Button colorScheme={"teal"} onClick={onOpen}>
              View Job History
            </Button>
          </Flex>
          {content && content.length > 0 ? (
            <>
              {content.length > 0 &&
                content.map((data: JobRequestDTO) => (
                  <Job
                    key={data.id}
                    jobRequest={data}
                    handleCollect={handleCollect}
                    handleReturn={handleReturn}
                    handleComplete={handleComplete}
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
              my={{base: 0, md: 10}}
              textAlign={"center"}
            >
              <Alert status='info' mx={{base: 5, md: 0}} borderRadius={"md"}>
                <AlertIcon />
                There are no active jobs.
              </Alert>
            </Flex>
          )}
          <Drawer isOpen={isOpen} onClose={onClose} size='xl'>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader>Job History</DrawerHeader>
              <DrawerCloseButton />
              <DrawerBody mb={5}>
                <Table
                  controller={"job-request"}
                  query={{finished: true}}
                  showDelete={false}
                  showAdd={false}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      )}
    </>
  );
};

type JobProps = {
  jobRequest: JobRequestDTO;
  handleCollect: (
    id: number,
    type: "both" | "collection" | "delivery",
    data: any
  ) => void;
  handleReturn: (
    id: number,
    type: "both" | "collection" | "delivery",
    data: any
  ) => void;
  handleComplete: (
    jobId: number,
    type: "both" | "collection" | "delivery",
    data: any
  ) => void;
};

const Job = (props: JobProps) => {
  const {jobRequest, handleCollect, handleComplete, handleReturn} = props;
  const {isOpen, onClose, onOpen} = useDisclosure();
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState<
    "return" | "collect" | "deliver"
  >();
  const methods = useForm();
  const {handleSubmit, setValue, reset, watch} = methods;
  const handleCloseModal = () => {
    reset();
    onClose();
  };
  const handleReturnJob = (data: any) => {
    handleReturn(jobRequest.job_id, jobRequest.type, data);
    handleCloseModal();
  };
  const handleCollectJob = (data: any) => {
    handleCollect(jobRequest.job_id, jobRequest.type, data);
    handleCloseModal();
  };
  const handleCompleteJob = (data: any) => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        data.latitude = position.coords.latitude;
        data.longitude = position.coords.longitude;
        handleComplete(jobRequest.job_id, jobRequest.type, data);
        handleCloseModal();
      },
      function (error) {
        handleComplete(jobRequest.job_id, jobRequest.type, data);
        handleCloseModal();
      }
    );
  };
  return (
    <Box w='full' px={{base: 5, md: 0}}>
      <Box
        bg={useColorModeValue("white", "gray.800")}
        minW='sm'
        rounded='lg'
        shadow='lg'
        position='relative'
        p={6}
      >
        <Flex direction={"column"} gap={3}>
          <Box>
            <Tag
              w='fit-content'
              size='md'
              colorScheme='teal'
              borderRadius='full'
            >
              <TagLabel>
                {jobRequest.type === "both"
                  ? "collection & delivery"
                  : jobRequest.type}
              </TagLabel>
            </Tag>
            <Tag
              w='fit-content'
              size='md'
              colorScheme='blue'
              borderRadius='full'
              mx={5}
            >
              <TagLabel>
                {jobRequest.status === "pending"
                  ? "to collect"
                  : jobRequest.status}
              </TagLabel>
            </Tag>
          </Box>
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
              <StatLabel>
                Collection Address
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      ml={3}
                      variant='ghost'
                      colorScheme={"green"}
                      aria-label='info'
                      icon={<Icon as={BsInfoCircle} />}
                      height='0'
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader color={"teal"}>
                      Collection Address Information!
                    </PopoverHeader>
                    <PopoverBody>
                      <Text>
                        E-mail:
                        <b> {jobRequest.collection_address.email}</b>
                      </Text>
                      <Text>
                        Phone:
                        <b> {jobRequest.collection_address.phone}</b>
                      </Text>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </StatLabel>
              <Heading fontWeight={"semibold"} variant={"body"} size={"md"}>
                {jobRequest.collection_address_name}
              </Heading>
            </Stat>
            <Divider display={{base: "block", sm: "none"}} my={2} />
            <Stat>
              <StatLabel>
                Delivery Address
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      ml={3}
                      variant='ghost'
                      colorScheme={"green"}
                      aria-label='info'
                      icon={<Icon as={BsInfoCircle} />}
                      height='0'
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader color={"teal"}>
                      Delivery Address Information!
                    </PopoverHeader>
                    <PopoverBody>
                      <Text>
                        E-mail:
                        <b> {jobRequest.delivery_address.email}</b>
                      </Text>
                      <Text>
                        Phone:
                        <b> {jobRequest.delivery_address.phone}</b>
                      </Text>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </StatLabel>
              <Heading fontWeight={"semibold"} variant={"body"} size={"md"}>
                {jobRequest.delivery_address_name}
              </Heading>
            </Stat>
          </SimpleGrid>
        </Flex>

        <Flex gap={6} mt={4} justifyContent={{base: "center", sm: "end"}}>
          <Button
            variant={"ghost"}
            colorScheme={"red"}
            onClick={() => {
              setModalTitle("Return Job");
              setModalType("return");
              onOpen();
            }}
          >
            Return
          </Button>
          {jobRequest.status === "accepted" && (
            <Button
              colorScheme={"teal"}
              variant='outline'
              onClick={() => {
                setModalTitle("Mark Job as Collected");
                setModalType("collect");
                onOpen();
              }}
            >
              Mark as Collected
            </Button>
          )}
          {jobRequest.status === "collected" && (
            <Button
              colorScheme={"teal"}
              onClick={() => {
                setModalTitle("Mark Job as Delivered");
                setModalType("deliver");
                onOpen();
              }}
            >
              Mark as Delivered
            </Button>
          )}
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent mx={{base: 5, md: 0}}>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={5}>
            <FormProvider {...methods}>
              {modalType === "collect" && (
                <CollectForm jobId={jobRequest.id} jobType={jobRequest.type} />
              )}
              {modalType === "return" && (
                <ReturnForm jobId={jobRequest.id} jobType={jobRequest.type} />
              )}
              {modalType === "deliver" && <DeliverForm />}
            </FormProvider>
          </ModalBody>
          <ModalFooter>
            <Button variant={"ghost"} onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              ml={5}
              colorScheme={"teal"}
              onClick={() => {
                handleSubmit(
                  modalType === "collect"
                    ? handleCollectJob
                    : modalType === "deliver"
                    ? handleCompleteJob
                    : handleReturnJob
                )();
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
export default DriverJobs;
