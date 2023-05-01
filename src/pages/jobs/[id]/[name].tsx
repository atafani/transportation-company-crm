import {Box, Flex, Spinner} from "@chakra-ui/react";
import {api} from "main/configs/axios.config";
import {NextPageWithLayout} from "main/configs/page.config";
import {ClientDTO, JobDTO} from "main/models";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import DetailWrapper from "views/common/detail-wrapper";
import JobLogsList from "views/jobs/logs";

export type JobDetailDTO = {
  client: ClientDTO;
  job: JobDTO;
};

const JobLogs: NextPageWithLayout = () => {
  const router = useRouter();
  const [logs, setLogs] = useState<any>();

  const fetchJobLogData = useCallback(async (id: string) => {
    const jobLogRes: any = await api.get(`job/${id}/logs`);
    jobLogRes && setLogs(jobLogRes);
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.isReady) {
      const id = router.query.id;
      if (id && !Array.isArray(id) && id !== "new") {
        fetchJobLogData(id);
      }
    }
  }, [router, fetchJobLogData]);

  return (
    <Box backgroundColor={"#fff"} p={4} borderRadius={5}>
      {logs ? (
        <JobLogsList logs={logs} />
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
JobLogs.acl = {
  action: "read",
  subject: "jobs",
};
JobLogs.authGuard = true;
export default JobLogs;
