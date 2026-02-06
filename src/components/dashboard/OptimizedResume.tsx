import React from "react";
import { Box, Typography, Paper, Link, Stack, Grid } from "@mui/material";
import { ResumeData } from "@/api/schemas/optimizationSchema";

interface Props {
  resume: ResumeData;
}

interface HeaderProps {
  name?: string | null;
  title?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  website?: string | null;
  languages?: string[] | null;
}

interface Experience {
  heading: string;
  bullets_primary: string[];
  bullets_optional?: string[];
}

// Fixed Separator: ensures perfect vertical centering regardless of font baseline
const ContactSeparator = () => (
  <Box
    component="span"
    aria-hidden="true"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      mx: 0.75,
      color: "text.secondary",
      fontSize: "0.8rem",
      lineHeight: 0, // Critical to prevent baseline offset
      userSelect: "none",
    }}
  >
    •
  </Box>
);

const ResumeSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="subtitle2"
      sx={{
        fontWeight: "bold",
        borderBottom: "1px solid",
        borderColor: "divider",
        mb: 1,
        letterSpacing: 1,
      }}
    >
      {title.toUpperCase()}
    </Typography>
    {children}
  </Box>
);

const ResumeHeader = ({
  name,
  title,
  location,
  email,
  phone,
  linkedin,
  github,
  portfolio,
  website,
}: HeaderProps) => (
  <Box sx={{ textAlign: "center", mb: 4 }}>
    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 1 }}>
      {name?.toUpperCase() || "NAME NOT PROVIDED"}
    </Typography>
    <Typography variant="subtitle1" sx={{ color: "text.secondary", fontWeight: 500, mb: 1 }}>
      {title || ""}
    </Typography>

    <Stack
      direction="row"
      flexWrap="wrap"
      justifyContent="center"
      alignItems="center" // Centering logic for the row
      sx={{ typography: "caption", color: "text.secondary" }}
    >
      {location && <span>{location}</span>}
      {phone && (
        <>
          <ContactSeparator />
          <span>{phone}</span>
        </>
      )}
      {email && (
        <>
          <ContactSeparator />
          <span>{email}</span>
        </>
      )}
      {linkedin && (
        <>
          <ContactSeparator />
          <Link href={linkedin} target="_blank" color="inherit" underline="hover">
            LinkedIn
          </Link>
        </>
      )}
      {github && (
        <>
          <ContactSeparator />
          <Link href={github} target="_blank" color="inherit" underline="hover">
            GitHub
          </Link>
        </>
      )}
      {portfolio && (
        <>
          <ContactSeparator />
          <Link href={portfolio} target="_blank" color="inherit" underline="hover">
            Portfolio
          </Link>
        </>
      )}
      {website && (
        <>
          <ContactSeparator />
          <Link href={website} target="_blank" color="inherit" underline="hover">
            Website
          </Link>
        </>
      )}
    </Stack>
  </Box>
);

const OptimizedResume: React.FC<Props> = ({ resume }) => {
  if (!resume) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 3, md: 8 },
        borderRadius: 0,
        bgcolor: "background.paper", // Theme responsiveness
        color: "text.primary",
      }}
    >
      <ResumeHeader
        name={resume.name}
        title={resume.title}
        location={resume.location}
        email={resume.email}
        phone={resume.phone}
        linkedin={resume.linkedin}
        github={resume.github}
        portfolio={resume.portfolio}
        website={resume.website}
      />

      <ResumeSection title="Summary">
        {resume.summary.map((point: string, i: number) => (
          <Typography key={i} variant="body2" sx={{ mb: 0.5, lineHeight: 1.6 }}>
            {point}
          </Typography>
        ))}
      </ResumeSection>

      <ResumeSection title="Experience">
        {resume.experience.map((exp: Experience, i: number) => (
          <Box key={i} sx={{ mb: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {exp.heading}
            </Typography>

            <Box component="ul" sx={{ pl: 2, mt: 0, "& li": { mb: 0.5 } }}>
              {exp.bullets_primary.map((bullet: string, j: number) => (
                <Typography
                  component="li"
                  key={`primary-${j}`}
                  variant="body2"
                  sx={{ lineHeight: 1.6 }}
                >
                  {bullet}
                </Typography>
              ))}

              {exp.bullets_optional &&
                exp.bullets_optional.map((bullet: string, k: number) => (
                  <Typography
                    component="li"
                    key={`opt-${k}`}
                    variant="body2"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {bullet}
                  </Typography>
                ))}
            </Box>
          </Box>
        ))}
      </ResumeSection>

      {resume.education && resume.education.length > 0 && (
        <ResumeSection title="Education">
          {resume.education.map((edu: string, i: number) => (
            <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
              {edu}
            </Typography>
          ))}
        </ResumeSection>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <ResumeSection title="Skills">
          <Grid container spacing={3}>
            {resume.skills.map((skillGroup: { category: string; items: string[] }, i: number) => (
              <Grid size={{ xs: 12, sm: 6 }} key={i}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    {skillGroup.category}
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {skillGroup.items.join(" • ")}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </ResumeSection>
      )}
    </Paper>
  );
};

export default OptimizedResume;
