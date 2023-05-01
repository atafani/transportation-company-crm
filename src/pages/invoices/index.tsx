import {useDisclosure} from "@chakra-ui/react";
import {Table} from "main/components";
import {api} from "main/configs/axios.config";
import {NextPageWithLayout} from "main/configs/page.config";
import {useAuth} from "main/hooks";
import {InvoiceDTO, ClientDTO, JobDTO} from "main/models";
import {useState} from "react";
import Invoice from "views/invoice";

type InvoiceDoc = {
  invoice: InvoiceDTO;
  client: ClientDTO;
  job: JobDTO;
};
const Invoices: NextPageWithLayout = () => {
  const {user} = useAuth();
  const [model, setModel] = useState<InvoiceDoc | null>();
  const {isOpen, onClose, onOpen} = useDisclosure();

  const handleGetInvoice = async (id: number) => {
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
  };
  return (
    <>
      <Table
        controller={"invoice"}
        actions={[
          {
            name: "Preview",
            color: "teal",
            handleClick: (id: number) => handleGetInvoice(id),
          },
        ]}
        showDelete={false}
        showAdd={true}
        showEdit={false}
      />
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
Invoices.acl = {
  action: "read",
  subject: "invoices",
};
Invoices.authGuard = true;
export default Invoices;
