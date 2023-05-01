import {IconType} from "react-icons";
import {ReactNode} from "react";

type TableAction = {
  name: string;
  handleClick?: (id: number) => void;
  icon?: IconType;
  color?: string;
};

type TableProps = {
  controller: string;
  actions?: TableAction[];
  footerActions?: any[];
  filterable?: boolean;
  showAdd?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  detailForm?: ReactNode;
  query?: Record<string, any>;
  handleAdd?: () => void;
  handleEdit?: (id: number) => void;
};

type TableResponse = {
  content: any[];
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

type TableColumn = {
  search: boolean;
  order: boolean;
  data_type: string;
  title: string;
};
type Sort = {
  sortBy: string;
  sortDir: "asc" | "desc";
};
export type {TableAction, TableProps, TableResponse, TableColumn, Sort};
