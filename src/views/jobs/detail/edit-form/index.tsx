import {FormControl, FormLabel} from "@chakra-ui/form-control";
import {
  Box,
  Button,
  FormErrorMessage,
  Grid,
  GridItem,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  Autocomplete,
  DatePicker,
  Lookup,
  PhoneInput,
  Section,
} from "main/components";
import {api} from "main/configs/axios.config";
import {useAuth} from "main/hooks";
import {JobDTO} from "main/models";
import {JobDetailDTO} from "pages/jobs/[id]";
import {useCallback, useEffect, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {BsBoxArrowUp} from "react-icons/bs";
import JobStatus from "./jobstatus";
import {toast} from "react-toastify";

type JobEditFormProps = {
  data?: JobDetailDTO;
};

const JobEditForm = (props: JobEditFormProps) => {
  const {data} = props;
  const {control, watch, reset, formState, getValues, setValue} =
    useFormContext<JobDetailDTO>();

  const [isCancelled, setIsCancelled] = useState<boolean>(
    !!getValues("job.cancelled")
  );
  const {customer} = useAuth();

  const handleAddressChange = async (
    type: "collection" | "middle" | "delivery",
    value?: number
  ) => {
    if (value) {
      setValue(`job.${type}_address_id`, value);
      const id: number | undefined = getValues("client.id");

      if (type === "middle") {
        const address: any = await api.get(`customer-address/${value}`);
        address && setValue("job.middle_address_name", address.address);
      } else {
        if (id) {
          const address: any = await api.get(
            `client/${id}/address/${value}/get`
          );
          address &&
            setValue(`client.default_${type}_address_name`, address.address);
        }
      }
    } else {
      setValue(`job.${type}_address_id`, 0);
    }
  };
  const handlePriceChange = (price: string) => {
    const totalPrice =
      parseFloat(price) +
      (parseFloat(price) * parseFloat(getValues("client.vat_percentage"))) /
        100;
    setValue("job.total_price", `${totalPrice}`);
  };

  const handleAddJob = useCallback(
    async (data: JobDetailDTO) => {
      const {client, job} = data;
      const method: string = client.id ? "PATCH" : "POST";
      const url: string = client.id ? `client/${client.id}` : "client";
      const addedClient: any = await api({url, method, data: client});
      if (addedClient) {
        job.client_id = addedClient.id;
        if (
          job.collection_address_id === 0 &&
          client.default_collection_address_name.length > 0
        ) {
          const collectionAddress: any = await api.post(
            `client/${addedClient.id}/address/collection`,
            {
              address: client.default_collection_address_name,
              phone: client.phone,
              email: client.email,
            }
          );
          if (collectionAddress)
            job.collection_address_id = collectionAddress.id;
        }
        if (
          job.delivery_address_id === 0 &&
          client.default_delivery_address_name.length > 0
        ) {
          const deliveryAddress: any = await api.post(
            `client/${addedClient.id}/address/delivery`,
            {
              address: client.default_delivery_address_name,
              phone: client.phone,
              email: client.email,
            }
          );
          if (deliveryAddress) job.delivery_address_id = deliveryAddress.id;
        }
      }
      if (job.middle_address_id === 0 && job.middle_address_name.length > 0) {
        const middleAddress: any = await api.post(`customer-address`, {
          address: job.middle_address_name,
          phone: customer.phone,
          email: customer.email,
        });
        if (middleAddress) job.middle_address_id = middleAddress.id;
      }
      const addedJob: JobDTO | undefined = await api.patch(
        `job/${job.id}`,
        job
      );
      if (job && addedClient) {
        reset({client: addedClient, job: addedJob});
        const message = `Data Updated Succesfully.`;
        toast.success(message);
      }
    },
    [reset, customer.phone, customer.email]
  );

  useEffect(() => {
    formState.isSubmitting && handleAddJob(watch());
  }, [formState.isSubmitting, handleAddJob, watch]);

  return (
    <>
      <form onSubmit={(e: any) => e.preventDefault()}>
        <Section title={"Job Status"}>
          <JobStatus job={getValues("job")} />
        </Section>
        <Section title={"Client Details"}>
          <SimpleGrid columns={{base: 1, md: 2}} gap={5}>
            <Controller
              control={control}
              name='client.name'
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isRequired isInvalid={!!error} isReadOnly>
                    <FormLabel>Name</FormLabel>
                    <Input value={value} onChange={onChange} type='text' />
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                );
              }}
            />
            <Controller
              control={control}
              name='client.email'
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isRequired isInvalid={!!error} isReadOnly>
                    <FormLabel>E-mail</FormLabel>
                    <Input value={value} onChange={onChange} type='text' />
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                );
              }}
            />
            <Controller
              control={control}
              name='client.phone'
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isRequired isInvalid={!!error} isReadOnly>
                    <FormLabel>Phone Number</FormLabel>
                    <PhoneInput value={value} onChange={onChange} />
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                );
              }}
            />
            <Controller
              control={control}
              name='client.address'
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <FormControl isRequired isInvalid={!!error} isReadOnly>
                  <FormLabel>Address:</FormLabel>
                  <Autocomplete value={value} onChange={onChange} />
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
          </SimpleGrid>
        </Section>
        <Section title={"Job Details"}>
          <>
            <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap={5} my={3}>
              <Controller
                control={control}
                name='client.default_collection_address_name'
                rules={{
                  required: "Collection address is required",
                  minLength: {
                    value: 3,
                    message: "Address must have at least 3 characters.",
                  },
                }}
                render={({field: {onChange, value}, fieldState: {error}}) => {
                  return (
                    <FormControl
                      isRequired
                      isInvalid={!!error}
                      isReadOnly={isCancelled}
                    >
                      <FormLabel>Collection Address</FormLabel>
                      <InputGroup>
                        <Autocomplete
                          value={value}
                          onChange={(value: string) => {
                            onChange(value);
                            handleAddressChange("delivery");
                          }}
                          styles={{paddingRight: "2.5rem"}}
                        />
                        {!isCancelled && (
                          <InputRightElement>
                            <Button variant={"ghost"}>
                              <Lookup
                                value={getValues("job.collection_address_id")}
                                onChange={(value: any) =>
                                  handleAddressChange("collection", value)
                                }
                                controller={`client/${getValues(
                                  "client.id"
                                )}/address/collection`}
                                title='Choose Collection Address'
                                button={<Icon as={BsBoxArrowUp} />}
                              />
                            </Button>
                          </InputRightElement>
                        )}
                      </InputGroup>
                    </FormControl>
                  );
                }}
              />
              <Controller
                control={control}
                name='job.middle_address_name'
                render={({field: {onChange, value}, fieldState: {error}}) => {
                  return (
                    <FormControl isInvalid={!!error} isReadOnly={isCancelled}>
                      <FormLabel>Middle Address</FormLabel>
                      <InputGroup>
                        <Autocomplete
                          value={value}
                          onChange={(value: string) => {
                            onChange(value);
                            handleAddressChange("delivery");
                          }}
                          styles={{paddingRight: "2.5rem"}}
                        />
                        {!isCancelled && (
                          <InputRightElement>
                            <Button variant={"ghost"}>
                              <Lookup
                                value={getValues("job.middle_address_id")}
                                onChange={(value: any) =>
                                  handleAddressChange("middle", value)
                                }
                                controller={`customer-address`}
                                title='Choose Middle Address'
                                button={<Icon as={BsBoxArrowUp} />}
                              />
                            </Button>
                          </InputRightElement>
                        )}
                      </InputGroup>
                    </FormControl>
                  );
                }}
              />

              <Controller
                control={control}
                name='client.default_delivery_address_name'
                rules={{
                  required: "Delivery address is required",
                  minLength: {
                    value: 3,
                    message: "Address must have at least 3 characters.",
                  },
                }}
                render={({field: {onChange, value}, fieldState: {error}}) => {
                  return (
                    <FormControl
                      isRequired
                      isInvalid={!!error}
                      isReadOnly={isCancelled}
                    >
                      <FormLabel>Delivery Address</FormLabel>
                      <InputGroup>
                        <Autocomplete
                          value={value}
                          onChange={(value: string) => {
                            onChange(value);
                            handleAddressChange("delivery");
                          }}
                          styles={{paddingRight: "2.5rem"}}
                        />
                        {!isCancelled && (
                          <InputRightElement>
                            <Button variant={"ghost"}>
                              <Lookup
                                value={getValues("job.delivery_address_id")}
                                onChange={(value: any) =>
                                  handleAddressChange("delivery", value)
                                }
                                controller={`client/${getValues(
                                  "client.id"
                                )}/address/delivery`}
                                title='Choose Delivery Address'
                                button={<Icon as={BsBoxArrowUp} />}
                              />
                            </Button>
                          </InputRightElement>
                        )}
                      </InputGroup>
                    </FormControl>
                  );
                }}
              />
            </SimpleGrid>
            <SimpleGrid columns={{base: 1, md: 2}} gap={5} my={3}>
              <Controller
                control={control}
                name='job.collection_driver_id'
                rules={{
                  required: "Collection driver is required",
                  minLength: {
                    value: 6,
                    message: "Driver must have at least 6 characters.",
                  },
                }}
                render={({field: {onChange, value}, fieldState: {error}}) => {
                  return (
                    <FormControl
                      isRequired
                      isInvalid={!!error}
                      isReadOnly={isCancelled}
                    >
                      <FormLabel>
                        {watch("job.middle_address_id")
                          ? "Collection Driver"
                          : "Driver"}
                      </FormLabel>
                      <Lookup
                        value={value}
                        onChange={onChange}
                        controller={`user/driver`}
                        title='Choose Collection Driver'
                        label={getValues("job.collection_driver_name")}
                        disabled={isCancelled}
                      />
                      {error && (
                        <FormErrorMessage>{error.message}</FormErrorMessage>
                      )}
                    </FormControl>
                  );
                }}
              />

              {watch("job.middle_address_name") && (
                <Controller
                  control={control}
                  name='job.delivery_driver_id'
                  rules={{
                    minLength: {
                      value: 6,
                      message: "Driver must have at least 6 characters.",
                    },
                  }}
                  render={({field: {onChange, value}, fieldState: {error}}) => {
                    return (
                      <FormControl isInvalid={!!error} isReadOnly={isCancelled}>
                        <FormLabel>Delivery Driver</FormLabel>
                        <Lookup
                          value={value}
                          onChange={onChange}
                          controller={`user/driver`}
                          title='Choose Delivery Driver'
                          label={getValues("job.delivery_driver_name")}
                          disabled={isCancelled}
                        />
                        {error && (
                          <FormErrorMessage>{error.message}</FormErrorMessage>
                        )}
                      </FormControl>
                    );
                  }}
                />
              )}
            </SimpleGrid>
            <SimpleGrid columns={{base: 1, md: 2}} gap={5} my={3}>
              <Controller
                control={control}
                name='job.collection_time'
                rules={{
                  required: "Collection Date is required",
                }}
                render={({field: {onChange, value}, fieldState: {error}}) => {
                  return (
                    <FormControl
                      isRequired
                      isInvalid={!!error}
                      isReadOnly={isCancelled}
                    >
                      <FormLabel>Collection Date</FormLabel>
                      <DatePicker value={value} onChange={onChange} />
                      {error && (
                        <FormErrorMessage>{error.message}</FormErrorMessage>
                      )}
                    </FormControl>
                  );
                }}
              />

              <Controller
                control={control}
                name='job.delivery_time'
                rules={{
                  required: "Delivery Date is required",
                }}
                render={({field: {onChange, value}, fieldState: {error}}) => {
                  return (
                    <FormControl
                      isRequired
                      isInvalid={!!error}
                      isReadOnly={isCancelled}
                    >
                      <FormLabel>Delivery Date</FormLabel>
                      <DatePicker value={value} onChange={onChange} />
                      {error && (
                        <FormErrorMessage>{error.message}</FormErrorMessage>
                      )}
                    </FormControl>
                  );
                }}
              />
            </SimpleGrid>
            <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap={5} my={3}>
              <Controller
                control={control}
                name='job.price'
                rules={{
                  required: "Price is required",
                }}
                render={({field: {onChange, value}, fieldState: {error}}) => {
                  return (
                    <FormControl
                      isRequired
                      isInvalid={!!error}
                      isReadOnly={isCancelled}
                    >
                      <FormLabel>Price</FormLabel>
                      <InputGroup>
                        <Input
                          value={value}
                          onChange={(e: any) => {
                            onChange(e.target.value);
                            handlePriceChange(e.target.value);
                          }}
                          type='number'
                        />
                      </InputGroup>
                    </FormControl>
                  );
                }}
              />

              <Controller
                control={control}
                name='client.vat_percentage'
                rules={{
                  required: "VAT is required",
                }}
                render={({field: {onChange, value}, fieldState: {error}}) => {
                  return (
                    <FormControl
                      isRequired
                      isInvalid={!!error}
                      isReadOnly={isCancelled}
                    >
                      <FormLabel>VAT</FormLabel>
                      <InputGroup>
                        <Input
                          value={value}
                          onChange={(e: any) => {
                            onChange(e.target.value);
                          }}
                          type='number'
                        />
                      </InputGroup>
                    </FormControl>
                  );
                }}
              />

              <Controller
                control={control}
                name='job.total_price'
                render={({field: {onChange, value}, fieldState: {error}}) => {
                  return (
                    <FormControl isInvalid={!!error} isReadOnly>
                      <FormLabel>Total Price</FormLabel>
                      <InputGroup>
                        <Input
                          value={value}
                          onChange={(e: any) => {
                            onChange(e.target.value);
                          }}
                          type='number'
                        />
                      </InputGroup>
                    </FormControl>
                  );
                }}
              />
            </SimpleGrid>
          </>
        </Section>
      </form>
      <Link href={`/jobs/${getValues("job.id")}/logs`}>
        <Button mt={10} colorScheme={"teal"}>
          View Job History
        </Button>
      </Link>
    </>
  );
};

export default JobEditForm;
