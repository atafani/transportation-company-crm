import {Box, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {NextPageWithLayout} from "main/configs/page.config";
import {ReactElement, useState} from "react";
import {AdminTable, CustomerAdminTable, ManagerTable} from "views/users";
import DriverTable from "views/users/driver";

type Tab = {
  key: string;
  value: string;
  renderContent: () => ReactElement;
};

const Users: NextPageWithLayout = () => {
  const tabs: Tab[] = [
    {
      key: "admin",
      value: "Admin",
      renderContent: () => <AdminTable />,
    },
    {
      key: "supermanager",
      value: "Company Admin",
      renderContent: () => <CustomerAdminTable />,
    },
    {
      key: "manager",
      value: "Managers",
      renderContent: () => <ManagerTable />,
    },
    {
      key: "driver",
      value: "Drivers",
      renderContent: () => <DriverTable />,
    },
  ];
  const [tabIndex, setTabIndex] = useState<string>("admin");

  return (
    <Tabs bg='white' borderRadius={"lg"} isFitted py={{base: 10, md: 5}}>
      <TabList>
        {tabs.map((tab: Tab) => (
          <Tab
            onClick={() => setTabIndex(tab.key)}
            key={tab.key}
            px={{base: 2, md: 20}}
          >
            {tab.value}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map((tab: Tab) => (
          <TabPanel key={tab.key} sx={{}}>
            {tabIndex === tab.key && tab.renderContent()}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
Users.acl = {
  action: "read",
  subject: "users",
};
Users.authGuard = true;
export default Users;
