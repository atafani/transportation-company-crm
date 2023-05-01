import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import {ImageInput} from "main/components";
import {Controller, useFormContext} from "react-hook-form";

const DeliverForm = () => {
  const {control, handleSubmit, getValues} = useFormContext();
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Controller
        control={control}
        name={"latitude"}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <FormControl hidden>
            <Input value={value} type='number' />
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name={"longitude"}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <FormControl hidden>
            <Input value={value} type='number' />
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name={"image"}
        rules={{
          required: "Proof of delivery is required.",
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <FormControl isInvalid={!!error} isRequired>
            <FormLabel>Proof of delivery</FormLabel>
            <ImageInput
              value={value}
              onChange={(value: any) => {
                onChange(value);
              }}
            />
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        )}
      />
    </form>
  );
};
export default DeliverForm;
