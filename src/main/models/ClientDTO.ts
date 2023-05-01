type ClientDTO = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  changed_vat_percentage: string;
  changed_vat_percentage_reason: string;
  default_collection_address: any;
  default_collection_address_name: string;
  default_collection_address_postal_code: string;
  default_delivery_address: any;
  default_delivery_address_name: string;
  default_delivery_address_postal_code: string;
  vat_percentage: string;
};

export default ClientDTO;
