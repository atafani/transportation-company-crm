// ** React Imports
import {Box, Button} from "@chakra-ui/react";
import Link from "next/link";

const NotAuthorized = () => {
  return (
    <Box
      w='100vw'
      h='100vh'
      display={"flex"}
      flexDirection='column'
      justifyContent={"center"}
      alignItems='center'
    >
      <h2 className='mb-1'>You do not access to this page! 🔐</h2>
      <Link href='/dashboard'>
        <Button colorScheme={"teal"} variant='solid' my={3}>
          Back to Home
        </Button>
      </Link>
    </Box>
  );
};
export default NotAuthorized;
