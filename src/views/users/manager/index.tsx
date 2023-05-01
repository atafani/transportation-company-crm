import {Table} from "main/components";

type ManagerTableProps = {
  query?: Record<string, any>;
};

const ManagerTable = (props: ManagerTableProps) => {
  const {query} = props;

  const handleRestrict = (id: number) => {
    console.log(id);
  };

  return (
    <>
      <Table
        controller={"user/manager"}
        query={query}
        actions={[
          {
            name: "Restrict",
            color: "red",
            handleClick: (id: number) => handleRestrict(id),
          },
        ]}
        showDelete={false}
        showAdd={false}
        showEdit={false}
      />
    </>
  );
};
export default ManagerTable;
