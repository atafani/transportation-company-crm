import {Flex, Spinner, useDisclosure} from "@chakra-ui/react";
import {Table} from "main/components";
import {api} from "main/configs/axios.config";
import {useState} from "react";
import DetailDrawerWrapper from "views/common/detail-drawer-wrapper";
import CustomerAdminDetailForm from "./detail";

type CustomerAdminTableProps = {
  query?: Record<string, any>;
};
const CustomerAdminTable = (props: CustomerAdminTableProps) => {
  const {query} = props;
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [editModel, setEditModel] = useState<any>();
  const [mode, setMode] = useState<"Add" | "Edit">();

  const handleRestrict = (id: number) => {
    console.log(id);
  };

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
    <>
      <Table
        controller={"user/supermanager"}
        actions={[
          {
            name: "Restrict",
            color: "red",
            handleClick: (id: number) => handleRestrict(id),
          },
        ]}
        showDelete={false}
        query={query}
        showAdd={true}
        handleAdd={() => handleAdd()}
        handleEdit={(id: number) => handleEditView(id)}
      />
      {editModel !== undefined && (
        <DetailDrawerWrapper
          controller={"user/supermanager"}
          isOpen={isOpen}
          onClose={handleClose}
          data={editModel}
          mode={mode}
        >
          {editModel !== undefined ? (
            <CustomerAdminDetailForm data={editModel} mode={mode} />
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
    </>
  );
};
export default CustomerAdminTable;
