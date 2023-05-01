import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Text,
  VStack,
  SimpleGrid,
  Button,
  Flex,
} from "@chakra-ui/react";
import {PhoneInput} from "main/components";
import {api} from "main/configs/axios.config";
import {useAuth} from "main/hooks";
import {UserDTO} from "main/models";
import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {toast} from "react-toastify";

type UserProfileFormProps = {};

const UserProfileForm = (props: UserProfileFormProps) => {
  const {user, handleGetUser} = useAuth();
  const {control, handleSubmit, setValue, formState, reset} = useForm<UserDTO>({
    defaultValues: user,
  });
  const handleUpdateUser = async (data: UserDTO) => {
    const response: UserDTO = await api.patch("auth/user", data);
    if (response) {
      reset(response);
      toast.success("Profile Updated Succesfully.");
      handleGetUser();
    }
  };
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <SimpleGrid columns={{base: 1, lg: 2}}>
        <Flex flexDir='column' gap={5}>
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
            name='role'
            render={({field: {onChange, value}}) => (
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Input value={value} onChange={onChange} type='text' readOnly />
              </FormControl>
            )}
          />
          <Flex mt={10} gap={10}>
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
              onClick={() => handleSubmit(handleUpdateUser)()}
            >
              Update
            </Button>
          </Flex>
        </Flex>
      </SimpleGrid>
    </form>
  );
};
export default UserProfileForm;
