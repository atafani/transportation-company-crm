import {ClientDTO, JobDTO} from "main/models";
import {JobDetailDTO} from "pages/jobs/[id]";
import {useEffect} from "react";
import {useFormContext} from "react-hook-form";
import JobEditForm from "./edit-form";
import JobInsertForm from "./insert-form";

type JobDetailFormProps = {
  data: JobDetailDTO | null;
  mode?: "Add" | "Edit";
};

const JobDetailForm = (props: JobDetailFormProps) => {
  const {data, mode = "Add"} = props;
  const {reset, formState} = useFormContext<any>();

  useEffect(() => {
    reset(data);
  }, [formState.isSubmitSuccessful, reset, data]);

  return <>{data === null ? <JobInsertForm /> : <JobEditForm data={data} />}</>;
};

export default JobDetailForm;
