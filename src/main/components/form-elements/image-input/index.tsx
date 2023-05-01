import {
  AspectRatio,
  Box,
  BoxProps,
  Container,
  forwardRef,
  Heading,
  Input,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";
import {motion, useAnimation} from "framer-motion";
import {useState} from "react";

const PreviewImage = forwardRef<BoxProps, typeof Box>((props, ref) => {
  return (
    <Box
      bg='white'
      top='0'
      height='100%'
      width='100%'
      position='absolute'
      rounded='sm'
      as={motion.div}
      backgroundSize='cover'
      backgroundRepeat='no-repeat'
      backgroundPosition='center'
      {...props}
      ref={ref}
    />
  );
});

type ImageInputProps = {
  value?: any;
  onChange: (value: any) => void;
};

const ImageInput = (props: ImageInputProps) => {
  const {onChange} = props;
  const controls = useAnimation();
  const startAnimation = () => controls.start("hover");
  const stopAnimation = () => controls.stop();
  const [imgData, setImageData] = useState<string>();
  const [errors, setErrors] = useState<string>();

  const handleFileChange = async (e: any) => {
    const {
      target: {files},
    } = e;
    const cancel = !files.length;
    if (cancel) return;
    let fileErrors;
    const {size, type} = files[0];

    setErrors(fileErrors);
    if (!fileErrors) {
      onChange(files[0]);
      const url = URL.createObjectURL(files[0]);
      setImageData(url);
    }
  };
  return (
    <Container>
      <AspectRatio width='64' py={4} mx={"auto"}>
        <Box
          borderColor='#E2E8F0'
          borderStyle='dashed'
          borderWidth='1px'
          rounded='md'
          shadow='sm'
          role='group'
          transition='all 150ms ease-in-out'
          _hover={{
            shadow: "md",
          }}
          as={motion.div}
          initial='rest'
          animate='rest'
          whileHover='hover'
        >
          <Box position='relative' height='100%' width='100%'>
            <Box
              position='absolute'
              top='0'
              left='0'
              height='100%'
              width='100%'
              display='flex'
              flexDirection='column'
              justifyContent='center'
            >
              {imgData ? (
                <Image alt='Uploaded Image' src={imgData} />
              ) : (
                <Stack
                  height='100%'
                  width='100%'
                  display='flex'
                  alignItems='center'
                  justify='center'
                >
                  <Box height='10' width='10' position='relative'>
                    <PreviewImage backgroundImage="url('/images/image-icon.png')" />
                  </Box>
                  <Stack py='3' textAlign='center' spacing='1'>
                    <Heading fontSize='lg' color='gray.700' fontWeight='bold'>
                      Drop images here
                    </Heading>
                    <Text fontWeight='light'>or click to upload</Text>
                  </Stack>
                </Stack>
              )}
            </Box>
            <Input
              type='file'
              height='100%'
              width='100%'
              position='absolute'
              top='0'
              left='0'
              opacity='0'
              aria-hidden='true'
              accept='image/*'
              onDragEnter={startAnimation}
              onDragLeave={stopAnimation}
              onChange={handleFileChange}
            />
          </Box>
        </Box>
      </AspectRatio>
    </Container>
  );
};

export default ImageInput;
