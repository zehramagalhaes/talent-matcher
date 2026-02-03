import { Typography, Box } from "@mui/material";

interface ReportViewerProps {
  report: string;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => (
  <Box>
    <Typography variant="h6">Compatibility Report</Typography>
    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
      {report}
    </Typography>
  </Box>
);

export default ReportViewer;
