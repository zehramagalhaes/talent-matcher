import { Typography, Box } from "@mui/material";

interface ResumeParserProps {
  resumeText: string;
}

const ResumeParser: React.FC<ResumeParserProps> = ({ resumeText }) => (
  <Box>
    <Typography variant="h6">Extracted Resume Data</Typography>
    <Typography variant="body1">{resumeText}</Typography>
  </Box>
);

export default ResumeParser;
