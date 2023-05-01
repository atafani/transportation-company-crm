import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Center,
  Container,
  Flex,
  Box,
  InputRightElement,
  InputGroup,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  Heading,
  IconButton,
  Stack,
  SimpleGrid,
  VStack,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Icon,
} from "@chakra-ui/react";
import {useForm, Controller} from "react-hook-form";
import {SmallCloseIcon, ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import {ReactElement, useState} from "react";
import {useAuth} from "main/hooks";
import {NextPageWithLayout} from "main/configs/page.config";
import {Layout} from "main/components";
import CompanyAdminProfileForm from "views/profile/settings";
import UserProfileForm from "views/profile/user";
import SecurityForm from "views/profile/security";
import {FaUserAlt} from "react-icons/fa";
import {MdOutlineSecurity} from "react-icons/md";
import {IoMdSettings} from "react-icons/io";
import {IconType} from "react-icons";
import CompanySettingsForm from "views/profile/settings";

type TabType = {
  key: string;
  value: string;
  icon: IconType;
  renderContent: () => ReactElement;
};

const Profile: NextPageWithLayout = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {user} = useAuth();
  const tabs: TabType[] = [
    {
      key: "profile",
      value: "Profile",
      icon: FaUserAlt,
      renderContent: () => <UserProfileForm />,
    },
    {
      key: "security",
      value: "Security",
      icon: MdOutlineSecurity,
      renderContent: () => <SecurityForm />,
    },
    {
      key: "settings",
      value: "Company Settings",
      icon: IoMdSettings,
      renderContent: () => <CompanySettingsForm />,
    },
  ];

  const [tabIndex, setTabIndex] = useState<string>("profile");
  return (
    <Tabs bg='white' borderRadius='lg' py={{base: 10, md: 5}}>
      <TabList>
        {tabs
          .filter((tab: TabType) =>
            user.role !== "supermanager" ? tab.key !== "settings" : true
          )
          .map((tab: TabType) => (
            <Tab
              px={{base: 3, md: 20}}
              onClick={() => setTabIndex(tab.key)}
              key={tab.key}
              display='flex'
              flexDir='row'
              alignItems='center'
              justifyContent={"center"}
              gap={3}
            >
              <Icon as={tab.icon} /> {tab.value}
            </Tab>
          ))}
      </TabList>
      <TabPanels>
        {tabs.map((tab: TabType) => (
          <TabPanel key={tab.key} p={10}>
            {tabIndex === tab.key && tab.renderContent()}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

Profile.authGuard = false;
Profile.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
export default Profile;
