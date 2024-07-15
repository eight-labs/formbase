import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { render } from '@react-email/render';

interface Props {
  formTitle: string;
  submissionData: Record<string, unknown>;
}

const formatKey = (key: string): string => {
  if (key.includes('_')) {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const NewSubmissionEmail = ({ formTitle, submissionData }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>New Submission for {formTitle}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>Formbase</Text>
            <Text style={text}>Hi,</Text>
            <Text style={text}>
              Your form <strong>{formTitle}</strong> has a new submission. Here
              are the details:
            </Text>
            <Section style={submissionContainer}>
              {Object.entries(submissionData).map(([key, value]) => (
                <Row key={key} style={submissionRow}>
                  <Column style={submissionLabel}>{formatKey(key)}:</Column>
                  <Column style={submissionValue}>{String(value)}</Column>
                </Row>
              ))}
            </Section>
            <Text style={text}>Have a nice day!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const renderNewSubmissionEmail = ({
  formTitle,
  submissionData,
}: Props) =>
  render(
    <NewSubmissionEmail
      formTitle={formTitle}
      submissionData={submissionData}
    />,
  );

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const title = {
  ...text,
  fontSize: '22px',
  fontWeight: '700',
  lineHeight: '32px',
};

const submissionContainer = {
  marginTop: '20px',
  marginBottom: '20px',
  borderTop: '1px solid #f0f0f0',
  borderBottom: '1px solid #f0f0f0',
  padding: '20px 0',
};

const submissionRow = {
  marginBottom: '10px',
};

const submissionLabel = {
  ...text,
  fontWeight: '700',
  width: '30%',
};

const submissionValue = {
  ...text,
  width: '70%',
};
