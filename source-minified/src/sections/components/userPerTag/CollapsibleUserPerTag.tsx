import { Container, Paper, Typography, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Box, Button, Link, CircularProgress, TableFooter } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import EditResUserGroup from '../form/EditResUserGroup';
import SnackbarComponent from '../snackBar';
import Popup from '../form/Popup';
import TagService from 'src/@core/service/tag';
import EditUserPerTag from '../form/EditUserPerTag';



interface props {
    id: string;
    tagName: string
}
const CollapsibleUserPerTag = ({ id, tagName }: props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [openPopUp, setOpenPopUp] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarStatus, setSnackbarStatus] = useState('success');
    const [tagGroup, setTagGroup] = useState<any | null>(null);


    const handleEditClick = async () => {
        setOpenPopUp(true);
    }

    const handleEditTagSuccess = async (message: string) => {
        setSnackbarMessage(message);
        setSnackbarStatus('success');
        setSnackbarOpen(true);
        fetchTagGroupInfo();
        setTimeout(() => {
            setSnackbarOpen(false);
        }, 3000);
    }

    const fetchTagGroupInfo = async () => {
        try {
            const response = await TagService.getGroupInfoByTagId(id);
            setTagGroup(response.data);
            setLoading(false);

        } catch (error: any) {
            console.error('Error fetching responsible group:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTagGroupInfo();
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

    if (tagGroup.length === 0) {
        return (
            <Paper elevation={3} sx={{ pb: '8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ textAlign: 'center', marginY: '10px' }}>
                    <Typography variant="h6" >
                        Không có thành viên trong tag này
                    </Typography>
                </Box>

                <Button variant="contained" onClick={handleEditClick} sx={{ marginX: '10px' }}>
                    Chỉnh sửa
                </Button>
                <Popup title="Chỉnh sửa Tag" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
                    <EditUserPerTag setOpenPopup={setOpenPopUp} onSuccess={handleEditTagSuccess} data={{ id: id, tagName: tagName, tagGroup }} />
                </Popup>
                <SnackbarComponent
                    status={snackbarStatus as 'success' | 'error' | 'info' | 'warning'}
                    open={snackbarOpen}
                    message={snackbarMessage}
                />
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ position: 'relative', pb: '8px' }}>
            <Typography variant="h4" gutterBottom align="center">
                Thông tin thành viên của tag {tagGroup[0].tagName}
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Danh sách báo cáo vệ sinh">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">Tên thành viên</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Nhóm phòng</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tagGroup.map((user: any, index: any) => (
                            <TableRow key={user.id}>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="center">{`${user.firstName} ${user.lastName}`}</TableCell>
                                <TableCell align="center">{user.userName}</TableCell>
                                <TableCell align="center">{user.groupName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} align="right">
                                <Button variant="contained" onClick={handleEditClick}>
                                    Chỉnh sửa
                                </Button>
                                <Popup title="Chỉnh sửa Tag" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
                                    <EditUserPerTag setOpenPopup={setOpenPopUp} onSuccess={handleEditTagSuccess} data={{ id: id, tagName: tagName, tagGroup }} />
                                </Popup>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <SnackbarComponent
                status={snackbarStatus as 'success' | 'error' | 'info' | 'warning'}
                open={snackbarOpen}
                message={snackbarMessage}
            />
        </Paper>
    );
}

export default CollapsibleUserPerTag