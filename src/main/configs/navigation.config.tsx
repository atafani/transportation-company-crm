import {FlexProps} from "@chakra-ui/react";
import {ReactText} from "react";
import {IconType} from "react-icons";
import {FiHome, FiTruck, FiUsers} from "react-icons/fi";
import {
  RiAdminLine,
  RiUserSettingsLine,
  RiMapPinUserLine,
} from "react-icons/ri";
import {BiCar} from "react-icons/bi";
import {BsHandbag} from "react-icons/bs";

interface NavItemType extends FlexProps {
  icon: IconType;
  name: ReactText;
  path: string;
}

const getNavigationContent = (role: string) => {
  let navItems: NavItemType[] = [];
  switch (role.toLowerCase()) {
    case "admin":
      navItems = [
        {name: "Users", icon: FiUsers, path: "/users"},
        {name: "Companies", icon: FiTruck, path: "/customers"},
      ];
      break;
    case "supermanager":
      navItems = [
        {name: "Home", icon: FiHome, path: "/dashboard"},
        {name: "Administrators", icon: RiAdminLine, path: "/administrators"},
        {name: "Managers", icon: RiUserSettingsLine, path: "/managers"},
        {name: "Clients", icon: RiMapPinUserLine, path: "/clients"},
        {name: "Drivers", icon: BiCar, path: "/drivers"},
        {name: "Jobs", icon: BsHandbag, path: "/jobs"},
        {name: "Invoices", icon: BsHandbag, path: "/invoices"},
      ];
      break;
    case "manager":
      navItems = [
        {name: "Home", icon: FiHome, path: "/dashboard"},
        {name: "Managers", icon: RiUserSettingsLine, path: "/managers"},
        {name: "Clients", icon: RiMapPinUserLine, path: "/clients"},
        {name: "Drivers", icon: BiCar, path: "/drivers"},
        {name: "Jobs", icon: BsHandbag, path: "/jobs"},
        {name: "Invoices", icon: BsHandbag, path: "/invoices"},
      ];
      break;
    case "driver":
      navItems = [
        {name: "Home", icon: FiHome, path: "/dashboard"},
        {name: "Job Requests", icon: FiHome, path: "/job-request"},
        {name: "Jobs", icon: BsHandbag, path: "/jobs"},
      ];
      break;
  }

  return navItems;
};

export type {NavItemType};
export {getNavigationContent};
