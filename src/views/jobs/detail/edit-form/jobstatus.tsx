import {JobDTO} from "main/models";
import {
  Box,
  Flex,
  Text,
  Icon,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tag,
  Grid,
  SimpleGrid,
} from "@chakra-ui/react";
import {CgDanger} from "react-icons/cg";
import {
  InfoIcon,
  WarningTwoIcon,
  WarningIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";

type JobStatusProps = {
  job: JobDTO;
};

const JobStatus = (props: JobStatusProps) => {
  const {job} = props;
  const jobState = {
    pending: {
      type: "warn",
      label: "request pending",
    },
    accepted: {
      type: "info",
      label: "request accepted",
    },
    collected: {
      type: "info",
      label: "collected",
    },
    delivered: {
      type: "info",
      label: "delivered",
    },
    refused: {
      type: "error",
      label: "request refused",
    },
    returned: {
      type: "error",
      label: "job returned",
    },
    finished: {
      type: "success",
      label: "job completed",
    },
  };

  return (
    <Box>
      {job.single_way_job ? (
        <Flex>
          <Stat textAlign='center'>
            <StatNumber>
              <Text color={"gray.500"} mt={2} fontSize='sm'>
                {jobState[job.delivery_status].type === "success" && (
                  <CheckCircleIcon
                    boxSize={"20px"}
                    color={"green.500"}
                    mr={2}
                  />
                )}
                {jobState[job.delivery_status].type === "info" && (
                  <InfoIcon boxSize={"20px"} color={"blue.500"} mr={2} />
                )}
                {jobState[job.delivery_status].type === "warn" && (
                  <WarningTwoIcon
                    boxSize={"20px"}
                    color={"orange.400"}
                    mr={2}
                  />
                )}
                {jobState[job.delivery_status].type === "error" && (
                  <WarningIcon boxSize={"20px"} color={"red.500"} mr={2} />
                )}
                {`${jobState[job.delivery_status].label}`}
              </Text>
            </StatNumber>
          </Stat>
        </Flex>
      ) : (
        <SimpleGrid columns={{base: 1, sm: 2}} gap={5}>
          <Stat textAlign='center'>
            <StatLabel>Collection</StatLabel>
            <StatNumber>
              <Text color={"gray.500"} mt={2} fontSize='sm'>
                {job.collection_status !== "pending" ? (
                  <InfoIcon boxSize={"20px"} color={"blue.500"} />
                ) : (
                  <WarningTwoIcon boxSize={"20px"} color={"orange.300"} />
                )}{" "}
                {`${jobState[job.collection_status].label}`}
              </Text>
            </StatNumber>
          </Stat>
          <Stat textAlign='center'>
            <StatLabel>Delivery</StatLabel>
            <StatNumber>
              <Text color={"gray.500"} mt={2} fontSize='sm'>
                {job.delivery_status !== "pending" ? (
                  <InfoIcon boxSize={"20px"} color={"blue.500"} />
                ) : (
                  <WarningTwoIcon boxSize={"20px"} color={"orange.300"} />
                )}{" "}
                {`${jobState[job.delivery_status].label}`}
              </Text>
            </StatNumber>
          </Stat>
        </SimpleGrid>
      )}
      <SimpleGrid mt={5} columns={{base: 1, md: 2}} gap={5}>
        {job.collected_time && (
          <Stat>
            <StatLabel>Collection Date</StatLabel>
            <StatHelpText mt={2}>{job.collected_time}</StatHelpText>
          </Stat>
        )}
        {job.middle_time && (
          <Stat>
            <StatLabel>Sent to Hold Time</StatLabel>
            <StatHelpText mt={2}>{job.middle_time}</StatHelpText>
          </Stat>
        )}
        {job.delivered_time && (
          <Stat>
            <StatLabel>Delivered Time</StatLabel>
            <StatHelpText mt={2}>{job.delivered_time}</StatHelpText>
          </Stat>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default JobStatus;
