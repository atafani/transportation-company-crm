import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import {Autocomplete} from "main/components";
import {useEffect} from "react";
import {Controller, useFormContext} from "react-hook-form";
type CollectFormProps = {
  jobId: number;
  jobType: "both" | "collection" | "delivery";
};

const CollectForm = (props: CollectFormProps) => {
  const {jobId, jobType} = props;
  const {control, handleSubmit, setValue} = useFormContext();

  useEffect(() => {
    setValue("id", jobId);
    setValue("type", jobType);
  }, [setValue, jobId, jobType]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Controller
        control={control}
        name={"id"}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <FormControl hidden>
            <Input value={value} type='number' />
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name={"type"}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <FormControl hidden>
            <Input value={value} type='text' />
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name={"address"}
        rules={{
          required: "Address is required.",
          minLength: {
            value: 10,
            message: "Address must be at least 10 characters.",
          },
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <FormControl isInvalid={!!error} isRequired>
            <FormLabel>Address</FormLabel>
            <Autocomplete value={value} onChange={onChange} />
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name={"note"}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <FormControl isInvalid={!!error} mt={5}>
            <FormLabel>Note</FormLabel>
            <Textarea value={value} onChange={onChange}></Textarea>
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        )}
      />
    </form>
  );
};
export default CollectForm;
