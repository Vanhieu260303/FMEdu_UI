'use client';

import Box from '@mui/material/Box';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { useState, useEffect } from 'react';

import RoomService from 'src/@core/service/room';
import { Button, Checkbox, Stack, Autocomplete, TextField, Alert } from '@mui/material';

import AlertTitle from '@mui/material/AlertTitle';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ShiftService from 'src/@core/service/shift';


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import RoomCategoryService from 'src/@core/service/RoomCategory';

// ----------------------------------------------------------------------

export default function ShiftCreate() {
    const settings: any = useSettingsContext();

    // State variables


   
    const [selectedCategory, setSelectedRooms] = useState<any[]>([]);
    const [shiftName, setShiftName] = useState<string>('');
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

    const [categories, setCategories] = useState<any[]>([]);
    const [filterCategories,setFilterCategories] = useState<any[]>([]);



    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response: any = await RoomCategoryService.getAllRoomCategory();
                setCategories(response.data);
            } catch (error: any) {
                console.error('Error fetching Categories data:', error);
            }
        };
        fetchCategories();
    }, []);

    const filterRoomCategories = ()=>{
        let filterRoomCategories = categories;
        console.log("filterRoomCategories",filterRoomCategories);
        if (searchQuery) {
            filterRoomCategories = categories.filter(c=> c.categoryName.toLowerCase().includes(searchQuery.toLocaleLowerCase()));
        }
        else {
            filterRoomCategories = categories;
        }
        setFilterCategories(filterRoomCategories)
    }

    useEffect (()=>{setFilterCategories(categories)},[categories]);
    useEffect(()=>{filterRoomCategories()},[searchQuery]);


    const handleRoomSelection = (event: any, room: any) => {
        if (event.target.checked) {
            setSelectedRooms((prev) => [...prev, room]);
        } else {
            setSelectedRooms((prev) => prev.filter((r: any) => r.id !== room.id));
        }
    };

    const handleSubmit = async () => {
        if (shiftName === '') {
            setAlert({ severity: 'error', message: 'Vui lòng nhập tên ca làm việc.' });
            return;
        }
        try {
            const data = {
                shiftName,
                startTime: startTime ? startTime.format('HH:mm') : '',
                endTime: endTime ? endTime.format('HH:mm') : '',
                category: selectedCategory.map((category) => category.id),
            };


            const response = await ShiftService.createShifts(data);

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
                <Typography variant="h4">Tạo ca làm việc</Typography>
            </Box>


            {alert && (
                <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                    <Alert
                        severity={alert.severity}
                        onClose={() => setAlert(null)}
                    >
                        <AlertTitle>{alert.severity === 'error' ? 'Error' : 'Success'}</AlertTitle>
                        {alert.message}
                    </Alert>
                </Box>
            )}


            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
                    <TextField
                        id="group-name"
                        label="Tên Ca"
                        variant="outlined"
                        value={shiftName}
                        onChange={(e) => setShiftName(e.target.value)}
                    />
                </Box>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: 'flex', gap: 2, margin: '20px 0' }}>
                        <TimePicker
                            ampm={false}
                            label="Thời gian bắt đầu"
                            value={startTime}
                            onChange={(newValue) => setStartTime(newValue)}
                        />

                        <TimePicker
                            ampm={false}
                            label="Thời gian kết thúc"
                            value={endTime}
                            onChange={(newValue) => setEndTime(newValue)}
                        />
                    </Box>

                </LocalizationProvider>
            </Box>




            {/* Hiển thị danh sách phòng */}



            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', marginTop: '10px' }}>
                <Typography variant="h6">Danh sách khu vực phòng:</Typography>
                <TextField
                    label="Tìm kiếm khu vực phòng"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e)=>setSearchQuery(e.target.value)}
                    fullWidth
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Box
                sx={{

                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    marginTop: 2,
                    maxHeight: 450,
                    overflowY: 'auto'
                }}
            >
                <ul style={{ listStyle: 'none', padding: 0, marginLeft: '5px' }}>
                    {filterCategories.length > 0 ? filterCategories.map((category: any) => (
                        <li key={category.id}>
                            <Checkbox
                                onChange={(e) => handleRoomSelection(e, category)}
                            />
                            {category.categoryName}
                        </li>
                    )) : <Typography>Không có khu vực phòng nào được tìm thấy.</Typography>}
                </ul>
            </Box>

            <Stack direction="column" spacing={2} marginTop={2}>
                <Button variant="contained" onClick={handleSubmit}>
                    Tạo ca làm việc
                </Button>
            </Stack>
        </Container>
    );
}
