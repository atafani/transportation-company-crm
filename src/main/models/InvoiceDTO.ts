type InvoiceDTO = {
  id: number;
  client_id: number;
  job_id: number;
  client_name: string;
  client_address: string;
  job_price: string;
  job_vat_price: string;
  job_total_price: string;
  vat_percentage: string;
  invoice_date: string;
  payment_date: string;
  number: number;
  to_send: boolean;
  sent: boolean;
};
export default InvoiceDTO;
