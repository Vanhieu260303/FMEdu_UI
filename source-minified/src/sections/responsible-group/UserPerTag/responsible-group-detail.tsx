'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState } from 'react';
import {CircularProgress, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Menu, MenuItem } from '@mui/material';
import  TagService  from 'src/@core/service/tag';


// ----------------------------------------------------------------------


export default function UserPerTagDetail({ id }: { id: string }) {
    const settings: any = useSettingsContext();


    const [tagGroup, setTagGroup] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTaggroupInfo = async () => {
            if (id) { 
                try {
                    const response: any = await TagService.getGroupInfoByTagId(id);
                    setTagGroup(response.data);
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
        fetchTaggroupInfo();
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

    if (!tagGroup) {
        return (
            <Container>
                <Typography variant="h6" sx={{ marginTop: 3 }}>
                    Không tìm thấy thông tin nhóm tag.
                </Typography>
            </Container>
        );
    }



    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Box sx={{margin:'20px 0'}}>Thông tin tag {tagGroup.tagName}</Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Danh sách báo cáo vệ sinh">

                    <TableHead>
                        <TableRow>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">Tên thành viên</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Nhóm</TableCell>
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
                </Table>
            </TableContainer>
        </Container>
    );
}
