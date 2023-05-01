import {FormControl, FormHelperText, FormLabel} from "@chakra-ui/form-control";
import {ViewOffIcon, ViewIcon} from "@chakra-ui/icons";
import {
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  VStack,
} from "@chakra-ui/react";
import {Autocomplete, PhoneInput} from "main/components";
import {useState} from "react";
import {Controller, useFormContext} from "react-hook-form";

export type ClientDTO = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

type ClientDetailFormProps = {
  data?: ClientDTO;
  mode?: "Add" | "Edit";
};

const ClientDetailForm = (props: ClientDetailFormProps) => {
  const {mode = "Add"} = props;
  const {control} = useFormContext();

  return (
    <form onSubmit={(e: any) => e.preventDefault()}>
      <VStack spacing={5}>
        <Controller
          control={control}
          name='name'
          rules={{
            required: "Name is required",
            minLength: {
              value: 3,
              message: "Name must have at least 3 characters.",
            },
          }}
          render={({field: {onChange, value}, fieldState: {error}}) => {
            return (
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Name</FormLabel>
                <Input value={value} onChange={onChange} type='text' />
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            );
          }}
        />
        <Controller
          control={control}
          name='phone'
          rules={{
            required: "Phone is required",
          }}
          render={({field: {onChange, value}, fieldState: {error}}) => {
            return (
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>Phone Number</FormLabel>
                <PhoneInput value={value} onChange={onChange} />
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            );
          }}
        />
        <Controller
          control={control}
          name='email'
          rules={{
            required: "E-mail is required",
            minLength: {
              value: 6,
              message: "E-mail must have at least 6 characters.",
            },
          }}
          render={({field: {onChange, value}, fieldState: {error}}) => {
            return (
              <FormControl isRequired isInvalid={!!error}>
                <FormLabel>E-mail</FormLabel>
                <Input value={value} onChange={onChange} type='text' />
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            );
          }}
        />
        <Controller
          control={control}
          name='address'
          rules={{
            required: "Field is required.",
            minLength: {
              value: 6,
              message: "Address must be at least 6 characters.",
            },
          }}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <FormControl isRequired isInvalid={!!error}>
              <FormLabel>Address:</FormLabel>
              <Autocomplete value={value} onChange={onChange} />
              {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
            </FormControl>
          )}
        />
      </VStack>
    </form>
  );
};

export default ClientDetailForm;
