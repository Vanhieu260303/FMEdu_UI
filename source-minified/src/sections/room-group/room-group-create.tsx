'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { useState, useEffect, useCallback, useRef } from 'react';
import CampusService from 'src/@core/service/campus';
import RoomService from 'src/@core/service/room';
import { Button, Checkbox, Stack, Autocomplete, TextField, Alert } from '@mui/material';
import GroupRoomService from 'src/@core/service/grouproom';
import AlertTitle from '@mui/material/AlertTitle';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
// ----------------------------------------------------------------------

function useDebounce(func: Function, delay: number) {
  const debounceRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: any) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }, [func, delay]);
}

export default function RoomGroupCreate() {
  const settings: any = useSettingsContext();

  // State variables
  const [campus, setCampus] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<any>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<any[]>([]); // Danh sách các phòng được chọn
  const [groupName, setGroupName] = useState<string>(''); // Tên nhóm
  const [description, setDescription] = useState<string>(''); // Mô tả nhóm
  const [searchQuery, setSearchQuery] = useState(''); // Biến tìm kiếm
  const [alert, setAlert] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);
  const [filterRooms,setFilterRooms] = useState<any[]>([]);

  const filterRoom = () => {
    let filteredRooms = rooms;
    if (searchQuery) {
      filteredRooms = filteredRooms.filter((room) => 
        room.roomName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilterRooms(filteredRooms);
  };

  const debouncedFilterRoom = useDebounce(() => {
    filterRoom();
  }, 500);

  useEffect(() => {
    debouncedFilterRoom();
  }, [searchQuery]);
  useEffect(() => {
    setFilterRooms(rooms);
    console.log("Use effect call")
  }, [rooms]);

  // Fetch tất cả campus khi component được render
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


  const handleCampusChange = async (event: any, value: any) => {
    if (value && value.id) {
      setSelectedCampus(value);
      try {
        const response: any = await RoomService.getRoomByCampus(value.id);
        if (response.data && Array.isArray(response.data)) {
          console.log(response.data);
          setRooms(response.data);
         
        } else {
          console.error('Unexpected response format:', response.data);
          setRooms([]);
        }
      } catch (error: any) {
        console.error('Error fetching rooms:', error);
      }
    }
  };

  const handleRoomSelection = (event: any, room: any) => {
    if (event.target.checked) {
      setSelectedRooms((prev) => [...prev, room]); // Thêm phòng vào danh sách
    } else {
      setSelectedRooms((prev) => prev.filter((r: any) => r.id !== room.id)); // Xóa phòng khỏi danh sách
    }
    
  };

  const handleSubmit = async () => {
    try {
      const data = {
        groupName,
        description,
        Rooms: selectedRooms.map((room: any) => ({
          id: room.id,
          roomName: room.roomName,
        })),
      };

      // Gọi API để tạo nhóm phòng
      const response = await GroupRoomService.createGroupRooms(data);

      // Kiểm tra phản hồi từ API
      if (!response.data.success) {
        setAlert({ severity: 'error', message: response.data.message });
      } else {
        setAlert({ severity: 'success', message: response.data.message });
        window.location.reload();
      }
    } catch (error: any) {
      // Kiểm tra xem phản hồi lỗi có chứa dữ liệu thông báo từ API không
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

      {/* Hiển thị thông báo nếu có */}
      {alert && (
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
          <Alert
            severity={alert.severity}
            onClose={() => setAlert(null)} // Đóng thông báo khi nhấn vào icon
          >
            <AlertTitle>{alert.severity === 'error' ? 'Error' : 'Success'}</AlertTitle>
            {alert.message}
          </Alert>
        </Box>
      )}

      {/* Autocomplete để chọn campus */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <Autocomplete
          disablePortal
          options={campus}
          getOptionLabel={(option: any) => option.campusName || ''}
          sx={{ width: 300, marginBottom: 3 }}
          onChange={handleCampusChange}
          renderInput={(params: any) => <TextField {...params} label="Chọn Campus" />}
        />
      </Box>

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
          label="Mô tả nhóm phòng"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>



      {/* Hiển thị danh sách phòng */}
      <Typography variant="h6">Danh sách phòng:</Typography>


      <TextField
        label="Tìm kiếm phòng"
        variant="outlined"
        value={searchQuery}
        onChange={(e)=>{setSearchQuery(e.target.value)}}
        fullWidth
        sx={{ width: 300, marginBottom: 3 }}/>

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
        <ul style={{listStyle:'none',padding:'0',marginLeft:'15px'}}>
          {filterRooms.length > 0 ? filterRooms.map((room: any) => (
            <li key={room.id}>
              <Checkbox
                onChange={(e) => handleRoomSelection(e, room)}
              />
              {room.roomName}
            </li>
          )) : <Typography>Không có phòng nào được tìm thấy.</Typography>}
        </ul>
      </Box>

      <Stack direction="column" spacing={2} marginTop={2}>
        <Button variant="contained" onClick={handleSubmit}>
          Tạo nhóm phòng
        </Button>
      </Stack>
    </Container>
  );
}
