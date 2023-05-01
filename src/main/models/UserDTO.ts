type UserDTO = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  active?: boolean;
};

export default UserDTO;
