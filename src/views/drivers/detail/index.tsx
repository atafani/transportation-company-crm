import {FormControl, FormLabel} from "@chakra-ui/form-control";
import {ViewOffIcon, ViewIcon} from "@chakra-ui/icons";
import {
  FormErrorMessage,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Switch,
} from "@chakra-ui/react";
import {PhoneInput, Section} from "main/components";
import {useAuth} from "main/hooks";
import {useEffect, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import JobTable from "views/jobs";

type DriverEditFormProps = {
  data?: any;
  mode?: "Add" | "Edit" | "View";
};

const DriverEditForm = (props: DriverEditFormProps) => {
  const {data, mode = "Add"} = props;
  const {control, reset, formState, setValue, watch} = useFormContext<any>();
  const [showPassword, setShowPassword] = useState(false);
  const {customer} = useAuth();

  useEffect(() => {
    if (customer) setValue("customer_id", customer.id);
  }, [customer, setValue]);

  return (
    <form onSubmit={(e: any) => e.preventDefault()}>
      <Section title={"Driver Details"}>
        <SimpleGrid columns={{base: 1, md: 2}} gap={5}>
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
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
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
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
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
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
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
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
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
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
          )}
          {mode === "Edit" && (
            <Controller
              control={control}
              name='customer_id'
              rules={{
                required: "Field is required.",
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <FormControl isInvalid={!!error} isRequired hidden>
                  <FormLabel>Transport Company</FormLabel>
                  <Input type={"text"} value={value} />
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
          )}
        </SimpleGrid>
      </Section>
      {data && (
        <Section title={"Jobs"}>
          <JobTable query={{driver_id: data.id}} />
        </Section>
      )}
    </form>
  );
};

export default DriverEditForm;