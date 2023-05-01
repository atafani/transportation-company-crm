import {
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerContent,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  DrawerFooter,
  Button,
  Box,
  Flex,
  Text,
  Stat,
  StatNumber,
  StatLabel,
  SimpleGrid,
} from "@chakra-ui/react";
import {TableAction} from "main/components/table/utils/types";
import {api} from "main/configs/axios.config";
import {toast} from "react-toastify";
import EventManager from "main/utils/event-manager";
import {useRouter} from "next/router";
import {Table} from "main/components";
import {useCallback, useEffect, useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import ReactToPdf from "react-to-pdf";
import {ClientDTO, InvoiceDTO, JobDTO} from "main/models";
import {useAuth} from "main/hooks";
import Invoice from "views/invoice";

type ManagerJobsProps = {
  query?: Record<string, any>;
};

type TabType = {
  key: string;
  value: string;
  query: Record<string, any>;
};

type InvoiceDoc = {
  invoice: InvoiceDTO;
  client: ClientDTO;
  job: JobDTO;
};
const ManagerJobs = (props: ManagerJobsProps) => {
  const router = useRouter();
  const {customer} = useAuth();
  const {isOpen, onClose, onOpen} = useDisclosure();
  const [tabIndex, setTabIndex] = useState<string>("active");
  const [tableActions, setTableActions] = useState<TableAction[]>([]);
  const [model, setModel] = useState<InvoiceDoc | null>();
  const tabs: TabType[] = [
    {
      key: "active",
      value: "Active",
      query: {
        finished: 0,
        cancelled: 0,
      },
    },
    {
      key: "finished",
      value: "Completed",
      query: {
        finished: 1,
      },
    },
    {
      key: "archived",
      value: "Archived",
      query: {
        cancelled: 1,
      },
    },
  ];
  const handleActivateJob = useCallback(async (id: number) => {
    if (id) {
      const response = await api.patch(`job/${id}/restore`);
      if (response) {
        EventManager.raiseRefreshTable("job");
        toast.success("Job is active again!");
      }
    }
  }, []);

  const fetchInvoice = useCallback(
    async (id: number) => {
      const invoice: any = await api.get(`invoice/${id}`);
      if (invoice) {
        const client: ClientDTO = await api.get(`client/${invoice.client_id}`);
        const job: JobDTO = await api.get(`job/${invoice.job_id}`);
        const invoiceDoc = {
          invoice,
          client,
          job,
        };
        setModel(invoiceDoc);
        onOpen();
      }
    },
    [onOpen]
  );

  const handelSendInvoice = useCallback(
    async (id: number) => {
      fetchInvoice(id);
    },
    [fetchInvoice]
  );

  useEffect(() => {
    const actions: TableAction[] = [];
    if (tabIndex === "archived") {
      actions.push({
        name: "Unarchive",
        handleClick: handleActivateJob,
        color: "green",
      });
    }
    if (tabIndex === "finished") {
      actions.push({
        name: "Get Invoice",
        handleClick: handelSendInvoice,
        color: "teal",
      });
    }
    setTableActions(actions);
  }, [tabIndex, handelSendInvoice, handleActivateJob]);

  const handleAdd = () => {
    router.push("jobs/new");
  };

  const handleEditView = async (id: number) => {
    router.push(`jobs/${id}`);
  };

  return (
    <>
      <Tabs bg='white' borderRadius={"lg"} isFitted py={{base: 10, md: 5}}>
        <TabList>
          {tabs.map((tab: TabType) => (
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
          {tabs.map((tab: TabType) => (
            <TabPanel key={tab.key} px={{base: 5, md: 8}}>
              {tabIndex === tab.key && (
                <Table
                  controller={"job"}
                  query={tab.query}
                  showDelete={false}
                  showAdd={tab.key === "active"}
                  handleAdd={handleAdd}
                  showEdit={tab.key === "active"}
                  handleEdit={handleEditView}
                  actions={tableActions}
                />
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      {model && (
        <Invoice
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          invoice={model.invoice}
          client={model.client}
          job={model.job}
        />
      )}
    </>
  );
};

export default ManagerJobs;
