import {
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {api} from "main/configs/axios.config";
import {useAuth} from "main/hooks";
import {useState, useCallback, useEffect} from "react";
import {BsInfoCircle} from "react-icons/bs";
import {JobRequestDTO} from "views/jobs/drivers";

const DriverDashboard = () => {
  const {user, customer} = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [content, setContent] = useState<JobRequestDTO[]>([]);

  const fetchJobRequests = useCallback(async () => {
    const response: any = await api.get("job-request", {
      params: {
        pageNr: 1,
        pageSize: 2,
        accepted: true,
        cancelled: false,
        finished: false,
      },
    });
    if (response) {
      setContent(response.content);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchJobRequests();
  }, [fetchJobRequests]);

  return (
    <Box>
      {/* <SimpleGrid columns={{base: 1, md: 2}}>
        <Box borderRadius='lg' p={10}>
          <Text fontWeight={"bold"} mb={5}>
            Monthly Progress
          </Text>
          <SimpleGrid columns={{base: 1, md: 2}} gap={5}>
            <Stat
              textAlign='center'
              bg='teal'
              color='white'
              borderRadius={"md"}
              p={5}
            >
              <StatLabel>Finished Jobs</StatLabel>
              <StatNumber>32</StatNumber>
            </Stat>
            <Stat
              textAlign='center'
              bg='red.500'
              color='white'
              borderRadius={"md"}
              p={5}
            >
              <StatLabel>Returned Jobs</StatLabel>
              <StatNumber>22 </StatNumber>
            </Stat>
          </SimpleGrid>
        </Box>
        <Box></Box>
      </SimpleGrid>
      <Box borderRadius='lg' p={10}>
        <Text fontWeight={"bold"} mb={5}>
          Active Jobs
        </Text>
      </Box> */}
    </Box>
  );
};

export default DriverDashboard;
