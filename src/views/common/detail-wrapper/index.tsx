// ** React Imports
import {useState, ReactNode} from "react";
// ** Next Import
import router from "next/router";
import {FormProvider, useForm, UseFormHandleSubmit} from "react-hook-form";
import {api} from "main/configs/axios.config";
import {toast} from "react-toastify";
import {Box, Button, Flex} from "@chakra-ui/react";
import EventManager from "main/utils/event-manager";

type DetailWrapperProps = {
  controller: string;
  data?: any;
  children: ReactNode;
  showToolbar?: boolean;
  mode?: "Add" | "Edit" | "View";
  onSave?: (data: any) => void;
  toolbarActions?: ReactNode[];
  saveExternal?: boolean;
};

const DetailWrapper = ({
  children,
  data,
  controller,
  showToolbar = true,
  mode,
  onSave,
  saveExternal,
  toolbarActions,
}: DetailWrapperProps) => {
  const methods = useForm({defaultValues: {...data}});
  const {handleSubmit, formState, reset} = methods;

  const handleDelete = async (id: string | number) => {
    const response = await api.delete(`/${controller}/delete`);
    if (response !== null) {
      toast.success("Veprimi u krye me sukses");
      router.replace(`/${controller}s`);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    if (saveExternal) return;
    if (onSave) {
      onSave(formData);
      return;
    }
    const response: any =
      mode === "Add"
        ? await api.post(`${controller}`, {
            ...formData,
          })
        : await api.patch(`${controller}/${data.id}`, {...formData});
    if (response) {
      reset(response);
      const url = router.asPath.replace("new", response.id);
      router.replace(url);
      const message = `Data ${
        mode === "Add" ? "Added" : "Updated"
      } Succesfully.`;
      EventManager.raiseRefreshTable(controller);
      toast.success(message);
    }
  };
  return (
    <FormProvider {...methods}>
      <Box bg={"#fff"} py={10} px={{base: 5, md: 10}} borderRadius={10} mb={20}>
        {children}
      </Box>
      {showToolbar && (
        <Flex
          left={{base: 0, md: 20}}
          sx={{
            position: "fixed",
            bottom: 0,
            right: 0,
            p: 3,
            px: 20,
            boxShadow: "md",
            bg: "#fff",
            zIndex: 3,
          }}
          justifyContent='end'
          gap={5}
        >
          {toolbarActions && toolbarActions.map(() => toolbarActions)}
          <Button
            variant={"solid"}
            colorScheme='teal'
            onClick={handleSubmit(handleFormSubmit)}
            disabled={Object.keys(formState.dirtyFields).length === 0}
          >
            Save
          </Button>
        </Flex>
      )}
    </FormProvider>
  );
};

export default DetailWrapper;
