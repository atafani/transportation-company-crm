import {CustomerDTO} from "main/models";
import {useEffect} from "react";
import {useFormContext} from "react-hook-form";
import CustomerEditForm from "./edit-form";
import CustomerInsertForm from "./insert-form";

type CustomerDetailFormProps = {
  data?: CustomerDTO;
  mode?: "Add" | "Edit" | "View";
};
const CustomerDetailForm = (props: CustomerDetailFormProps) => {
  const {data, mode = "Add"} = props;
  const {reset, formState} = useFormContext<any>();

  useEffect(() => {
    reset();
  }, [formState.isSubmitSuccessful, reset]);

  return (
    <>
      {mode === "Add" && <CustomerInsertForm />}
      {mode === "Edit" && data && <CustomerEditForm data={data} />}
    </>
  );
};

export default CustomerDetailForm;
