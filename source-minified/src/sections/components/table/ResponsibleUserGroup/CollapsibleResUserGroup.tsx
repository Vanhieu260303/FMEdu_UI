import { Container, Paper, Typography, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Box, Button, Link, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import Popup from '../../form/Popup';
import EditResUserGroup from '../../form/EditResUserGroup';
import SnackbarComponent from '../../snackBar';


interface props {
    id: string;
}
const CollapsibleResUserGroup = ({ id }: props) => {

    const [responsibleGroup, setResponsibleGroup] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [openPopUp, setOpenPopUp] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarStatus, setSnackbarStatus] = useState('success');

    const handleEditClick = () => {
        setOpenPopUp(true);
    }
    const handleEditRoomGroupSuccess = (message:string) =>{
        setSnackbarMessage(message);
        setSnackbarStatus('success');
        setSnackbarOpen(true);
        fetchResponsibleGroup();
        setTimeout(() => {
          setSnackbarOpen(false);
        }, 3000);
    }
    const fetchResponsibleGroup = async () => {
        if (id) {
            try {
                const response = await ResponsibleGroupRoomService.getResponsibleGroupbyId(id);
                setResponsibleGroup(response.data);
                setLoading(false);
            } catch (error: any) {
                console.error('Error fetching responsible group:', error);
                setLoading(false);
            }
        } else {
            console.error('ID is null or not found in URL');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResponsibleGroup();
    }, []);

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!responsibleGroup) {
        return (
            <Container>
                <Typography variant="h6" sx={{ marginTop: 3 }}>
                    Không tìm thấy thông tin của nhóm chịu trách nhiệm.
                </Typography>
            </Container>
        );
    }

    return (
        <Paper elevation={3} sx={{ position: 'relative', pb: '8px' }}>
            <Typography variant="h4" gutterBottom align="center">
                Thông tin thành viên nhóm chịu trách nhiệm
            </Typography>
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell align="left"><strong>Tên nhóm:</strong></TableCell>
                            <TableCell align="left">{responsibleGroup.groupName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><strong>Mô tả:</strong></TableCell>
                            <TableCell align="left">{responsibleGroup.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><strong>Màu sắc:</strong></TableCell>
                            <TableCell align="left">
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        backgroundColor: responsibleGroup.color,
                                        border: '1px solid black'
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left"><strong>Thành viên nhóm:</strong></TableCell>
                            <TableCell align="left">
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            {responsibleGroup.users && responsibleGroup.users.map((user: any) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TableCell>
                        </TableRow>


                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ position: 'absolute', right: '16px', bottom: '16px' }}>
                <Button variant="contained" onClick={handleEditClick}>
                    Chỉnh sửa
                </Button>
                <Popup title="Tạo mới nhóm phòng" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
                    <EditResUserGroup setOpenPopup={setOpenPopUp} onSuccess={handleEditRoomGroupSuccess} id={id} data={responsibleGroup} />
                </Popup>
            </Box>
            <SnackbarComponent
                status={snackbarStatus as 'success' | 'error' | 'info' | 'warning'}
                open={snackbarOpen}
                message={snackbarMessage}
            />
        </Paper>
    );
}

export default CollapsibleResUserGroup