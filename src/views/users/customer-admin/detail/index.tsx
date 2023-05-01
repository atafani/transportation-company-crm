import {FormControl, FormHelperText, FormLabel} from "@chakra-ui/form-control";
import {ViewOffIcon, ViewIcon} from "@chakra-ui/icons";
import {
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Switch,
  VStack,
} from "@chakra-ui/react";
import {Lookup, PhoneInput} from "main/components";
import {useEffect, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";

type CustomerAdminDTO = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  active?: boolean;
  customer_id: number;
};

type CustomerAdminDetailFormProps = {
  data?: CustomerAdminDTO;
  mode?: "Add" | "Edit" | "View";
  customerId?: number;
};

const CustomerAdminDetailForm = (props: CustomerAdminDetailFormProps) => {
  const {mode = "Add", customerId} = props;

  const {control, setValue} = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    customerId && mode === "Add" && setValue("customer_id", customerId);
  }, [customerId, mode, setValue]);

  return (
    <form onSubmit={(e: any) => e.preventDefault()}>
      <VStack spacing={3}>
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
                <Input
                  value={value}
                  onChange={onChange}
                  type='text'
                  readOnly={mode === "View"}
                />
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
        {mode === "Add" && (
          <Controller
            control={control}
            name='password'
            rules={{
              required: "Field is required.",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters.",
              },
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <FormControl isInvalid={!!error} isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={`${showPassword ? "text" : "password"}`}
                    value={value}
                    onChange={onChange}
                  />
                  <InputRightElement
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </InputRightElement>
                </InputGroup>
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
        )}
        {mode === "Add" && (
          <Controller
            control={control}
            name='customer_id'
            rules={{
              required: "Field is required.",
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <FormControl isInvalid={!!error} isRequired hidden={!!customerId}>
                <FormLabel>Transport Company</FormLabel>
                <Lookup
                  value={value}
                  onChange={onChange}
                  controller='client'
                  title='Choose a Trasport Company'
                />
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
        )}
        {mode === "Edit" && (
          <Controller
            control={control}
            name='active'
            rules={{
              required: "Field is required.",
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <FormControl isInvalid={!!error} isRequired>
                <FormLabel>Is Active?</FormLabel>
                <Switch
                  isChecked={value === 1}
                  onChange={(e: any) => onChange(e.target.checked ? 1 : 0)}
                />
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
        )}
      </VStack>
    </form>
  );
};

export default CustomerAdminDetailForm;
