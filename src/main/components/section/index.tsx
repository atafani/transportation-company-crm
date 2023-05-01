import {Box, Heading, Text} from "@chakra-ui/react";
import {ReactElement} from "react";

type SectionProps = {
  title: string;
  children: ReactElement;
};
const Section = (props: SectionProps) => {
  const {title, children} = props;
  return (
    <Box>
      <Text my={5} fontWeight='bold' color='teal' variant={"body1"}>
        {title}
      </Text>
      <Box px={{base: 0, md: 5}}>{children}</Box>
    </Box>
  );
};
export default Section;
