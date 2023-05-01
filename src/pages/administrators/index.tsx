import {Spinner, useDisclosure, Box, Flex} from "@chakra-ui/react";
import {Table} from "main/components";
import {api} from "main/configs/axios.config";
import {NextPageWithLayout} from "main/configs/page.config";
import {useAuth} from "main/hooks";
import {useState} from "react";
import DetailDrawerWrapper from "views/common/detail-drawer-wrapper";
import CustomerAdminDetailForm from "views/users/customer-admin/detail";

const Administrators: NextPageWithLayout = () => {
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
    const response = await api.get(`user/supermanager/${id}`);
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
        controller={"user/supermanager"}
        query={{customer_id: customer ? customer.id : ""}}
        showDelete={false}
        showAdd={true}
        handleAdd={handleAdd}
        handleEdit={handleEditView}
      />
      {editModel !== undefined && (
        <DetailDrawerWrapper
          controller={"user/supermanager"}
          title={mode === "Add" ? "Add Administrator" : "Edit Administrator"}
          isOpen={isOpen}
          onClose={handleClose}
          data={editModel}
          mode={mode}
        >
          {editModel !== undefined ? (
            <CustomerAdminDetailForm
              data={editModel}
              mode={mode}
              customerId={customer ? customer.id : undefined}
            />
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
Administrators.acl = {
  action: "read",
  subject: "administrators",
};
Administrators.authGuard = true;
export default Administrators;
