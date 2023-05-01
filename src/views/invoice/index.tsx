import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  Flex,
  Stat,
  StatNumber,
  StatLabel,
  SimpleGrid,
  DrawerFooter,
  Button,
  Text,
  Box,
  Divider,
} from "@chakra-ui/react";
import {ClientDTO, InvoiceDTO, JobDTO} from "main/models";
import {useRef, useCallback} from "react";
import {useReactToPrint} from "react-to-print";
import ReactToPdf from "react-to-pdf";
import {useAuth} from "main/hooks";

type InvoiceProps = {
  invoice: InvoiceDTO;
  client: ClientDTO;
  job: JobDTO;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};
const Invoice = (props: InvoiceProps) => {
  const {customer} = useAuth();
  const {invoice, client, job, isOpen, onOpen, onClose} = props;
  const printRef = useRef(null);
  const reactToPrintContent = useCallback(() => {
    return printRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Mandati",
    removeAfterPrint: true,
  });
  const utc = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
  return (
    <Drawer onClose={onClose} isOpen={isOpen} size='xl'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Invoice</DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody justifyContent={"center"} alignItems='center'>
          <Box ref={printRef} w='700px' mx='auto'>
            <Box>
              <Flex color='#fff'>
                <Flex flex={2} bg='#CF0706' p={10} px={6} alignItems='center'>
                  <Stat textAlign='left'>
                    <StatNumber textTransform={"uppercase"}>Invoice</StatNumber>
                  </Stat>
                </Flex>
                <Flex
                  flex={1}
                  flexDir='column'
                  bg='#8D1B1D'
                  p={10}
                  alignItems='center'
                >
                  <Text>Amount Due (GBP)</Text>
                  <Text fontSize={"3xl"}>£{invoice.job_total_price}</Text>
                </Flex>
              </Flex>
            </Box>
            <Flex px={6} justifyContent={"space-between"} py={8}>
              <Box>
                <Text textTransform={"uppercase"} color='gray.400'>
                  <b> Bill To</b>
                </Text>
                <Text fontWeight={"md"}>{client.name}</Text>
                <Text fontWeight={"md"}>{client.address.split("\n")[0]}</Text>
                <Text fontWeight={"md"}>{client.address.split("\n")[1]}</Text>
              </Box>
              <Box>
                <SimpleGrid columns={2} gap={3}>
                  <Text textAlign={"right"}>
                    <b>Invoice Number:</b>
                  </Text>
                  <Text textAlign='left'>{invoice.number}</Text>
                </SimpleGrid>
                <SimpleGrid columns={2} gap={3}>
                  <Text textAlign={"right"}>
                    <b>Invoice Date:</b>
                  </Text>
                  <Text textAlign='left'> {invoice.invoice_date}</Text>
                </SimpleGrid>
                <SimpleGrid columns={2} gap={3}>
                  <Text textAlign={"right"}>
                    <b>Payment Due:</b>
                  </Text>
                  <Text textAlign='left'> {invoice.payment_date}</Text>
                </SimpleGrid>
              </Box>
            </Flex>
            <SimpleGrid columns={4} mt={5} px={6}>
              <Text textAlign='left'>
                <b>Product</b>
              </Text>
              <Text textAlign='center'>
                <b>Value</b>
              </Text>
              <Text textAlign='center'>
                <b>Weight</b>
              </Text>
              <Text textAlign='right'>
                <b>Amount</b>
              </Text>
            </SimpleGrid>
            <Divider my={3} />
            <SimpleGrid columns={4} px={6}>
              <Text textAlign='left'>{job.product}</Text>
              <Text textAlign='center'>{job.value}</Text>
              <Text textAlign='center'>{`${job.weight} kg`}</Text>
              <Text textAlign='right'>£{invoice.job_price}</Text>
            </SimpleGrid>
            <Divider my={3} />
            <SimpleGrid columns={4} mt={10} px={6}>
              <Text></Text>
              <Text></Text>
              <Text textAlign='right'>
                <b>Subtotal:</b>
              </Text>
              <Text textAlign='right'>£{invoice.job_price}</Text>
            </SimpleGrid>
            <SimpleGrid columns={4} mt={2} px={6}>
              <Text></Text>
              <Text></Text>
              <Text textAlign='right'>{`VAT ${job.vat_percentage}% (${customer.vat_no}):`}</Text>
              <Text textAlign='right'>£{invoice.job_vat_price}</Text>
            </SimpleGrid>
            <Divider my={5} w='50%' marginRight={0} marginLeft='auto' />
            <SimpleGrid columns={4} my={5} px={6}>
              <Text></Text>
              <Text></Text>
              <Text textAlign='right'>
                <b>Total:</b>
              </Text>
              <Text textAlign='right'>£{invoice.job_total_price}</Text>
            </SimpleGrid>
            <Divider my={3} w='50%' marginRight={0} marginLeft='auto' />
            <SimpleGrid columns={4} px={6}>
              <Text></Text>
              <Text></Text>
              <Text textAlign='right'>
                <b>Amount Due (GBP):</b>
              </Text>
              <Text textAlign='right'>£{invoice.job_total_price}</Text>
            </SimpleGrid>
            <Box mt={20} px={6}>
              <Text>
                <b>Notes / Terms</b>
              </Text>
              <Text>{`Payment Details: ${customer.name}, Account Number: ${customer.account_number}`}</Text>
            </Box>
            <Divider mt={20} />
            <Flex flexDir={"row"} gap={5} mt={5}>
              <Text></Text>
              <Box>
                <Text>
                  <b>{customer.name}</b>
                </Text>
                <Text fontWeight={"md"}>VAT NO: {customer.vat_no}</Text>
                <Text fontWeight={"md"}>{`OFFICE: ${customer.office}`}</Text>
                <Text
                  fontWeight={"md"}
                >{`WAREHOUSE: ${customer.warehouse}`}</Text>
                <Text>United Kingdom</Text>
              </Box>
              <Box>
                <Text textAlign='right'>
                  <b>Contact Information</b>
                </Text>
                <Text textAlign='right'>{customer.phone}</Text>
                <Text textAlign='right'>{customer.website}</Text>
              </Box>
            </Flex>
          </Box>
        </DrawerBody>
        <DrawerFooter>
          <Flex
            zIndex={9}
            justifyContent={"end"}
            alignItems='center'
            gap='5'
            backgroundColor={"white"}
          >
            <ReactToPdf
              y={20}
              x={10}
              targetRef={printRef}
              filename={`invoice_${utc}.pdf`}
            >
              {({toPdf}: {toPdf: () => void}) => {
                return (
                  <Button
                    variant='outlined'
                    colorScheme={"teal"}
                    onClick={toPdf}
                  >
                    Download
                  </Button>
                );
              }}
            </ReactToPdf>
            <Button
              onClick={() => {
                handlePrint();
              }}
              colorScheme={"teal"}
            >
              Print
            </Button>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default Invoice;
