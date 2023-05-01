type JobDTO = {
  id?: number;
  client_id: number;
  price: number;
  vat_price: string;
  vat_percentage: string;
  total_price: string;
  collection_status:
    | "pending"
    | "accepted"
    | "collected"
    | "delivered"
    | "returned";
  collection_address_id: number;
  collection_driver_id: number;
  collection_driver_name: string;
  collection_address_name: string;
  collection_address_email: string;
  collection_address_phone: string;
  collection_time: string;
  collected_time: string;
  collected_address: string;
  middle_address_id: number;
  middle_address_name: string;
  middle_address_email: string;
  middle_address_phone: string;
  middle_address_postal_code: string;
  middle_time: string;
  delivery_status:
    | "pending"
    | "accepted"
    | "collected"
    | "delivered"
    | "returned";
  delivery_address_id: number;
  delivery_address_name: string;
  delivery_address_email: string;
  delivery_address_phone: string;
  delivery_driver_id: number;
  delivery_driver_name: string;
  delivery_time: string;
  delivered_time: string;
  delivered_address: string;
  delivered_note: string;
  finished: 0 | 1;
  cancelled: 0 | 1;
  single_way_job: 0 | 1;
  product: string;
  value: number;
  weight: string;
};
export default JobDTO;
