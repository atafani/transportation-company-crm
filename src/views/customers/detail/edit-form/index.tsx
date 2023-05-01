import {FormControl, FormLabel} from "@chakra-ui/form-control";
import {
  FormErrorMessage,
  HStack,
  Input,
  SimpleGrid,
  Switch,
  VStack,
} from "@chakra-ui/react";
import {Autocomplete, PhoneInput, Section} from "main/components";
import {CustomerDTO} from "main/models";
import {Controller, useFormContext} from "react-hook-form";
import {CustomerAdminTable, ManagerTable} from "views/users";

type CustomerEditFormProps = {
  data?: CustomerDTO;
  mode?: "Add" | "Edit" | "View";
};

const CustomerEditForm = (props: CustomerEditFormProps) => {
  const {data, mode = "Add"} = props;
  const {control, reset, formState, setValue, watch} = useFormContext<any>();
  return (
    <form onSubmit={(e: any) => e.preventDefault()}>
      <Section title={"Transport Company Details"}>
        <>
          <SimpleGrid columns={{base: 1, md: 2}} gap={6} mb={5}>
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
              name='phone'
              render={({field: {onChange, value}}) => (
                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <PhoneInput value={value} onChange={onChange} />
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='account_number'
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
              name='office'
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
                        setValue("office_postal_code", value)
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
              name='warehouse'
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
                        setValue("warehouse_postal_code", value)
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
              name='vat_no'
              render={({field: {onChange, value}}) => (
                <FormControl>
                  <FormLabel>VAT No.</FormLabel>
                  <Input value={value} onChange={onChange} type='text' />
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='vat_percentage'
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
      <Section title={"Administrators"}>
        <CustomerAdminTable query={data ? {customer_id: data.id} : {}} />
      </Section>
      <Section title={"Managers"}>
        <ManagerTable query={data ? {customer_id: data.id} : {}} />
      </Section>
    </form>
  );
};

export default CustomerEditForm;
