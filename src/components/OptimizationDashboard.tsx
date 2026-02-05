import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Paper,
  Button,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { jsPDF } from "jspdf";
import { OptimizationResult } from "@/api/schemas/optimizationSchema";
import { useToast } from "@/context/ToastContext";
import OptimizedResume from "./OptimizedResume";

interface Props {
  data: OptimizationResult;
}

const OptimizationDashboard: React.FC<Props> = ({ data }) => {
  const { addToast } = useToast();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const resume = data.optimized_resume;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(resume.name?.toUpperCase() ?? "RESUME", pageWidth / 2, y, { align: "center" });
    y += 12;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(resume.title ?? "", pageWidth / 2, y, { align: "center" });
    y += 6;
    const contactLine = [resume.location, resume.languages?.join(", ")].filter(Boolean).join(" | ");
    doc.text(contactLine, pageWidth / 2, y, { align: "center" });
    y += 15;

    // Experience
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PROFESSIONAL EXPERIENCE", margin, y);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 10;

    resume.experience.forEach((exp) => {
      checkPageBreak(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(exp.heading, margin, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      exp.bullets_primary.forEach((bullet) => {
        const splitBullet = doc.splitTextToSize(`• ${bullet}`, contentWidth - 5);
        const bulletHeight = splitBullet.length * 5;
        checkPageBreak(bulletHeight);
        doc.text(splitBullet, margin + 5, y);
        y += bulletHeight + 2;
      });
      y += 4;
    });

    doc.save(`${resume.name?.replace(/\s+/g, "_")}_Optimized.pdf`);
    addToast("PDF generated successfully!", "success");
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* 1. Dashboard Controls */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4, gap: 2 }}
      >
        <Typography variant="h4" fontWeight="bold">
          Analysis Results
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={isPreviewMode}
                onChange={(e) => setIsPreviewMode(e.target.checked)}
                color="secondary"
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <VisibilityIcon fontSize="small" />
                <Typography variant="body2">PDF Preview</Typography>
              </Box>
            }
          />
          <Button startIcon={<DownloadIcon />} variant="contained" onClick={handleDownloadPDF}>
            Download
          </Button>
        </Stack>
      </Stack>

      {/* 2. Toggleable View */}
      {!isPreviewMode ? (
        <>
          {/* Main Dashboard Stats & Suggestions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ textAlign: "center", p: 2, bgcolor: "primary.main", color: "white" }}>
                <Typography variant="h6">Match Score</Typography>
                <Typography variant="h2" sx={{ fontWeight: 800 }}>
                  {data.match_score}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={data.match_score}
                  sx={{
                    mt: 2,
                    height: 8,
                    borderRadius: 5,
                    bgcolor: "rgba(255,255,255,0.2)",
                    "& .MuiLinearProgress-bar": { bgcolor: "white" },
                  }}
                />
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                  >
                    <AssignmentIcon /> AI Insights
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.scoring_rubric.overall_notes}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <LightbulbIcon color="info" /> Recommended Skills to Add
            </Typography>
            <Grid container spacing={2}>
              {data.keywords_to_add.map((keyword) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={keyword}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 1.5, textAlign: "center", borderStyle: "dashed" }}
                  >
                    <Typography variant="caption" fontWeight="bold">
                      {keyword}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      ) : (
        /* Preview Mode Notice */
        <Box
          sx={{ mb: 3, p: 2, bgcolor: "info.light", borderRadius: 2, color: "info.contrastText" }}
        >
          <Typography variant="body2" fontWeight="bold">
            💡 Showing PDF Preview: This is how your resume will look to recruiters.
          </Typography>
        </Box>
      )}

      {/* 3. The Resume Component (Always visible, but changes context based on isPreviewMode) */}
      <Box sx={isPreviewMode ? { transform: "scale(0.95)", transition: "transform 0.3s" } : {}}>
        <OptimizedResume resume={data.optimized_resume} />
      </Box>
    </Box>
  );
};

export default OptimizationDashboard;
