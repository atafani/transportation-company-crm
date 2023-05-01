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
import {useAuth} from "main/hooks";
import {useEffect, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";

type UserDetailFormProps = {
  data?: any;
  mode?: "Add" | "Edit" | "View";
};

const UserDetailForm = (props: UserDetailFormProps) => {
  const {mode = "Add"} = props;
  const {control} = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

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
          name='password'
          rules={{
            required: "Field is required.",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters.",
            },
          }}
          render={({field: {onChange, value}, fieldState: {error}}) => (
            <FormControl isInvalid={!!error} isRequired hidden={mode !== "Add"}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={`${showPassword ? "text" : "password"}`}
                  value={value}
                  onChange={onChange}
                  readOnly={mode === "View"}
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
          name='role'
          render={({field: {onChange, value = "admin"}}) => (
            <FormControl isRequired>
              <FormLabel>Role</FormLabel>
              <Select
                value={value}
                onChange={onChange}
                itemType='string'
                isDisabled={mode === "View"}
              >
                <option selected value={"admin"}>
                  Admin
                </option>
                <option value={"manager"}>Manager</option>
                <option value={"driver"}>Driver</option>
              </Select>
            </FormControl>
          )}
        />
      </VStack>
    </form>
  );
};

export default UserDetailForm;
