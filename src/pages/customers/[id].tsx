import {Box, Flex, Spinner} from "@chakra-ui/react";
import {api} from "main/configs/axios.config";
import {NextPageWithLayout} from "main/configs/page.config";
import {eRequestMethod} from "main/enums";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import DetailWrapper from "views/common/detail-wrapper";
import CustomerDetailForm from "views/customers/detail";

const Customers: NextPageWithLayout = () => {
  const router = useRouter();
  const [model, setModel] = useState<any | null>();
  const [mode, setMode] = useState<"Add" | "Edit">();

  const fetchCustomerData = useCallback(async (id: string) => {
    const res = await api.get(`customer/${id}`);
    if (res) {
      setModel(res);
      setMode("Edit");
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.isReady) {
      const id = router.query.id;
      if (id && !Array.isArray(id) && id !== "new") {
        fetchCustomerData(id);
      }
      if (id === "new") {
        setModel(null);
        setMode("Add");
      }
    }
  }, [router, fetchCustomerData]);
  return (
    <Box backgroundColor={"#fff"} p={{base: 0, lg: 4}} borderRadius={5}>
      {model !== undefined ? (
        <DetailWrapper controller='customer' data={model} mode={mode}>
          <CustomerDetailForm data={model} mode={mode} />
        </DetailWrapper>
      ) : (
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          w={"100%"}
          h={"100%"}
        >
          <Spinner my={10} />
        </Flex>
      )}
    </Box>
  );
};
Customers.acl = {
  action: "read",
  subject: "customers",
};
Customers.authGuard = true;
export default Customers;
