import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Center,
  Container,
  Flex,
  Box,
  InputRightElement,
  InputGroup,
  VStack,
} from "@chakra-ui/react";
import {useForm, Controller} from "react-hook-form";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {ReactElement, useState} from "react";
import {useAuth} from "main/hooks";
import {NextPageWithLayout} from "main/configs/page.config";

const Login: NextPageWithLayout = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {handleLogin} = useAuth();
  const {
    handleSubmit,
    control,
    formState: {errors},
    setError,
  } = useForm();

  const onSubmit = (data: any) => {
    handleLogin(data);
  };

  return (
    <Container centerContent minH={"100vh"}>
      <Flex minH={"100vh"}>
        <Center>
          <Box
            borderRadius='md'
            boxShadow={{base: "none", md: "md"}}
            h='fit-content'
            px={10}
            py={20}
          >
            <form onSubmit={(e) => e.preventDefault()} style={{minWidth: 300}}>
              <VStack spacing={5}>
                <Controller
                  control={control}
                  name='email'
                  rules={{required: "Field is required."}}
                  render={({field: {onChange, value}, fieldState: {error}}) => (
                    <FormControl isInvalid={!!error} isRequired>
                      <FormLabel>E-mail:</FormLabel>
                      <Input type='text' value={value} onChange={onChange} />
                      {error && (
                        <FormErrorMessage>{error.message}</FormErrorMessage>
                      )}
                    </FormControl>
                  )}
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
                <Button
                  colorScheme='teal'
                  color={"#fff"}
                  variant='solid'
                  onClick={handleSubmit(onSubmit)}
                  marginTop={4}
                  width={"100%"}
                >
                  Log In
                </Button>
              </VStack>
            </form>
          </Box>
        </Center>
      </Flex>
    </Container>
  );
};

Login.authGuard = false;
Login.getLayout = (page: ReactElement) => <>{page}</>;
export default Login;
