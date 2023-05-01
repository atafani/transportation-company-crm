type PermissionDTO = {
  actions: "Read" | "Create" | "Delete";
  subject: string;
};

export default PermissionDTO;
