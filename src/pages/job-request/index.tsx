import {NextPageWithLayout} from "main/configs/page.config";
import JobRequestsList from "views/job-request";

const JobRequest: NextPageWithLayout = () => {
  return (
    <>
      <JobRequestsList />
    </>
  );
};
JobRequest.acl = {
  action: "read",
  subject: "job-request",
};
JobRequest.authGuard = true;
export default JobRequest;
