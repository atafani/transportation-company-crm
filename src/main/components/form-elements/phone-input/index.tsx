import ReactPhoneInput from "react-phone-number-input/input";
import {useRef, useState} from "react";
import React from "react";
import PropTypes from "prop-types";
import {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import {CountryCode, E164Number} from "libphonenumber-js/types";
import styled from "@emotion/styled";
import {
  Box,
  Icon,
  IconButton,
  Image,
  ImageProps,
  Input,
  InputGroup,
  InputLeftAddon,
  Collapse,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import {FiSearch} from "react-icons/fi";
import {GrFormClose} from "react-icons/gr";

type PhoneInputProps = {
  value?: string | null;
  onChange?: (value: any) => void;
  error?: any;
  disabled?: boolean;
  id?: string;
};
type CountrySelectProps = {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  onChange: (value: CountryCode) => void;
  labels?: any;
  sx?: any;
};
const ImgStyled = styled(Image)<ImageProps>(({theme}) => ({
  width: 30,
  height: 30,
  objectFit: "contain",
  borderRadius: 10,
}));

const CountrySelect = ({
  isOpen,
  onClose,
  onChange,
  labels,
  sx,
}: CountrySelectProps) => {
  const [searchValue, setSearchValue] = useState("");
  const ref = useRef<any>(null);

  useOutsideClick({
    ref: ref,
    handler: () => onClose(),
  });

  return (
    <Collapse
      ref={ref}
      in={isOpen}
      animateOpacity
      style={{
        position: "absolute",
        top: "100%",
        right: 0,
        left: 0,
        zIndex: 20,
        backgroundColor: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 3,
        padding: "0.5em 0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "30vh",
          overflowY: "scroll",
          zIndex: 22,
          ...sx,
        }}
      >
        <InputGroup
          size='sm'
          px={4}
          my={2}
          sx={{
            position: "sticky",
            top: 0,
            bg: "#fff",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <InputLeftAddon border='none' bg='none'>
            <Icon as={FiSearch} />
          </InputLeftAddon>
          <Input
            variant='standard'
            size='small'
            placeholder='Search'
            onChange={(e: any) => {
              setSearchValue(e.target.value);
            }}
            value={searchValue}
            sx={{
              padding: "0.4375rem 1rem",
            }}
          />
          <IconButton
            title='Clear'
            aria-label='Clear'
            bg='none'
            border='none'
            onClick={() => {
              setSearchValue("");
            }}
            sx={{
              visibility: `${
                searchValue && searchValue.length > 0 ? "visible" : "hidden"
              }`,
              padding: 0,
            }}
          >
            <GrFormClose />
          </IconButton>
        </InputGroup>

        {getCountries()
          .map((countryCode: any) => ({
            countryCode: countryCode,
            countryName: labels[countryCode],
          }))
          .filter(
            (country: any) =>
              searchValue.length === 0 ||
              country.countryName
                .toLowerCase()
                .includes(searchValue.toLowerCase())
          )
          .map((country: any) => {
            return (
              <Box
                key={country.countryCode}
                sx={{
                  padding: "0.3rem 1rem",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "start",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: `#fff`,
                  },
                }}
              >
                <ImgStyled
                  sx={{marginRight: "1rem"}}
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country.countryCode}.svg`}
                  alt='Country Flag'
                />
                <Box
                  onClick={() => {
                    onChange(country.countryCode);
                    setSearchValue("");
                  }}
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  {country.countryName}{" "}
                  <span style={{fontWeight: "bold"}}>
                    {getCountryCallingCode(country.countryCode)}
                  </span>
                </Box>
              </Box>
            );
          })}
      </Box>
    </Collapse>
  );
};

CountrySelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  labels: PropTypes.objectOf(PropTypes.string).isRequired,
};

const PhoneInput = (props: PhoneInputProps) => {
  const {value, onChange, error, id, disabled = false} = props;
  const [maxLength, setMaxLength] = useState<number>();
  const [country, setCountry] = useState<CountryCode>(
    parsePhoneNumber(value ? value : "")?.country || "GB"
  );
  const [val, setVal] = useState<E164Number | undefined>(
    parsePhoneNumber(value ? value : "")?.number
  );
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "2px 14px",
        borderRadius: "4px",
        outline: "2px solid transparent",
        border: "1px solid #E2E8F0",
      }}
    >
      <ImgStyled
        sx={{
          opacity: `${disabled ? "0.5" : "1"}`,
          "&:hover": {
            cursor: "pointer",
          },
        }}
        onClick={() => setOpen(!open)}
        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
        alt='Country Flag'
      />

      <CountrySelect
        labels={en}
        isOpen={open}
        id='country-select'
        onClose={() => setOpen(false)}
        onChange={(value: CountryCode) => {
          setCountry(value);
          onChange && onChange("");
          setVal("");
          setOpen(false);
          setMaxLength(undefined);
        }}
      />

      <Text sx={{margin: "0 10px"}}>{`+${getCountryCallingCode(
        country
      )}`}</Text>

      <ReactPhoneInput
        international
        countryCallingCodeEditable={false}
        defaultCountry='GB'
        country={country}
        value={val}
        onChange={(value: E164Number | undefined) => {
          const phoneNumber = value && parsePhoneNumber(value.toString());
          const isValid = value && isValidPhoneNumber(value.toString());
          if (isValid && phoneNumber) {
            setMaxLength(phoneNumber.nationalNumber.length);
          }
          value && setVal(value);
          value && onChange && onChange(value);
        }}
        limitMaxLength
        style={{
          border: 0,
          outline: 0,
          fontWeight: "400",
          fontSize: "1rem",
          lineHeight: "1.5",
          letterSpacing: "0.15px",
          backgroundColor: "inherit",
        }}
        isValid={val && isValidPhoneNumber(val.toString())}
        maxLength={maxLength}
        disabled={disabled}
      />
    </div>
  );
};

export default PhoneInput;
