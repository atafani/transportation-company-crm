import {Box, Container, Flex} from "@chakra-ui/layout";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import {api} from "main/configs/axios.config";
import EventManager from "main/utils/event-manager";
import {ReactNode} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {toast} from "react-toastify";

interface DetailDrawerWrapperProps {
  controller: string;
  title?: string;
  data?: any;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  mode?: "Add" | "Edit" | "View";
}
const DetailDrawerWrapper = (props: DetailDrawerWrapperProps) => {
  const {
    controller,
    data,
    children,
    isOpen,
    onClose,
    mode = "Add",
    title,
  } = props;

  const methods = useForm({defaultValues: {...data}});
  const {control, handleSubmit, reset, formState, watch} = methods;

  const handleFormSubmit = async (formData: any) => {
    const url: string =
      mode === "Add" ? `${controller}` : `${controller}/${data.id}`;
    const method: string = mode === "Add" ? "POST" : "PATCH";
    const response: any = await api({method, url, data: formData});
    if (response) {
      reset(response);
      const message = `Data ${
        mode === "Add" ? "Added" : "Updated"
      } Succesfully.`;
      EventManager.raiseRefreshTable(controller);
      toast.success(message);
    }
    onClose();
  };

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size='md'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader boxShadow={"sm"}>{title ? title : mode}</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody
          justifyContent={"center"}
          alignItems='center'
          py={{base: 10, md: 5}}
        >
          <FormProvider {...methods}>
            <Box sx={{paddingBottom: "5rem"}}>{children}</Box>
          </FormProvider>
        </DrawerBody>
        <DrawerFooter>
          {mode !== "View" && (
            <Flex
              zIndex={9}
              justifyContent={"end"}
              alignItems='center'
              gap='5'
              backgroundColor={"white"}
            >
              <Button
                variant='ghost'
                colorScheme='red'
                disabled={Object.keys(formState.dirtyFields).length === 0}
                onClick={() => {
                  reset();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme={"teal"}
                disabled={Object.keys(formState.dirtyFields).length === 0}
                onClick={handleSubmit(handleFormSubmit)}
              >
                Save
              </Button>
            </Flex>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DetailDrawerWrapper;
