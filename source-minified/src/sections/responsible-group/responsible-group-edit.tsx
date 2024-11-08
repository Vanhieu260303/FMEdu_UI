'use client';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState } from 'react';
import {
    Button, Checkbox, Stack, TextField, Alert, MenuItem, Select, InputLabel, FormControl,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper,
    AlertTitle
} from '@mui/material';
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import UserService from 'src/@core/service/user';

// ----------------------------------------------------------------------

export default function ResponsibleGroupEdit({ id }: { id: string }) {
    const settings = useSettingsContext();
    const [responsibleGroup, setResponsibleGroup] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

    const [customColor, setCustomColor] = useState('#000000');
    const [isCustom, setIsCustom] = useState(false);

    // State variables
    const [groupName, setGroupName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

    const colors = [
        { label: 'Xanh', value: '#0000FF' },
        { label: 'Đỏ', value: '#FF0000' },
        { label: 'Vàng', value: '#FFFF00' },
        { label: 'Tím', value: '#800080' },
        { label: 'Xanh Lá', value: '#008000' },
        { label: 'Hồng', value: '#FFC0CB' },
        { label: 'Cam', value: '#FFA500' },
        { label: 'Tùy chọn', value: 'custom' }
    ];

    const handleColorChange = (event: any) => {
        const value = event.target.value;
        setColor(value);
        setIsCustom(value === 'custom');
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response: any = await UserService.getAllUsers();
                setUsers(response.data);
            } catch (error: any) {
                console.error('Error fetching users data:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchResponsibleGroup = async () => {
            if (id) {
                try {
                    const response: any = await ResponsibleGroupRoomService.getResponsibleGroupbyId(id);
                    const groupData = response.data;
                    setResponsibleGroup(groupData);
                    setGroupName(groupData.groupName);
                    setDescription(groupData.description);
                    setColor(groupData.color);
                    setSelectedUsers(groupData.users || []);
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

    const handleUserSelection = (event: any, user: any) => {
        if (event.target.checked) {
            setSelectedUsers((prev) => [...prev, user]);
        } else {
            setSelectedUsers((prev) => prev.filter((u: any) => u.id !== user.id));
        }
    };

    const handleSubmit = async () => {
    try {

        const data  = {
            groupName,
            description,
            color,
            Users: selectedUsers.map((user: any) => ({
              id: user.id,
              userName: user.userName,
            })),
        };
         const response = await ResponsibleGroupRoomService.updateResponsibleGroup(id, data);
       
        if (!response.data.success) {
           setAlert({ severity: 'error', message: response.data.message });
        } else {
           setAlert({ severity: 'success', message: 'Nhóm đã được cập nhật thành công!' });
        }
        } catch (error: any) {
          setAlert({ severity: 'error', message: 'Đã xảy ra lỗi khi cập nhật dữ liệu. Vui lòng thử lại sau.' });
        }
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4">Chỉnh sửa nhóm người chịu trách nhiệm</Typography>
            </Box>
            {alert && (
                <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                    <Alert
                        severity={alert.severity}
                        onClose={() => setAlert(null)}
                    >
                        <AlertTitle>{alert.severity === 'error' ? 'Error' : 'Success'}</AlertTitle>
                        {alert.message}
                    </Alert>
                </Box>
            )}
            {/* Form nhập tên nhóm và mô tả */}
            <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                <TextField
                    id="group-name"
                    label="Tên Nhóm"
                    variant="outlined"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
            </Box>

            <Box sx={{ '& > :not(style)': { m: 1, width: '35ch' } }}>
                <TextField
                    id="group-description"
                    label="Mô tả nhóm chị trách nhiệm"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Box>

            <Box sx={{ '& > :not(style)': { m: 1, width: '35ch' } }}>
                <FormControl fullWidth>
                    <InputLabel id="color-select-label">Chọn màu</InputLabel>
                    <Select
                        labelId="color-select-label"
                        id="color-select"
                        value={color}
                        label="Chọn màu"
                        onChange={handleColorChange}
                        renderValue={(value) => (
                            <Box
                                sx={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: value === 'custom' ? customColor : value,
                                    display: 'inline-block',
                                    marginRight: 1,
                                }}
                            />
                        )}
                    >
                        {colors.map((color) => (
                            <MenuItem key={color.value} value={color.value}>
                                <Box
                                    sx={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: color.value !== 'custom' ? color.value : 'transparent',
                                        border: color.value === 'custom' ? '1px dashed gray' : 'none',
                                        display: 'inline-block',
                                        marginRight: 1,
                                    }}
                                />
                                {color.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {isCustom && (
                    <TextField
                        id="custom-color-picker"
                        label="Màu tùy chọn"
                        type="color"
                        variant="outlined"
                        value={customColor}
                        onChange={(e) => {
                            setCustomColor(e.target.value);
                            setColor(e.target.value);
                        }}
                        fullWidth
                        sx={{ mt: 1 }}
                    />
                )}
            </Box>

            {/* Hiển thị danh sách người dùng */}
            <Typography variant="h6">Danh sách người dùng:</Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 450, marginTop: 2 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell> {/* Checkbox header */}
                            <TableCell>Họ</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Tài khoản</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        // Tích checkbox nếu user đã có trong nhóm (tồn tại trong selectedUsers)
                                        checked={selectedUsers.some((selectedUser) => selectedUser.id === user.id)}
                                        onChange={(e) => handleUserSelection(e, user)}
                                    />
                                </TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.userName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack direction="column" spacing={2} marginTop={2}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 3 }}
            >
                Cập nhật
            </Button>
            </Stack>
        </Container>
    );
}
