import React from "react";
import { Box, Typography, Paper, Link, Stack, Grid, useTheme, alpha } from "@mui/material";
import { ResumeData } from "@/api/analyze/schema";
import { RESUME_LABELS } from "@/constants";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  resume: ResumeData;
}

interface Experience {
  heading: string;
  bullets_primary: string[];
  bullets_optional?: string[];
}

const ContactSeparator = () => (
  <Box
    component="span"
    aria-hidden="true"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      mx: 0.75,
      color: "primary.main",
      fontWeight: "bold",
      fontSize: "1rem",
    }}
  >
    ·
  </Box>
);

const ResumeSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 800,
          color: "primary.main",
          borderBottom: "2px solid",
          borderColor: alpha(theme.palette.primary.main, 0.2),
          pb: 0.5,
          mb: 2,
          letterSpacing: 1.5,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

const OptimizedResume: React.FC<Props> = ({ resume }) => {
  const { locale } = useTranslation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  if (!resume) return null;

  const lang = (locale === "pt" ? "pt" : "en") as "en" | "pt";
  const t = RESUME_LABELS[lang];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, md: 8 },
        borderRadius: 4,
        bgcolor: isDarkMode ? alpha(theme.palette.background.paper, 0.8) : "#ffffff",
        color: "text.primary",
        border: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.1),
        backdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden",
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
      {/* HEADER SECTION */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1, mb: 0.5 }}>
          {resume.name?.toUpperCase() || "NAME NOT PROVIDED"}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            mb: 2,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {resume.title || ""}
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          sx={{ typography: "body2", color: "text.secondary", fontWeight: 500 }}
        >
          {resume.location && <span>{resume.location}</span>}
          {resume.phone && (
            <>
              <ContactSeparator />
              <span>{resume.phone}</span>
            </>
          )}
          {resume.email && (
            <>
              <ContactSeparator />
              <span>{resume.email}</span>
            </>
          )}
          {resume.linkedin && (
            <>
              <ContactSeparator />
              <Link href={resume.linkedin} target="_blank" color="primary" sx={{ fontWeight: 600 }}>
                LinkedIn
              </Link>
            </>
          )}
          {resume.github && (
            <>
              <ContactSeparator />
              <Link href={resume.github} target="_blank" color="primary" sx={{ fontWeight: 600 }}>
                GitHub
              </Link>
            </>
          )}
          {/* Restored Portfolio & Website */}
          {resume.portfolio && (
            <>
              <ContactSeparator />
              <Link
                href={resume.portfolio}
                target="_blank"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                {t.portfolio || "Portfolio"}
              </Link>
            </>
          )}
          {resume.website && (
            <>
              <ContactSeparator />
              <Link href={resume.website} target="_blank" color="primary" sx={{ fontWeight: 600 }}>
                Website
              </Link>
            </>
          )}
        </Stack>
      </Box>

      {/* SUMMARY */}
      {resume.summary && resume.summary.length > 0 && (
        <ResumeSection title={t.summary}>
          {resume.summary.map((point, i) => (
            <Typography
              key={i}
              variant="body1"
              sx={{ mb: 1.5, lineHeight: 1.7, color: "text.secondary" }}
            >
              {point}
            </Typography>
          ))}
        </ResumeSection>
      )}

      {/* EXPERIENCE */}
      {resume.experience && resume.experience.length > 0 && (
        <ResumeSection title={t.experience}>
          {resume.experience.map((exp: Experience, i) => (
            <Box key={i} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                {exp.heading}
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 0, "& li": { mb: 1 } }}>
                {exp.bullets_primary.map((bullet, j) => (
                  <Typography
                    component="li"
                    key={`p-${j}`}
                    variant="body2"
                    sx={{ lineHeight: 1.7, color: "text.secondary" }}
                  >
                    {bullet}
                  </Typography>
                ))}
                {exp.bullets_optional?.map((bullet, k) => (
                  <Typography
                    component="li"
                    key={`o-${k}`}
                    variant="body2"
                    sx={{ lineHeight: 1.7, color: "text.secondary" }}
                  >
                    {bullet}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </ResumeSection>
      )}

      {/* SKILLS */}
      {resume.skills && resume.skills.length > 0 && (
        <ResumeSection title={t.skills}>
          <Grid container spacing={4}>
            {resume.skills.map((skillGroup, i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={i}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, mb: 1 }}>
                    {skillGroup.category}
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.8, color: "text.secondary" }}>
                    {skillGroup.items.join("  •  ")}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </ResumeSection>
      )}

      {/* EDUCATION, LANGUAGES & RESTORED CERTIFICATIONS */}
      <Grid container spacing={4}>
        {resume.education && resume.education.length > 0 && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResumeSection title={t.education}>
              {resume.education.map((edu, i) => (
                <Typography key={i} variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  {edu}
                </Typography>
              ))}
            </ResumeSection>
          </Grid>
        )}
        {/* Restored Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResumeSection title={t.certifications || "Certifications"}>
              {resume.certifications.map((cert, i) => (
                <Typography key={i} variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                  {cert}
                </Typography>
              ))}
            </ResumeSection>
          </Grid>
        )}
        {resume.languages && resume.languages.length > 0 && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <ResumeSection title={t.languages}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {resume.languages.join(" · ")}
              </Typography>
            </ResumeSection>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default OptimizedResume;
