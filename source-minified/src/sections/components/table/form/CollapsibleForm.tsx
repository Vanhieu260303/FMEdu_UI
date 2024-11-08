import { Container, Typography, Paper, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Box, Button, Chip, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { GroupRoomService } from 'src/@core/service/grouproom';
import EditRoomGroup from '../../form/EditRoomGroup';
import SnackbarComponent from '../../snackBar';
import  CleaningFormService  from 'src/@core/service/form';
import RenderRatingInput from '../../rating/renderRatingInput';
import Popup from '../../form/Popup';
import EditForm from '../../form/EditForm';

interface props{
    id:string;
}
const CollapsibleForm = ({id}:props) => {
    const [data, setData] = useState<any>({});
    const [openPopUp, setOpenPopUp] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarStatus, setSnackbarStatus] = useState('success');

    const handleEditClick = () => {
        setOpenPopUp(true);
    }
    const handleEditFormSuccess = (message:string) =>{
        setSnackbarMessage(message);
        setSnackbarStatus('success');
        setSnackbarOpen(true);
        fetchFormData();
        setTimeout(() => {
          setSnackbarOpen(false);
        }, 3000);
    }

    const fetchFormData = async () => {
        try {
            const response = await CleaningFormService.getFormInfoById(id);
            setData(response.data);
        } catch (error: any) {
            console.error('Error fetching responsible group:', error);
        }
    };
    useEffect(() => {
        fetchFormData();
    }, [])

    return (
        <Paper elevation={3} sx={{ position: 'relative', pb: 8 }}>
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
              {data?.criteriaList?.map((criterion:any,index:any) => (
                <>
                  <TableRow key={data.id}>
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

            <Box sx={{
                position: 'absolute',
                bottom: 16, // Khoảng cách từ bottom
                right: 16, // Khoảng cách từ right
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <Button variant="contained" onClick={handleEditClick}>
                    Chỉnh sửa
                </Button>
                <Popup title="Tạo mới nhóm phòng" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
                    <EditForm setOpenPopup={setOpenPopUp} onSuccess={handleEditFormSuccess} formId={data?.idForm}/>
                </Popup>
            </Box>
            <SnackbarComponent
                status={snackbarStatus as 'success' | 'error' | 'info' | 'warning'}
                open={snackbarOpen}
                message={snackbarMessage}
            />
        </Paper>
    )
}

export default CollapsibleForm