import {Box} from "@chakra-ui/react";
import {Table} from "main/components";
import {NextPageWithLayout} from "main/configs/page.config";
import {useRouter} from "next/router";

const Customers: NextPageWithLayout = () => {
  const router = useRouter();
  const handleRestrict = (id: number) => {
    console.log(id);
  };
  const handleAdd = () => {
    router.push("customers/new");
  };
  const handleView = async (id: number) => {
    router.push(`customers/${id}`);
  };

  return (
    <Box px={4} py={{base: 10, md: 0}} bg={"white"} borderRadius={"md"}>
      <Table
        controller={"customer"}
        actions={[
          {
            name: "Restrict",
            color: "red",
            handleClick: (id: number) => handleRestrict(id),
          },
        ]}
        showDelete={false}
        showAdd={true}
        handleAdd={handleAdd}
        handleEdit={handleView}
      />
    </Box>
  );
};
Customers.acl = {
  action: "read",
  subject: "customers",
};
Customers.authGuard = true;
export default Customers;
