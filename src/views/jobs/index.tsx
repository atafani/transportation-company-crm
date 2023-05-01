import {Table} from "main/components";

type JobTableProps = {
  query?: Record<string, any>;
};

const JobTable = (props: JobTableProps) => {
  const {query} = props;

  return (
    <>
      <Table
        controller={"job"}
        showDelete={false}
        query={query}
        showAdd={false}
        showEdit={false}
      />
    </>
  );
};
export default JobTable;
