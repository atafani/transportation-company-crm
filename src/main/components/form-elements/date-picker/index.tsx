import {
  Box,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import {useState} from "react";
import DatePickerReact from "react-datepicker";
import {BsCalendar3} from "react-icons/bs";

interface DatePickerProps {
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
  minValue?: Date;
}

const DatePicker = (props: DatePickerProps) => {
  const {onChange, value, disabled = false, minValue} = props;
  const [startDate, setStartDate] = useState<Date>(
    value ? new Date(value) : new Date()
  );
  const {isOpen, onClose, onOpen} = useDisclosure();

  const handleOnChange = (date: Date) => {
    if (date) {
      setStartDate(date);
      onChange(date.toISOString().split("T")[0]);
      onClose();
    }
  };
  const StyledDatepicker = styled("div")((props) => ({
    width: "100%",
    ".react-datepicker": {
      width: "100%",
      fontSize: "1rem",
    },
    ".react-datepicker__month-container": {
      width: "100%",
      border: 0,
    },
    ".react-datepicker__header, .react-datepicker__header div": {
      backgroundColor: "teal",
      color: "#fff",
    },
    ".react-datepicker__navigation": {
      top: "1.2rem",
    },
    ".react-datepicker__day--selected,.react-datepicker__day--keyboard-selected":
      {
        color: "#fff",
        backgroundColor: "teal",
      },
    ".react-datepicker__month": {
      border: 0,
    },
  }));

  return (
    <>
      <InputGroup
        size='sm'
        px={4}
        my={2}
        borderRadius='md'
        sx={{border: "1px solid #E2E8F0", padding: "0.2rem"}}
      >
        <Input
          focusBorderColor='none'
          outline={0}
          border={0}
          value={value}
          onClick={disabled ? undefined : (e: any) => onOpen()}
          disabled={disabled ? disabled : false}
        />
        <IconButton
          title='Open'
          aria-label='Open'
          bg='none'
          border='none'
          onClick={onOpen}
          icon={<Icon as={BsCalendar3} />}
        />
      </InputGroup>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={{base: 5, md: 0}}>
          <ModalHeader>Choose Date</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb={5}>
            <StyledDatepicker>
              <DatePickerReact
                selected={startDate}
                onChange={handleOnChange}
                shouldCloseOnSelect={true}
                onClickOutside={onClose}
                inline
                onCalendarClose={onClose}
                dateFormat='dd/mm/yyyy'
                minDate={minValue ? minValue : new Date()}
              />
            </StyledDatepicker>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DatePicker;
