import {Flex, Spinner, useDisclosure} from "@chakra-ui/react";
import {Table} from "main/components";
import {api} from "main/configs/axios.config";
import {AbilityContext} from "main/context/abilityContext";
import {useContext, useState} from "react";
import DetailDrawerWrapper from "views/common/detail-drawer-wrapper";
import AdminDetailForm from "./detail";

const AdminTable = () => {
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

  const handleEdit = async (id: number) => {
    const response = await api.get(`user/admin/${id}`);
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
        controller={"user/admin"}
        actions={[
          {
            name: "Restrict",
            color: "red",
            handleClick: (id: number) => handleRestrict(id),
          },
        ]}
        showDelete={false}
        showAdd={true}
        handleAdd={() => handleAdd()}
        handleEdit={(id: number) => handleEdit(id)}
      />
      {editModel !== undefined && (
        <DetailDrawerWrapper
          controller={"user/admin"}
          isOpen={isOpen}
          onClose={handleClose}
          data={editModel}
          mode={mode}
        >
          {editModel !== undefined ? (
            <AdminDetailForm data={editModel} mode={mode} />
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
export default AdminTable;
