import React from "react";
import { Box, Typography, Paper, Link, Stack, Grid, useTheme, alpha } from "@mui/material";
import { ResumeData } from "@/api/analyze/schema";
import { useTranslation } from "@/hooks/useTranslation";
import { useResumeInfo } from "@/hooks/useResumeInfo";
import { BulletList } from "@/components/common/BulletList";
import { Section } from "@/components/common/Section";

export const OptimizedResume: React.FC<{ resume: ResumeData }> = ({ resume }) => {
  const { locale } = useTranslation();
  const theme = useTheme();
  const { labels, contactList, formattedExperiences, footerSections } = useResumeInfo(
    resume,
    locale
  );

  if (!resume) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, md: 8 },
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
        bgcolor: (t) =>
          t.palette.mode === "dark" ? alpha(t.palette.background.paper, 0.8) : "#fff",
        border: (t) => `1px solid ${alpha(t.palette.divider, 0.1)}`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
      }}
    >
      {/* 1. HEADER */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1 }}>
          {resume.name?.toUpperCase()}
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: 700, mb: 2, textTransform: "uppercase" }}
        >
          {resume.title}
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          sx={{ typography: "body2", color: "text.secondary", gap: 0.5 }}
        >
          {resume.location}
          {contactList.map((c, i) => (
            <React.Fragment key={i}>
              <Box component="span" sx={{ mx: 0.5, color: "primary.main", fontWeight: "bold" }}>
                ·
              </Box>
              {c.isLink ? (
                <Link
                  href={c.val!}
                  target="_blank"
                  color="primary"
                  sx={{ fontWeight: 600, textDecoration: "none" }}
                >
                  {c.lab}
                </Link>
              ) : (
                <span>{c.val}</span>
              )}
            </React.Fragment>
          ))}
        </Stack>
      </Box>

      {/* 2. SUMMARY */}
      {resume.summary?.length > 0 && (
        <Section title={labels.summary}>
          {resume.summary.map((s, i) => (
            <Typography
              key={i}
              variant="body1"
              sx={{ mb: 1.5, color: "text.secondary", lineHeight: 1.7 }}
            >
              {s}
            </Typography>
          ))}
        </Section>
      )}

      {/* 3. EXPERIENCE */}
      {formattedExperiences.length > 0 && (
        <Section title={labels.experience}>
          {formattedExperiences.map((exp, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                {exp.heading}
              </Typography>
              <BulletList items={exp.allBullets} />
            </Box>
          ))}
        </Section>
      )}

      {/* 4. SKILLS & FOOTER */}
      <Grid container spacing={4}>
        {resume.skills?.length > 0 && (
          <Grid size={12}>
            <Section title={labels.skills}>
              <Grid container spacing={2}>
                {resume.skills.map((s, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {s.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {s.items.join("  •  ")}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Section>
          </Grid>
        )}

        {footerSections.map((sec, i) => (
          <Grid size={{ xs: 12, sm: 6 }} key={i}>
            <Section title={sec.title}>
              {sec.isInline ? (
                <Typography variant="body2" color="text.secondary">
                  {sec.data.join(" · ")}
                </Typography>
              ) : (
                sec.data.map((item: string, j: number) => (
                  <Typography key={j} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {item}
                  </Typography>
                ))
              )}
            </Section>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
