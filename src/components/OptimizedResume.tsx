import React from "react";
import { Box, Typography, Paper, Link, Stack } from "@mui/material";
import { OptimizationResult } from "@/api/schemas/optimizationSchema";

interface Props {
  resume: OptimizationResult["optimized_resume"];
}

// 1. Update Interface to allow null (matching the Zod schema)
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

const ResumeSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="subtitle2"
      sx={{ fontWeight: "bold", borderBottom: "1px solid black", mb: 1, letterSpacing: 1 }}
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
    <Typography variant="subtitle1" sx={{ color: "grey.700", fontWeight: 500 }}>
      {title || "Professional Title"}
    </Typography>

    <Stack
      direction="row"
      flexWrap="wrap"
      justifyContent="center"
      divider={<Typography sx={{ mx: 0.5, color: "grey.400" }}>•</Typography>}
      sx={{ typography: "caption", color: "text.secondary", mt: 1 }}
    >
      {location && <span>{location}</span>}
      {phone && <span>{phone}</span>}
      {email && <span>{email}</span>}
      {linkedin && (
        <Link href={linkedin} target="_blank" color="inherit">
          LinkedIn
        </Link>
      )}
      {github && (
        <Link href={github} target="_blank" color="inherit">
          GitHub
        </Link>
      )}
      {portfolio && (
        <Link href={portfolio} target="_blank" color="inherit">
          Portfolio
        </Link>
      )}
      {website && (
        <Link href={website} target="_blank" color="inherit">
          Website
        </Link>
      )}
    </Stack>
  </Box>
);

const OptimizedResume: React.FC<Props> = ({ resume }) => {
  return (
    <Paper
      elevation={3}
      sx={{ p: { xs: 3, md: 8 }, bgcolor: "white", color: "black", borderRadius: 0 }}
    >
      {/* 2. Pass values directly. Nulls are now handled by the interface and the ?? defaults */}
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
        languages={resume.languages}
      />

      <ResumeSection title="Professional Summary">
        {resume.summary.map((point, i) => (
          <Typography key={i} variant="body2" sx={{ mb: 0.5, lineHeight: 1.6 }}>
            {point}
          </Typography>
        ))}
      </ResumeSection>

      <ResumeSection title="Experience">
        {resume.experience.map((exp, i) => (
          <Box key={i} sx={{ mb: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {exp.heading}
            </Typography>
            <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
              {exp.bullets_primary.map((bullet, j) => (
                <Typography component="li" key={j} variant="body2">
                  {bullet}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}
      </ResumeSection>

      {resume.education && resume.education.length > 0 && (
        <ResumeSection title="Education">
          {resume.education.map((edu, i) => (
            <Typography key={i} variant="body2">
              {edu}
            </Typography>
          ))}
        </ResumeSection>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <ResumeSection title="Skills">
          <Typography variant="body2">{resume.skills.join(" • ")}</Typography>
        </ResumeSection>
      )}
    </Paper>
  );
};

export default OptimizedResume;
