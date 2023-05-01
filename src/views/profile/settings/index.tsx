import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Text,
  Button,
  Flex,
  SimpleGrid,
  Switch,
} from "@chakra-ui/react";
import {Autocomplete, PhoneInput} from "main/components";
import {api} from "main/configs/axios.config";
import {useAuth} from "main/hooks";
import {useEffect} from "react";
import {Controller, useForm, useFormContext} from "react-hook-form";
import {toast} from "react-toastify";
import UserProfileForm from "../user";
type CompanySettingsProps = {};

type CompanyDTO = {
  name: string;
  vat_no: string;
  vat_percentage: string;
  office: string;
  warehouse: string;
  account_number: string;
  website: string;
  email: string;
  phone: string;
  automatic_invoice_send: boolean;
};
const CompanySettingsForm = (props: CompanySettingsProps) => {
  const {customer, handleGetCustomer} = useAuth();
  const {control, handleSubmit, formState, reset} = useForm<CompanyDTO>({
    defaultValues: customer,
  });
  const handleUpdateCompany = async (data: any) => {
    const response: CompanyDTO = await api.patch("auth/customer", data);
    if (response) {
      reset(response);
      handleGetCustomer();
      toast.success("Company's data updated successfully!");
    }
  };
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Flex flexDir='column' gap={3}>
        <SimpleGrid columns={{base: 1, md: 2}} gap={8}>
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
          <Controller
            control={control}
            name='website'
            render={({field: {onChange, value}}) => (
              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input value={value} onChange={onChange} type='text' />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name='vat_no'
            render={({field: {onChange, value}}) => (
              <FormControl>
                <FormLabel>VAT Number</FormLabel>
                <Input
                  value={value}
                  onChange={onChange}
                  type='text'
                  pattern='GB{3}'
                />
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
          <Controller
            control={control}
            name='office'
            render={({field: {onChange, value}}) => (
              <FormControl>
                <FormLabel>Office</FormLabel>
                <Autocomplete value={value} onChange={onChange} />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name='warehouse'
            render={({field: {onChange, value}}) => (
              <FormControl>
                <FormLabel>Warehouse</FormLabel>
                <Autocomplete value={value} onChange={onChange} />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name='account_number'
            render={({field: {onChange, value}}) => (
              <FormControl>
                <FormLabel>Account Number</FormLabel>
                <Input value={value} onChange={onChange} type='text' />
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name='automatic_invoice_send'
            render={({field: {onChange, value}}) => (
              <FormControl>
                <FormLabel>Send automatic invoice?</FormLabel>
                <Switch value={value ? 1 : 0} onChange={onChange} />
              </FormControl>
            )}
          />
        </SimpleGrid>
        <Flex
          mt={10}
          gap={10}
          flexDir={{base: "column", md: "row"}}
          justifyContent='end'
        >
          <Button
            variant={"outline"}
            color={"red.400"}
            borderColor={"red.100"}
            w='full'
            _hover={{
              color: "red.500",
              borderColor: "red.200",
            }}
            disabled={Object.keys(formState.dirtyFields).length === 0}
            onClick={() => reset()}
          >
            Cancel
          </Button>
          <Button
            bg={"teal.400"}
            color={"white"}
            w='full'
            _hover={{
              bg: "teal.500",
            }}
            disabled={Object.keys(formState.dirtyFields).length === 0}
            onClick={() => handleSubmit(handleUpdateCompany)()}
          >
            Update
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};
export default CompanySettingsForm;
