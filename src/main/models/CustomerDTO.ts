type CustomerDTO = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  default_address: string;
  role: string;
  active: boolean;
  account_number: string;
  office: string;
  office_postal_code: string;
  vat_no: string;
  vat_percentage: string;
  warehouse: string;
  warehouse_postal_code: string;
  website: string;
};

export default CustomerDTO;
