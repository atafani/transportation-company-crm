import {Spinner, useDisclosure, Box, Flex} from "@chakra-ui/react";
import {Table} from "main/components";
import {api} from "main/configs/axios.config";
import {NextPageWithLayout} from "main/configs/page.config";
import {useAuth} from "main/hooks";
import {useRouter} from "next/router";
import {useState} from "react";
import ClientDetailForm from "views/clients/detail";
import DetailDrawerWrapper from "views/common/detail-drawer-wrapper";

const Clients: NextPageWithLayout = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [editModel, setEditModel] = useState<any>();
  const [mode, setMode] = useState<"Add" | "Edit">();
  const {customer} = useAuth();
  const handleAdd = () => {
    setEditModel(null);
    setMode("Add");
    onOpen();
  };
  const handleEditView = async (id: number) => {
    const response = await api.get(`client/${id}`);
    setEditModel(response);
    setMode("Edit");
    onOpen();
  };
  const handleClose = () => {
    setEditModel(undefined);
    setMode(undefined);
    onClose();
  };

  return (
    <Box px={4} py={{base: 10, md: 0}} bg={"white"} borderRadius={"md"}>
      <Table
        controller={"client"}
        query={{customer_id: customer ? customer.id : ""}}
        showDelete={false}
        showAdd={true}
        handleAdd={handleAdd}
        handleEdit={handleEditView}
      />
      {editModel !== undefined && (
        <DetailDrawerWrapper
          controller={"client"}
          title={mode === "Add" ? "Add Client" : "Edit Client"}
          isOpen={isOpen}
          onClose={handleClose}
          data={editModel}
          mode={mode}
        >
          {editModel !== undefined ? (
            <ClientDetailForm data={editModel} mode={mode} />
          ) : (
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              w={"100%"}
              h={"100%"}
              my={10}
            >
              <Spinner />
            </Flex>
          )}
        </DetailDrawerWrapper>
      )}
    </Box>
  );
};

Clients.acl = {
  action: "read",
  subject: "clients",
};
Clients.authGuard = true;
export default Clients;
