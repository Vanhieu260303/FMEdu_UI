
import { Container, Box, Typography, Alert, AlertTitle, Autocomplete, TextField, InputAdornment, Checkbox, Stack, Button, CircularProgress } from '@mui/material';
import { id } from 'date-fns/locale';
import React, { useEffect, useState } from 'react'
import CampusService from 'src/@core/service/campus';
import GroupRoomService from 'src/@core/service/grouproom';
import { useSettingsContext } from 'src/components/settings';
import SnackbarComponent from '../snackBar';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import  RoomService  from 'src/@core/service/room';


interface props {
    setOpenPopup: (open: boolean) => void;
    onSuccess: (message: string) => void;
    data: any;
    id: string;
}
const EditRoomGroup = ({ setOpenPopup, onSuccess, data, id }: props) => {
    const settings: any = useSettingsContext();
    const [campus, setCampus] = useState<any[]>([]);
    const [selectedCampus, setSelectedCampus] = useState<any>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedRooms, setSelectedRooms] = useState<any[]>([]);
    const [groupName, setGroupName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarStatus, setSnackbarStatus] = useState('success');


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
        fetchRoomGroup();
    }, []);
    const fetchRoomGroup = async () => {
        try {
            const response = await RoomService.getRoomByCampus(data.rooms[0].campusId);
            setRooms(response.data);
            setGroupName(data.groupName);
            setDescription(data.description);
            setSelectedRooms(data.rooms);
            setSelectedCampus(data.rooms[0].campusId);
            setLoading(false);
        } catch (error: any) {
            console.error('Error fetching room group:', error);
            setLoading(false);
        }
    };
    const handleSubmit = async () => {
        if (groupName === '' || selectedRooms.length === 0) {
            setSnackbarOpen(true);
            setSnackbarStatus('error');
            setSnackbarMessage('Vui lòng điền đầy đủ thông tin');
            setTimeout(() => {setSnackbarOpen(false)}, 3000);
            return;
        }
        else{
            try {
                const editData = {
                    groupName,
                    description,
                    CampusId: selectedCampus,
                    Rooms: selectedRooms.map((room: any) => ({
                        id: room.id,
                        roomName: room.roomName,
                    })),
                };
                const response = await GroupRoomService.updateRoomGroup(id, editData);
                if(response.status === 200){
                    onSuccess('Sửa nhóm phòng thành công');
                    setOpenPopup(false);
                }
            } catch (error: any) {
                setSnackbarOpen(true);
                setSnackbarStatus('error');
                setSnackbarMessage('Đã xảy ra lỗi, vui lòng thử lại');
                setTimeout(() => {setSnackbarOpen(false)}, 3000);
            }
        }
    
       
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: '10px' }}>
            <Box>
                <TextField
                    fullWidth
                    id="group-name"
                    label="Nhập tên nhóm"
                    variant="outlined"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
            </Box>
            <Box>
                <TextField
                    fullWidth
                    id="group-description"
                    label="Nhập mô tả nhóm phòng"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Box>
            <Box>
                <Autocomplete
                    disablePortal
                    fullWidth
                    options={[data.rooms[0].campusName]}
                    getOptionLabel={(option) => option}
                    value={data.rooms[0].campusName}
                    renderInput={(params: any) => <TextField {...params} label="Chọn cơ sở" />}
                    disabled
                />
            </Box>
            <Box>
                <Autocomplete
                    multiple
                    fullWidth

                    options={rooms}
                    disableCloseOnSelect
                    getOptionLabel={(option: any) => option.roomName || ''}
                    value={selectedRooms}
                    onChange={(event, newValue) => {
                        setSelectedRooms(newValue);
                        setRooms(prevRooms => {
                            const selectedIds = new Set(newValue.map(room => room.id));
                            return [...newValue, ...prevRooms.filter(room => !selectedIds.has(room.id))];
                        });
                    }}
                    renderOption={(props, option, { selected }) => (
                        <li {...props} key={option.id}>
                            <Checkbox
                                key={`checkbox-${option.id}`}
                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                style={{ marginRight: 8 }}
                                checked={selected || selectedRooms.some(room => room.id === option.id)}
                            />
                            {option.roomName}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chọn phòng"
                            variant="outlined"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    noOptionsText="Không có dữ liệu phòng"
                    loading={loading}
                    loadingText="Đang tìm kiếm..."
                />
            </Box>

            <Button onClick={handleSubmit} variant='contained'>Sửa</Button>
            <SnackbarComponent
                status={snackbarStatus as 'success' | 'error' | 'info' | 'warning'}
                open={snackbarOpen}
                message={snackbarMessage}
            />
        </Container>
    );
}

export default EditRoomGroup