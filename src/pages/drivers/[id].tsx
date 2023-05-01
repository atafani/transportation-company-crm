import {Box, Flex, Spinner} from "@chakra-ui/react";
import {api} from "main/configs/axios.config";
import {NextPageWithLayout} from "main/configs/page.config";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import DetailWrapper from "views/common/detail-wrapper";
import DriverEditForm from "views/drivers/detail";

const Drivers: NextPageWithLayout = () => {
  const router = useRouter();
  const [model, setModel] = useState<any | null>();
  const [mode, setMode] = useState<"Add" | "Edit">();

  const fetchDriverData = useCallback(async (id: string) => {
    const res = await api.get(`user/driver/${id}`);
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
        fetchDriverData(id);
      }
      if (id === "new") {
        setModel(null);
        setMode("Add");
      }
    }
  }, [router, fetchDriverData]);
  return (
    <Box backgroundColor={"#fff"} p={{base: 0, lg: 4}} borderRadius={5}>
      {model !== undefined ? (
        <DetailWrapper controller='user/driver' data={model} mode={mode}>
          <DriverEditForm data={model} mode={mode} />
        </DetailWrapper>
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
    </Box>
  );
};
Drivers.acl = {
  action: "read",
  subject: "drivers",
};
Drivers.authGuard = true;
export default Drivers;
