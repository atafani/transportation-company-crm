import {NextPageWithLayout} from "main/configs/page.config";
import {useAuth} from "main/hooks";
import DriverDashboard from "views/dashboard/driver";

const Dashboard: NextPageWithLayout = () => {
  const {user} = useAuth();
  return <>{user.role === "driver" && <DriverDashboard />}</>;
};
Dashboard.acl = {
  action: "read",
  subject: "dashboard",
};
Dashboard.authGuard = true;
export default Dashboard;
