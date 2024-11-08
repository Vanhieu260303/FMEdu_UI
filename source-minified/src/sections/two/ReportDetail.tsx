"use client"
import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Box, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import CleaningReportService from 'src/@core/service/cleaningReport';

import ReportDetail from '../components/table/reportDetail';

const ReportDetailView = ({ id }: { id: string }) => {
  const [report, setReport] = useState<any>(null);
  const theme = useTheme();
  useEffect(() => {
    const fetchData = async () => {
      const response = await CleaningReportService.getCleaningReportById(id);
      setReport(response.data);
    }
    fetchData();
  }, [id]);
  if (!report) {
    return
  }

  return (
    <Container maxWidth="lg" >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => window.location.href = `/dashboard/two`}
          sx={{
            boxShadow: theme.shadows[3],
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: theme.shadows[10],
              transform: 'translateY(-2px)',
            },
          }}
        >
          Quay lại
        </Button>
        <Typography variant="h3" sx={{
          flexGrow: 1,
          textAlign: 'center',
        }}>Báo cáo vệ sinh</Typography>
      </Box>
      <ReportDetail report={report} />
    </Container>
  );
};

export default ReportDetailView;
