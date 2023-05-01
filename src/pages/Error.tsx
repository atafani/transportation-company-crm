// ** React Imports
import {Button} from "@chakra-ui/react";
import Link from "next/link";

const Error = () => {
  return (
    <div className='misc-wrapper'>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Page Not Found 🕵🏻‍♀️</h2>
          <p className='mb-2'>
            Oops! 😖 The requested URL was not found on this server.
          </p>
          <Button color='primary' className='btn-sm-block mb-2'>
            <Link href='/'>Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Error;
