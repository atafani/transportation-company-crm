import {FormControl, FormLabel} from "@chakra-ui/form-control";
import {
  Button,
  FormErrorMessage,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import {
  Autocomplete,
  DatePicker,
  Lookup,
  PhoneInput,
  Section,
} from "main/components";
import {api} from "main/configs/axios.config";
import {useAuth} from "main/hooks";
import {ClientDTO, JobDTO} from "main/models";
import {useRouter} from "next/router";
import {JobDetailDTO} from "pages/jobs/[id]";
import {useCallback, useEffect, useState} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {BsBoxArrowUp} from "react-icons/bs";
import {toast} from "react-toastify";

const JobInsertForm = () => {
  const {control, watch, reset, formState, getValues, setValue} =
    useFormContext<JobDetailDTO>();
  const {customer} = useAuth();
  const router = useRouter();
  const [isExistingClient, setIsExistingClient] = useState<boolean>(false);

  useEffect(() => {
    if (customer) {
      if (customer.vat_percentage)
        setValue("client.vat_percentage", customer.vat_percentage);
    }
  }, [customer, setValue]);

  const handleGetExistingClient = async () => {
    setIsExistingClient(true);
    const id: number | undefined = getValues("client.id");
    if (id) {
      const client: ClientDTO | undefined = await api.get(`client/${id}`);
      if (client) {
        Object.keys(client).forEach((key: string) => {
          const clientKey = key as keyof typeof client;
          setValue(
            `client.${clientKey}`,
            client[clientKey] ? client[clientKey] : ""
          );
        });
        if (client.default_collection_address)
          setValue(
            "job.collection_address_id",
            client.default_collection_address.id
          );
        if (client.default_delivery_address)
          setValue(
            "job.delivery_address_id",
            client.default_delivery_address.id
          );
      }
    } else {
      setValue("job.collection_address_id", 0);
      setValue("job.delivery_address_id", 0);
    }
  };

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
          if (address) {
            setValue(`client.default_${type}_address_name`, address.address);
            setValue(`job.${type}_address_id`, address.id);
          }
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
              postal_code: client.default_collection_address_postal_code,
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
              postal_code: client.default_delivery_address_postal_code,
            }
          );
          if (deliveryAddress) job.delivery_address_id = deliveryAddress.id;
        }
      }
      const addedJob: JobDTO = await api.post("job", job);

      if (addedJob && addedJob.id) {
        reset({client: addedClient, job: addedJob});
        const url = router.asPath.replace("new", `${addedJob.id}`);
        router.replace(url);
        const message = `Data Added Succesfully.`;
        toast.success(message);
      }
    },
    [reset, router]
  );

  useEffect(() => {
    formState.isSubmitting && handleAddJob(watch());
  }, [formState.isSubmitting, handleAddJob, watch]);

  return (
    <form onSubmit={(e: any) => e.preventDefault()}>
      <Section title={"Client Details"}>
        <>
          <Controller
            control={control}
            name='client.id'
            render={({field: {onChange, value}, fieldState: {error}}) => {
              return (
                <FormControl isRequired isInvalid={!!error} my={5}>
                  <Lookup
                    value={value}
                    onChange={(value: any) => {
                      onChange(value);
                      handleGetExistingClient();
                    }}
                    controller='client'
                    query={customer ? {customer_id: customer.id} : {}}
                    button={
                      <Button colorScheme={"teal"}>
                        Choose Existing Client
                      </Button>
                    }
                    title='Choose a client'
                  />
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              );
            }}
          />
          <SimpleGrid columns={{base: 1, md: 2}} gap={{base: 10, md: 5}}>
            <Controller
              control={control}
              name='client.name'
              rules={{
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must have at least 3 characters.",
                },
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isRequired isInvalid={!!error}>
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
              name='client.phone'
              rules={{
                required: "Phone is required",
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isRequired isInvalid={!!error}>
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
              name='client.email'
              rules={{
                required: "E-mail is required",
                minLength: {
                  value: 6,
                  message: "E-mail must have at least 6 characters.",
                },
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isRequired isInvalid={!!error}>
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
              name='client.address'
              rules={{
                required: "Field is required.",
                minLength: {
                  value: 6,
                  message: "Address must be at least 6 characters.",
                },
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <FormControl isRequired isInvalid={!!error}>
                  <FormLabel>Address:</FormLabel>
                  <Autocomplete
                    setPostalCode={(value: string) =>
                      setValue("client.postal_code", value)
                    }
                    value={value}
                    onChange={onChange}
                  />
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name='client.changed_vat_percentage'
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <FormControl isInvalid={!!error}>
                  <FormLabel>Changed VAT (%):</FormLabel>
                  <Input value={value} onChange={onChange} type='percentage' />
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name='client.changed_vat_percentage_reason'
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <FormControl
                  isInvalid={!!error}
                  isDisabled={!getValues("client.changed_vat_percentage")}
                >
                  <FormLabel>VAT changed reason:</FormLabel>
                  <Textarea
                    value={value}
                    onChange={onChange}
                    rows={1}
                    disabled={!getValues("client.changed_vat_percentage")}
                  />
                  {error && (
                    <FormErrorMessage>{error.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
          </SimpleGrid>
        </>
      </Section>
      <Section title={"Job Details"}>
        <>
          <SimpleGrid
            columns={{base: 1, md: 2, lg: 3}}
            gap={{base: 10, md: 5}}
            my={10}
          >
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
                  <FormControl isRequired isInvalid={!!error}>
                    <FormLabel>Collection Address</FormLabel>
                    <InputGroup>
                      <Autocomplete
                        value={value}
                        setPostalCode={(value: string) =>
                          setValue(
                            "client.default_collection_address_postal_code",
                            value
                          )
                        }
                        onChange={(value: any) => {
                          onChange(value);
                          handleAddressChange("collection");
                        }}
                        styles={{paddingRight: "2.5rem"}}
                      />
                      {isExistingClient && (
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
                  <FormControl isInvalid={!!error}>
                    <FormLabel>Middle Address</FormLabel>
                    <InputGroup>
                      <Autocomplete
                        value={value}
                        onChange={(value: any) => {
                          onChange(value);
                          handleAddressChange("middle");
                        }}
                        setPostalCode={(value: string) =>
                          setValue("job.middle_address_postal_code", value)
                        }
                        styles={{paddingRight: "2.5rem"}}
                      />
                      {isExistingClient && (
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
                  <FormControl isRequired isInvalid={!!error}>
                    <FormLabel>Delivery Address</FormLabel>
                    <InputGroup>
                      <Autocomplete
                        setPostalCode={(value: string) =>
                          setValue(
                            "client.default_delivery_address_postal_code",
                            value
                          )
                        }
                        value={value}
                        onChange={(value: any) => {
                          onChange(value);
                          handleAddressChange("delivery");
                        }}
                        styles={{paddingRight: "2.5rem"}}
                      />
                      {isExistingClient && (
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
          <SimpleGrid
            columns={{base: 1, md: 2}}
            gap={{base: 10, md: 5}}
            my={10}
          >
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
                  <FormControl isRequired isInvalid={!!error}>
                    <FormLabel>
                      {watch("job.middle_address_name")
                        ? "Collection Driver"
                        : "Driver"}
                    </FormLabel>
                    <Lookup
                      value={value}
                      onChange={onChange}
                      controller={`user/driver`}
                      title='Choose Collection Driver'
                      label={getValues("job.collection_driver_name")}
                      filters={[getValues("job.delivery_driver_id")]}
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
                    <FormControl isInvalid={!!error}>
                      <FormLabel>Delivery Driver</FormLabel>
                      <Lookup
                        value={value}
                        onChange={onChange}
                        controller={`user/driver`}
                        title='Choose Delivery Driver'
                        label={getValues("job.delivery_driver_name")}
                        filters={[getValues("job.collection_driver_id")]}
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
          <SimpleGrid
            columns={{base: 1, md: 2}}
            gap={{base: 10, md: 5}}
            my={10}
          >
            <Controller
              control={control}
              name='job.collection_time'
              rules={{
                required: "Collection Date is required",
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isRequired isInvalid={!!error}>
                    <FormLabel>Collection Date</FormLabel>
                    <DatePicker
                      value={value}
                      onChange={(value: any) => {
                        onChange(value);
                        !getValues("job.delivery_time") &&
                          setValue("job.delivery_time", value);
                      }}
                    />
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
                    isDisabled={!getValues("job.collection_time")}
                  >
                    <FormLabel>Delivery Date</FormLabel>
                    <DatePicker
                      disabled={!getValues("job.collection_time")}
                      value={value}
                      onChange={onChange}
                      minValue={new Date(getValues("job.collection_time"))}
                    />
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                );
              }}
            />
          </SimpleGrid>
          <SimpleGrid
            columns={{base: 1, md: 2, lg: 3}}
            gap={{base: 10, md: 5}}
            my={10}
          >
            <Controller
              control={control}
              name='job.product'
              rules={{
                required: "Product is required",
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isRequired isInvalid={!!error}>
                    <FormLabel>Product</FormLabel>
                    <InputGroup>
                      <Input value={value} onChange={onChange} type='text' />
                    </InputGroup>
                  </FormControl>
                );
              }}
            />

            <Controller
              control={control}
              name='job.value'
              rules={{
                required: "Value is required",
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel>Value</FormLabel>
                    <InputGroup>
                      <Input value={value} onChange={onChange} type='number' />
                    </InputGroup>
                  </FormControl>
                );
              }}
            />

            <Controller
              control={control}
              name='job.weight'
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel>Weight</FormLabel>
                    <InputGroup>
                      <Input value={value} onChange={onChange} type='number' />
                    </InputGroup>
                  </FormControl>
                );
              }}
            />
          </SimpleGrid>
          <SimpleGrid
            columns={{base: 1, md: 2, lg: 3}}
            gap={{base: 10, md: 5}}
            my={10}
          >
            <Controller
              control={control}
              name='job.price'
              rules={{
                required: "Price is required",
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => {
                return (
                  <FormControl isRequired isInvalid={!!error}>
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
                  <FormControl isInvalid={!!error} isReadOnly>
                    <FormLabel>VAT (%)</FormLabel>
                    <InputGroup>
                      <Input
                        value={value}
                        onChange={(e: any) => {
                          onChange(e.target.value);
                        }}
                        type='percentage'
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
  );
};

export default JobInsertForm;
