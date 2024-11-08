"use client"
import { Button, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Container, Box, Stack, Chip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import RenderRatingInput from 'src/sections/components/rating/renderRatingInput'
import  CleaningFormService  from 'src/@core/service/form';


const FormDetailView = ({ id }: { id: string }) => {
  const [form,setForm] = useState<any>();
  useEffect(()=>{
    const fetchData = async()=>{
      const response = await CleaningFormService.getFormInfoById(id);
      setForm(response.data);
    }
    fetchData();
  },[id]);
  if (!form) {
    return;
  }
  return (
    <Container maxWidth="lg" >
      <Button
        startIcon={<ArrowBackOutlinedIcon fontSize='large' />}
        onClick={() => window.history.back()}
      />
      <Box sx={{ mt: 5 }}>
        <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Form báo cáo
        </Typography>
        <Box sx={{ display: 'flex', justifyContent:'center', alignItems: 'center',margin:'20px'}}>
          <Typography variant="h5" gutterBottom >
            {form.campusName} ---
          </Typography>
          <Typography variant="h5" gutterBottom>
             {form.blockName} ---
          </Typography>
          <Typography variant="h5" gutterBottom>
             {form.floorName} ---
          </Typography>
          <Typography variant="h5" gutterBottom>
             {form.roomName}
          </Typography>
        </Box>
        <TableContainer component={Paper} sx={{ marginTop: '10px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Tiêu chí</TableCell>
                <TableCell align="center">Đánh giá</TableCell>
                <TableCell align="center">Phân loại</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.criteriaList.map((criterion:any,index:any) => (
                <>
                  <TableRow key={form.ID}>
                    <TableCell align="center">
                      {index+1}
                    </TableCell>
                    <TableCell align="center">
                      {criterion.name}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RenderRatingInput criteriaID={criterion.id} inputRatingType={criterion.criteriaType} disabled={true} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction='row' spacing={1} justifyContent='center' >
                        {criterion.tags?.map((tag:any) =>
                          <Chip key={tag.id} label={tag.name} />
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )

}

export default FormDetailView