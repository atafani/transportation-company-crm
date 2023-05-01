import {
  Icon,
  Td,
  Tr,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Button,
  Box,
  Flex,
  useDisclosure,
  AlertDialogOverlay,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Divider,
  Switch,
  Portal,
} from "@chakra-ui/react";
import {api} from "main/configs/axios.config";
import {useRef} from "react";
import {BsThreeDotsVertical} from "react-icons/bs";
import {TableAction, TableColumn} from "../utils/types";

interface RowProps {
  controller: string;
  row: Record<string, any>;
  onRefreshTable: () => void;
  actions?: TableAction[];
  showDelete?: boolean;
  showEdit?: boolean;
  handleEdit?: () => void;
  columns?: Record<string, TableColumn>;
}

const Row = (props: RowProps) => {
  const {
    row,
    columns,
    controller,
    handleEdit,
    onRefreshTable,
    showDelete,
    actions,
    showEdit,
  } = props;
  const {isOpen, onOpen, onClose} = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleDelete = async () => {
    const response = await api.delete(`${controller}/${row.id}`);
  };
  const renderCell = (data_type: string, value: any) => {
    if (data_type === "boolean") {
      return <Switch isChecked={value === 1} isReadOnly />;
    }
    return value;
  };
  return (
    <Tr
      sx={{
        height: "55px",
      }}
    >
      {columns &&
        Object.keys(columns).map(function (key: string, index) {
          return (
            <Td
              key={key}
              isNumeric={columns && typeof columns[key].data_type === "number"}
              sx={{textTransform: "capitalize"}}
            >
              {columns && renderCell(columns[key].data_type, row[key])}
            </Td>
          );
        })}

      {(showDelete || (actions && actions.length > 0) || showEdit) && (
        <>
          <Td
            style={{
              position: "sticky",
              right: "0",
              backgroundColor: "#fff ",
              zIndex: 1,
            }}
            px={0}
          >
            <Popover placement='top-end'>
              <PopoverTrigger>
                <Button variant={"ghost"}>
                  <Icon as={BsThreeDotsVertical} />
                </Button>
              </PopoverTrigger>
              <Portal>
                <Box zIndex={"popover"}>
                  <PopoverContent width={"fit-content"}>
                    <PopoverArrow />
                    <PopoverBody>
                      <Flex flexDirection={"column"}>
                        <Box>
                          {showDelete && (
                            <Button
                              variant={"ghost"}
                              style={{width: "100%"}}
                              colorScheme={"red"}
                              onClick={onOpen}
                              px={10}
                            >
                              Delete
                            </Button>
                          )}
                        </Box>
                        {actions?.map((action: TableAction) => {
                          return (
                            <Button
                              key={action.name}
                              variant={"ghost"}
                              style={{width: "100%"}}
                              colorScheme={action.color}
                              onClick={() =>
                                action.handleClick && action.handleClick(row.id)
                              }
                              px={10}
                            >
                              {action.name}
                            </Button>
                          );
                        })}
                        {actions && showDelete && <Divider />}
                        {showEdit && (
                          <Button
                            variant={"ghost"}
                            colorScheme='teal'
                            style={{width: "100%"}}
                            onClick={handleEdit}
                            px={10}
                          >
                            Edit
                          </Button>
                        )}
                      </Flex>
                    </PopoverBody>
                  </PopoverContent>
                </Box>
              </Portal>
            </Popover>
          </Td>
        </>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Confirm Delete
            </AlertDialogHeader>

            <Divider />
            <AlertDialogBody py={5}>
              Are you sure you want to delete this record?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme='red'
                onClick={() => {
                  onClose();
                  handleDelete();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Tr>
  );
};

export default Row;
