import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";

import { APP_TITLE } from "src/lib/constants";

interface Props {
  link: string;
  formTitle: string;
}

export const NewSubmissionEmail = ({ link, formTitle }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>New Submission for {formTitle}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>{APP_TITLE}</Text>
            <Text style={text}>Hi,</Text>
            <Text style={text}>
              Your form <strong>{formTitle}</strong> has a new submission. You
              can view it by clicking the button below:
            </Text>
            <Button style={button} href={link}>
              View Submission
            </Button>
            <Text style={text}>Have a nice day!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const renderNewSubmissionEmail = ({ link, formTitle }: Props) =>
  render(<NewSubmissionEmail link={link} formTitle={formTitle} />);

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const title = {
  ...text,
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "32px",
};

const button = {
  backgroundColor: "#09090b",
  borderRadius: "4px",
  color: "#fafafa",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

// const anchor = {
//   textDecoration: "underline",
// };
