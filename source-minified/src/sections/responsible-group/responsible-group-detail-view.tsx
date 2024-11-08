'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button, Link } from '@mui/material';
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';

// ----------------------------------------------------------------------

export default function ResponsibleGroupDetailView({ id }: { id: string }) {

    const [responsibleGroup, setResponsibleGroup] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchResponsibleGroup = async () => {
            if (id) { 
                try {
                    const response: any = await ResponsibleGroupRoomService.getResponsibleGroupbyId(id);
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

        fetchResponsibleGroup();
    }, [id]);

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
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
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

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained">
                        <Link
                            href={`/dashboard/responsible-group/edit/${id}`}
                            sx={{ display: 'flex', color: 'white' }}  // Đặt màu đen
                            underline="none">
                            Chỉnh sửa
                        </Link>
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
