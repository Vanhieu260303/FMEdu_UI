'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Button, Link, TableHead } from '@mui/material';
import GroupRoomService from 'src/@core/service/grouproom';

// ----------------------------------------------------------------------

export default function RoomGroupDetailView({ id }: { id: string }) {

    const [roomGroup, setRoomGroup] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRoomGroup = async () => {
            if (id) {
                try {
                    const response: any = await GroupRoomService.getRoomGroupById(id);
                    setRoomGroup(response.data);
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

        fetchRoomGroup();
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

    if (!roomGroup) {
        return (
            <Container>
                <Typography variant="h6" sx={{ marginTop: 3 }}>
                    Không tìm thấy thông tin của nhóm phòng.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Thông tin {roomGroup.groupName}
                </Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell align="left"><strong>Tên nhóm:</strong></TableCell>
                                <TableCell align="left">{roomGroup.groupName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left"><strong>Mô tả:</strong></TableCell>
                                <TableCell align="left">{roomGroup.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left"><strong>Thông tin phòng:</strong></TableCell>
                                <TableCell align="left">
                                    <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>STT</strong></TableCell>
                                                    <TableCell><strong>Cơ sở</strong></TableCell>
                                                    <TableCell><strong>Tòa nhà</strong></TableCell>
                                                    <TableCell><strong>Tầng</strong></TableCell>
                                                    <TableCell><strong>Khu vực</strong></TableCell>
                                                    <TableCell><strong>Phòng</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {roomGroup.rooms && roomGroup.rooms.map((room: any, index: any) => (
                                                    <TableRow key={room.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{room.campusName}</TableCell>
                                                        <TableCell>{room.blockName}</TableCell>
                                                        <TableCell>{room.floorName}</TableCell>
                                                        <TableCell>{room.categoryName}</TableCell>
                                                        <TableCell>{room.roomName}</TableCell>
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
                            href={`/dashboard/room-group/edit/${id}`}
                            sx={{ display: 'flex', color: 'white' }}
                            underline="none">
                            Chỉnh sửa
                        </Link>
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
