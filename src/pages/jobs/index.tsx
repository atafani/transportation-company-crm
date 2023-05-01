import {NextPageWithLayout} from "main/configs/page.config";
import {useAuth} from "main/hooks";
import DriverJobs from "views/jobs/drivers";
import ManagerJobs from "views/jobs/manager";

const Jobs: NextPageWithLayout = () => {
  const {user} = useAuth();
  return (
    <>{user && user.role === "driver" ? <DriverJobs /> : <ManagerJobs />}</>
  );
};
Jobs.acl = {
  action: "read",
  subject: "jobs",
};
Jobs.authGuard = true;
export default Jobs;
