import { Typography, Box } from "@mui/material";

interface JobDescriptionViewerProps {
  jobText: string;
}

const JobDescriptionViewer: React.FC<JobDescriptionViewerProps> = ({ jobText }) => (
  <Box>
    <Typography variant="h6">Job Description</Typography>
    <Typography variant="body1">{jobText}</Typography>
  </Box>
);

export default JobDescriptionViewer;
