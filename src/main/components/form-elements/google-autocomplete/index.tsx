import {
  InputGroup,
  Input,
  Collapse,
  useDisclosure,
  Text,
  Box,
  useOutsideClick,
} from "@chakra-ui/react";
import {useState, useRef} from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

type AutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  setPostalCode?: (value: string) => void;
  styles?: Record<string, string>;
};
const Autocomplete = (props: AutocompleteProps) => {
  const {value, onChange, setPostalCode, styles} = props;
  const {isOpen, onClose, onOpen} = useDisclosure();

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_SECRET!,
  });

  const handleGetAddress = (value: string) => {
    getPlacePredictions({
      input: value,
      componentRestrictions: {
        country: "uk",
      },
    });
    onOpen();
  };

  const handleAddressSelect = (item: any) => {
    if (placesService) {
      placesService.getDetails(
        {
          placeId: item.place_id,
        },
        (placeDetails: any) => {
          if (placeDetails && placeDetails.address_components) {
            const postalCode = placeDetails.address_components.find(
              (cmp: any) => cmp.types.includes("postal_code")
            );
            if (postalCode)
              setPostalCode && setPostalCode(postalCode.long_name);
          }
        }
      );
    }
    onChange(item.description);
    onClose();
  };

  const ref = useRef<any>(null);

  useOutsideClick({
    ref: ref,
    handler: () => onClose(),
  });

  return (
    <>
      <InputGroup position={"relative"}>
        <Input
          textOverflow={"clip"}
          value={value}
          onChange={(evt: any) => {
            evt.target.value.length === 0 && onClose();
            onChange(evt.target.value);
            handleGetAddress(evt.target.value);
          }}
          type='text'
          sx={{
            padding: "0.4375rem 1rem",
            ...styles,
          }}
        />
        <Collapse ref={ref} in={isOpen}>
          <Box
            position='absolute'
            left={0}
            right={0}
            top={"100%"}
            bg={"white"}
            sx={{
              height: "120px",
              overflowY: "scroll",
              zIndex: 99,
              backgroundColor: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 5,
            }}
          >
            {placePredictions.map((item: any) => {
              return (
                <Text
                  key={item.place_id}
                  borderBottom={"1px solid #E2E8F0"}
                  onClick={() => {
                    handleAddressSelect(item);
                  }}
                  p={2}
                  sx={{
                    "&:hover": {
                      backgroundColor: "teal",
                      color: "#fff",
                      // transition: "background 0.2s ease",
                      cursor: "pointer",
                    },
                  }}
                >
                  {item.description}
                </Text>
              );
            })}
          </Box>
        </Collapse>
      </InputGroup>
    </>
  );
};

export default Autocomplete;
