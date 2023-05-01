import {Table} from "main/components";

const DriverTable = () => {
  const handleRestrict = (id: number) => {
    console.log(id);
  };
  return (
    <>
      <Table
        controller={"user/driver"}
        showDelete={false}
        showAdd={true}
        showEdit={false}
        actions={[
          {
            name: "Restrict",
            color: "red",
            handleClick: (id: number) => handleRestrict(id),
          },
        ]}
      />
    </>
  );
};

export default DriverTable;
