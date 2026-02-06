import { Box, Stack, Card, Skeleton, alpha, useTheme } from "@mui/material";

const HomeSkeleton = () => {
  const theme = useTheme();
  return (
    <Box>
      {/* Header Skeleton */}
      <Box sx={{ mb: 5, display: "flex", alignItems: "center", gap: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" />
        </Box>
      </Box>

      {/* Disclaimer Card Skeleton */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 4,
          bgcolor: alpha(theme.palette.background.paper, 0.4),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          <Box sx={{ width: 150 }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="rounded" height={35} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" />
            <Skeleton variant="text" width="90%" />
          </Box>
        </Stack>
      </Card>

      {/* Form Area Skeleton */}
      <Skeleton variant="rounded" height={300} sx={{ borderRadius: 4, mb: 4 }} />

      {/* Status Bar Skeleton */}
      <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
        <Skeleton variant="text" width={120} height={30} />
        <Skeleton variant="text" width={120} height={30} />
      </Box>

      {/* Button Skeleton */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Skeleton variant="rounded" width={180} height={50} sx={{ borderRadius: 4 }} />
      </Box>
    </Box>
  );
};

export default HomeSkeleton;
