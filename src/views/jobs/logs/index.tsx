import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {useState} from "react";

type Log = {
  id?: number;
  type: "driver_action" | "system_action";
  time: string;
  log: any;
};
type JobLogsListProps = {
  logs: Log[];
};
const JobLogsList = (props: JobLogsListProps) => {
  const {logs} = props;
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [selectedLog, setSelectedLog] = useState<any>();

  const actionType = {
    driver_action: {
      label: "driver",
      color: "gray",
    },
    system_action: {
      label: "system",
      color: "blackAlpha",
    },
  };

  const actionsColor = {
    created: "teal",
    updated: "blue",
    accepted: "green",
    refused: "red",
    returned: "red",
    collected: "green",
    delivered: "green",
    completed: "green",
  };

  return (
    <Box p={5}>
      <SimpleGrid
        display={{base: "none", lg: "grid"}}
        my={5}
        gap={5}
        columns={{base: 1, sm: 2, lg: 5}}
      >
        <Stat>
          <StatLabel fontSize={"1rem"}>Time</StatLabel>
        </Stat>
        <Stat>
          <StatLabel fontSize={"1rem"}>Type</StatLabel>
        </Stat>
        <Stat>
          <StatLabel fontSize={"1rem"}>Action</StatLabel>
        </Stat>
        <Stat>
          <StatLabel fontSize={"1rem"}>Causer</StatLabel>
        </Stat>
        <Stat>
          <StatLabel fontSize={"1rem"} textAlign='right' mr={2}>
            Changes
          </StatLabel>
        </Stat>
      </SimpleGrid>
      {logs &&
        logs.length > 0 &&
        logs.map((log: Log, idx: number) => {
          return (
            <Box key={log.id}>
              <SimpleGrid my={5} columns={{base: 1, sm: 2, lg: 5}} gap={5}>
                <Stat>
                  <StatLabel
                    fontSize={"1rem"}
                    display={{base: "block", lg: "none"}}
                    mb={2}
                  >
                    Time
                  </StatLabel>
                  <Text>{log.time}</Text>
                </Stat>
                <Stat>
                  <StatLabel
                    fontSize={"1rem"}
                    display={{base: "block", lg: "none"}}
                    mb={2}
                  >
                    Type
                  </StatLabel>
                  <Tag
                    size='md'
                    colorScheme={actionType[log.type].color}
                    borderRadius='full'
                  >
                    <TagLabel>{actionType[log.type].label}</TagLabel>
                  </Tag>
                </Stat>
                <Stat>
                  <StatLabel
                    fontSize={"1rem"}
                    display={{base: "block", lg: "none"}}
                    mb={2}
                  >
                    Action
                  </StatLabel>
                  <Tag
                    size='md'
                    colorScheme={
                      actionsColor[log.log.action as keyof typeof actionsColor]
                    }
                    borderRadius='full'
                  >
                    <TagLabel>{log.log.action}</TagLabel>
                  </Tag>
                </Stat>
                <Stat>
                  <StatLabel
                    fontSize={"1rem"}
                    display={{base: "block", lg: "none"}}
                    mb={2}
                  >
                    Causer
                  </StatLabel>
                  <Text>
                    {log.type === "driver_action"
                      ? log.log.driver_name
                      : log.log.causer.name}
                  </Text>
                </Stat>
                {log.type === "system_action" && (
                  <Flex justifyContent={"end"}>
                    <Button
                      colorScheme={"teal"}
                      variant='ghost'
                      size={"md"}
                      onClick={() => {
                        setSelectedLog(log.log);
                        onOpen();
                      }}
                    >
                      View
                    </Button>
                  </Flex>
                )}
              </SimpleGrid>
              {idx < logs.length - 1 && <Divider />}
            </Box>
          );
        })}
      <Drawer onClose={onClose} isOpen={isOpen} size='md'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>{"Job Log - Changed Values"}</DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody justifyContent={"center"} alignItems='center'>
            {selectedLog && selectedLog.action === "created" && (
              <SimpleGrid gap={4} columns={{base: 1, md: 2}}>
                {Object.keys(selectedLog)
                  .filter(
                    (key: string) =>
                      ![
                        "action",
                        "causer",
                        "causer_id",
                        "changed_values",
                      ].includes(key) && selectedLog[key] !== null
                  )
                  .map((key: string) => {
                    return (
                      <Stat key={key}>
                        <StatLabel
                          fontSize={"1rem"}
                          mb={2}
                          textTransform='capitalize'
                        >
                          {key.split("_").join(" ")}
                        </StatLabel>
                        <Text>{selectedLog[key]}</Text>
                      </Stat>
                    );
                  })}
              </SimpleGrid>
            )}
            {selectedLog && selectedLog.action === "updated" && (
              <SimpleGrid gap={4} columns={{base: 1, md: 2}}>
                {selectedLog.changed_values.map((key: string) => {
                  return (
                    <Stat key={key}>
                      <StatLabel
                        fontSize={"1rem"}
                        mb={2}
                        textTransform='capitalize'
                      >
                        {key.split("_").join(" ")}
                      </StatLabel>
                      <Text>{selectedLog[key]}</Text>
                    </Stat>
                  );
                })}
              </SimpleGrid>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
export default JobLogsList;
3;
