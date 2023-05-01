import {Box, Button, Flex, Spinner} from "@chakra-ui/react";
import {api} from "main/configs/axios.config";
import {NextPageWithLayout} from "main/configs/page.config";
import {ClientDTO, JobDTO} from "main/models";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {toast} from "react-toastify";
import DetailWrapper from "views/common/detail-wrapper";
import JobDetailForm from "views/jobs/detail";

export type JobDetailDTO = {
  client: ClientDTO;
  job: JobDTO;
};

const Jobs: NextPageWithLayout = () => {
  const router = useRouter();
  const [model, setModel] = useState<JobDetailDTO | null>();
  const [mode, setMode] = useState<"Add" | "Edit">();

  const fetchJobData = useCallback(async (id: string) => {
    const job: JobDTO = await api.get(`job/${id}`);
    if (job && job.client_id) {
      const client: ClientDTO = await api.get(`client/${job.client_id}`);
      const jobDTO = {
        client,
        job,
      };
      setModel(jobDTO);
      setMode("Edit");
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.isReady) {
      const id = router.query.id;
      if (id && !Array.isArray(id) && id !== "new") {
        fetchJobData(id);
      }
      if (id === "new") {
        setModel(null);
        setMode("Add");
      }
    }
  }, [router, fetchJobData]);

  const handleArchiveJob = async () => {
    if (model) {
      const response = await api.patch(`job/${model.job.id}/cancel`);
      if (response) {
        toast.success("Job Archived!");
        router.back();
      }
    }
  };

  return (
    <Box backgroundColor={"#fff"} p={{base: 0, lg: 4}} borderRadius={5}>
      {model !== undefined ? (
        <DetailWrapper
          controller='job'
          data={model}
          mode={mode}
          saveExternal={true}
          toolbarActions={
            model && model.job && !model.job.finished
              ? [
                  <Button
                    key='archive_btn'
                    variant={"ghost"}
                    colorScheme='red'
                    onClick={handleArchiveJob}
                  >
                    Archive
                  </Button>,
                ]
              : []
          }
        >
          <JobDetailForm data={model} mode={mode} />
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
Jobs.acl = {
  action: "read",
  subject: "jobs",
};
Jobs.authGuard = true;
export default Jobs;
