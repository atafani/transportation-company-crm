import {ViewOffIcon, ViewIcon} from "@chakra-ui/icons";
import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Text,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Box,
  Flex,
  Button,
} from "@chakra-ui/react";
import {Autocomplete} from "main/components";
import {api} from "main/configs/axios.config";
import {useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {toast} from "react-toastify";

type ChangePasswordDTO = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};
interface IShowChangePasswordInputs {
  showNewPassword: boolean;
  showCurrentPassword: boolean;
  showConfirmNewPassword: boolean;
}
const SecurityForm = () => {
  const {control, handleSubmit, setError, formState, reset} =
    useForm<ChangePasswordDTO>({
      defaultValues: {
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      },
    });

  const [values, setValues] = useState<IShowChangePasswordInputs>({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false,
  });

  const handleChangePassword = async (data: ChangePasswordDTO) => {
    if (data.new_password !== data.new_password_confirmation) {
      setError(
        "new_password_confirmation",
        {
          message: "Does not match new password.",
        },
        {shouldFocus: true}
      );
    } else {
      const response: any = await api.patch("auth/change-password", data);
      if (response) {
        toast.success("Password changed successfully.");
      }
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <SimpleGrid columns={{base: 1, lg: 2}}>
        <Flex gap={5} flexDir='column'>
          <Controller
            control={control}
            name='current_password'
            rules={{
              required: "Field is required.",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters.",
              },
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <FormControl isInvalid={!!error} isRequired>
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                  <Input
                    type={`${values.showCurrentPassword ? "text" : "password"}`}
                    value={value}
                    onChange={onChange}
                  />
                  <InputRightElement
                    onClick={() =>
                      setValues({
                        ...values,
                        showCurrentPassword: !values.showCurrentPassword,
                      })
                    }
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    {values.showCurrentPassword ? (
                      <ViewOffIcon />
                    ) : (
                      <ViewIcon />
                    )}
                  </InputRightElement>
                </InputGroup>
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name='new_password'
            rules={{
              required: "Field is required.",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters.",
              },
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <FormControl isInvalid={!!error} isRequired>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={`${values.showNewPassword ? "text" : "password"}`}
                    value={value}
                    onChange={onChange}
                  />
                  <InputRightElement
                    onClick={() =>
                      setValues({
                        ...values,
                        showNewPassword: !values.showNewPassword,
                      })
                    }
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    {values.showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </InputRightElement>
                </InputGroup>
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name='new_password_confirmation'
            rules={{
              required: "Field is required.",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters.",
              },
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <FormControl isInvalid={!!error} isRequired>
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={`${
                      values.showConfirmNewPassword ? "text" : "password"
                    }`}
                    value={value}
                    onChange={onChange}
                  />
                  <InputRightElement
                    onClick={() =>
                      setValues({
                        ...values,
                        showConfirmNewPassword: !values.showConfirmNewPassword,
                      })
                    }
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    {values.showConfirmNewPassword ? (
                      <ViewOffIcon />
                    ) : (
                      <ViewIcon />
                    )}
                  </InputRightElement>
                </InputGroup>
                {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
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
              onClick={() => handleSubmit(handleChangePassword)()}
            >
              Change
            </Button>
          </Flex>
        </Flex>
      </SimpleGrid>
    </form>
  );
};
export default SecurityForm;
