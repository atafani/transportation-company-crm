import {Box, useDisclosure} from "@chakra-ui/react";
import {Table} from "main/components";
import {NextPageWithLayout} from "main/configs/page.config";
import {useAuth} from "main/hooks";
import {useRouter} from "next/router";

const Drivers: NextPageWithLayout = () => {
  const router = useRouter();
  const {customer} = useAuth();

  const handleAdd = () => {
    router.push("drivers/new");
  };
  const handleEditView = async (id: number) => {
    router.push(`drivers/${id}`);
  };

  return (
    <Box px={4} py={{base: 10, md: 0}} bg={"white"} borderRadius={"md"}>
      <Table
        controller={"user/driver"}
        query={{customer_id: customer ? customer.id : ""}}
        showDelete={false}
        showAdd={true}
        handleAdd={handleAdd}
        handleEdit={handleEditView}
      />
    </Box>
  );
};
Drivers.acl = {
  action: "read",
  subject: "drivers",
};
Drivers.authGuard = true;
export default Drivers;
