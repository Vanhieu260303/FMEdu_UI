'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { useState, useEffect } from 'react';
import CampusService from 'src/@core/service/campus';
import RoomService from 'src/@core/service/room';
import { Button, Checkbox, Stack, Autocomplete, TextField, Alert } from '@mui/material';
import GroupRoomService from 'src/@core/service/grouproom';
import AlertTitle from '@mui/material/AlertTitle';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';


// ----------------------------------------------------------------------

export default function RoomGroupEdit({ id }: { id: string }) {
    const settings: any = useSettingsContext();

    // State variables
    const [campus, setCampus] = useState<any[]>([]);
    const [selectedCampus, setSelectedCampus] = useState<any>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedRooms, setSelectedRooms] = useState<any[]>([]);
    const [groupName, setGroupName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const fetchCampus = async () => {
            try {
                const response: any = await CampusService.getAllCampus();
                setCampus(response.data);
            } catch (error: any) {
                console.error('Error fetching campus data:', error);
            }
        };
        fetchCampus();
    }, []);


    useEffect(() => {
        const fetchRoomGroup = async () => {
            if (id) {
                try {
                    const response: any = await GroupRoomService.getRoomGroupById(id);
                    const groupData = response.data;
                    setGroupName(groupData.groupName);
                    setDescription(groupData.description);
                    setSelectedRooms(groupData.rooms || []);
                    console.log(groupData.rooms)

                    const roomResponse: any = await RoomService.getRoomByCampus(groupData.rooms[0].campusId);
                    setRooms(roomResponse.data || []);
                    setLoading(false);


                    const campusResponse: any = await CampusService.getCampusById(groupData.rooms[0].campusId);
                    setSelectedCampus(campusResponse.data);
                    setLoading(false);

                } catch (error: any) {
                    console.error('Error fetching room group:', error);
                    setLoading(false);
                }
            } else {
                console.error('ID is null or not found in URL');
                setLoading(false);
            }
        };
        fetchRoomGroup();
    }, [id]);

    const handleCampusChange = async (event: any, value: any) => {
        if (value && value.id) {
            setSelectedCampus(value);
            try {
                const response: any = await RoomService.getRoomByCampus(value.id);
                setRooms(response.data || []);
            } catch (error: any) {
                console.error('Error fetching rooms:', error);
            }
        }
    };


    const handleSearch = async (event: any) => {
        const input = event.target.value;
        setSearchQuery(input);

        if (input.trim() === '') {
            if (selectedCampus && selectedCampus.id) {
                try {
                    const response: any = await RoomService.getRoomByCampus(selectedCampus.id);
                    setRooms(response.data || []);
                } catch (error: any) {
                    console.error('Error fetching rooms:', error);
                }
            } else {
                setRooms([]);
            }
        } else {
            try {
                const response: any = await RoomService.searchRooms(input);
                setRooms(response.data || []);
            } catch (error: any) {
                console.error('Error searching rooms:', error);
            }
        }
    };


    const handleRoomSelection = (event: any, room: any) => {
        if (event.target.checked) {
            setSelectedRooms((prev) => [...prev, room]);
        } else {
            setSelectedRooms((prev) => prev.filter((r: any) => r.id !== room.id));
        }
    };

    // Xử lý khi gửi dữ liệu
    const handleSubmit = async () => {
        try {
            const data = {
                groupName,
                description,
                CampusId: selectedCampus.id,
                Rooms: selectedRooms.map((room: any) => ({
                    id: room.id,
                    roomName: room.roomName,
                })),
            };

            const response = await GroupRoomService.updateRoomGroup(id, data);

            if (!response.data.success) {
                setAlert({ severity: 'error', message: response.data.message });
            } else {
                setAlert({ severity: 'success', message: response.data.message });
                window.location.reload();
            }
        } catch (error: any) {
            if (error.response?.data?.message) {
                setAlert({ severity: 'error', message: error.response.data.message });
            } else {
                setAlert({ severity: 'error', message: 'Đã xảy ra lỗi khi gửi dữ liệu. Vui lòng thử lại sau.' });
            }
        }
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4">Tạo nhóm phòng</Typography>
            </Box>


            {alert && (
                <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                    <Alert severity={alert.severity} onClose={() => setAlert(null)}>
                        <AlertTitle>{alert.severity === 'error' ? 'Lỗi' : 'Thành công'}</AlertTitle>
                        {alert.message}
                    </Alert>
                </Box>
            )}


            <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                <Autocomplete
                    disablePortal
                    options={campus}
                    value={selectedCampus}
                    getOptionLabel={(option: any) => option.campusName || ''}
                    sx={{ width: 300, marginBottom: 3 }}
                    onChange={handleCampusChange}
                    renderInput={(params: any) => <TextField {...params} label="Chọn Campus" />}
                />
            </Box>


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
                    label="Mô tả nhóm"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Box>


            <Typography variant="h6">Danh sách phòng:</Typography>

            <TextField
                label="Tìm kiếm phòng"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearch}
                fullWidth
                sx={{ width: 300, marginBottom: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <Box
                sx={{
                    padding: 2,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    marginTop: 2,
                    maxHeight: 450,
                    overflowY: 'auto',
                }}
            >
                <ul>
                    {rooms.length > 0 ? (
                        rooms.map((room: any) => (
                            <li key={room.id}>
                                <Checkbox
                                    checked={selectedRooms.some((selectedRoom) => selectedRoom.id === room.id)}
                                    onChange={(e) => handleRoomSelection(e, room)}
                                />
                                {room.roomName}
                            </li>
                        ))
                    ) : (
                        <Typography>Không có phòng nào được tìm thấy.</Typography>
                    )}
                </ul>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ marginTop: 3 }}>
                <Button
                    variant="contained"
                    color="primary" onClick={handleSubmit}>
                    Cập nhật nhóm phòng
                </Button>
            </Stack>
        </Container>
    );
}
