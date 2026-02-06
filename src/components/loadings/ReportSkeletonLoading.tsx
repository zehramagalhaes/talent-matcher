import { Box, Skeleton, Container, Stack } from "@mui/material";

const ReportSkeleton = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 5 } }}>
      {/* Top Action Bar Skeleton */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton variant="rounded" width={120} height={40} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rounded" width={150} height={30} sx={{ borderRadius: 1 }} />
      </Box>

      {/* Main Dashboard Skeleton */}
      <Stack spacing={4}>
        {/* Score Circle Area */}
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Skeleton variant="circular" width={200} height={200} />
        </Box>

        {/* Grid of Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <Skeleton variant="rounded" height={250} sx={{ borderRadius: 4 }} />
          <Skeleton variant="rounded" height={250} sx={{ borderRadius: 4 }} />
          <Skeleton
            variant="rounded"
            height={400}
            sx={{ borderRadius: 4, gridColumn: { md: "span 2" } }}
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default ReportSkeleton;
