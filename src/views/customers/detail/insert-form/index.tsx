import {FormControl, FormLabel} from "@chakra-ui/form-control";
import {ViewOffIcon, ViewIcon} from "@chakra-ui/icons";
import {
  FormErrorMessage,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import {Autocomplete, PhoneInput, Section} from "main/components";
import {CustomerDTO, UserDTO} from "main/models";
import {useState} from "react";
import {Controller, useFormContext} from "react-hook-form";

type CustomerDetailDTO = {
  customer: CustomerDTO;
  user: UserDTO;
};

const CustomerInsertForm = () => {
  const {control, reset, formState, setValue} =
    useFormContext<CustomerDetailDTO>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={(e: any) => e.preventDefault()}>
      <Section title={"Transport Company Details"}>
        <>
          <SimpleGrid columns={{base: 1, md: 2}} gap={6} mb={5}>
            <Controller
              control={control}
              name='customer.name'
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
              name='customer.email'
              rules={{
                required: "Field is required.",
                minLength: {
                  value: 6,
                  message: "E-mail must be at least 6 characters.",
                },
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <FormControl isInvalid={!!error} isRequired>
                  <FormLabel>E-mail</FormLabel>
                  <Input value={value} onChange={onChange} />
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='customer.phone'
              render={({field: {onChange, value}}) => (
                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <PhoneInput value={value} onChange={onChange} />
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='customer.account_number'
              render={({field: {onChange, value}}) => (
                <FormControl isRequired>
                  <FormLabel>Account No.</FormLabel>
                  <Input value={value} onChange={onChange} type={"text"} />
                </FormControl>
              )}
            />
          </SimpleGrid>
          <SimpleGrid columns={{base: 1, md: 2}} gap={6} mb={5}>
            <Controller
              control={control}
              name='customer.office'
              rules={{
                required: "Office Address is required",
                minLength: {
                  value: 6,
                  message: "Office Address must have at least 6 characters.",
                },
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isRequired isInvalid={!!error}>
                    <FormLabel>Office Address</FormLabel>
                    <Autocomplete
                      value={value}
                      onChange={onChange}
                      setPostalCode={(value: string) =>
                        setValue("customer.office_postal_code", value)
                      }
                    />
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                );
              }}
            />
            <Controller
              control={control}
              name='customer.warehouse'
              rules={{
                required: "Warehouse Address is required",
                minLength: {
                  value: 6,
                  message: "Warehouse Address must have at least 6 characters.",
                },
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isRequired isInvalid={!!error}>
                    <FormLabel>Warehouse Address</FormLabel>
                    <Autocomplete
                      value={value}
                      onChange={onChange}
                      setPostalCode={(value: string) =>
                        setValue("customer.warehouse_postal_code", value)
                      }
                    />
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                );
              }}
            />
          </SimpleGrid>
          <SimpleGrid columns={{base: 1, md: 2}} gap={6} mb={5}>
            <Controller
              control={control}
              name='customer.vat_no'
              render={({field: {onChange, value}}) => (
                <FormControl>
                  <FormLabel>VAT No.</FormLabel>
                  <Input value={value} onChange={onChange} type='text' />
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='customer.vat_percentage'
              render={({field: {onChange, value}}) => (
                <FormControl>
                  <FormLabel>VAT (%)</FormLabel>
                  <Input value={value} onChange={onChange} type='percentage' />
                </FormControl>
              )}
            />
          </SimpleGrid>
        </>
      </Section>
      <Section title={"Administrator Details"}>
        <SimpleGrid columns={{base: 1, md: 2}} gap={6}>
          <Controller
            control={control}
            name='user.name'
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
            name='user.email'
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
            name='user.password'
            rules={{
              required: "Field is required.",
              minLength: {
                value: 6,
                message: "E-mail must be at least 6 characters.",
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
          <Controller
            control={control}
            name='user.phone'
            render={({field: {onChange, value = "admin"}}) => (
              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <PhoneInput value={value} onChange={onChange} />
              </FormControl>
            )}
          />
        </SimpleGrid>
      </Section>
    </form>
  );
};

export default CustomerInsertForm;
