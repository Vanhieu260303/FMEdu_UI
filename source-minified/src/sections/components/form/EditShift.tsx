import { Box, TextField, Autocomplete, Typography, Checkbox, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import RoomCategoryService from 'src/@core/service/RoomCategory';

interface props{
    data:any;
   
}
const EditShift = ({data}:props) => {
    const [selectedShift, setSelectedShift] = useState<any>(data);
    const [areas, setAreas] = useState<any>([]);
    const handleSubmit = async() =>{
        console.log(selectedShift);
    }

    useEffect(() => {
        const fetchAreas = async () => {
          try {
            const response = await RoomCategoryService.getAllRoomCategory();
            setAreas(response.data);
          } catch (error: any) {
            console.error('Lỗi khi tải danh sách khu vực:', error);
          }
        };
        fetchAreas();
      }, []);
    return (
        <Box>
            <TextField
            label="Tên Ca"
            value={selectedShift?.shiftName || ''}
            onChange={(e) => setSelectedShift({ ...selectedShift, shiftName: e.target.value })}
            fullWidth
            margin="dense"
        />
            <Autocomplete
                value={selectedShift?.categoryName || ''}
                onChange={(event, newValue) => setSelectedShift({ ...selectedShift, categoryName: newValue })}
                options={areas.map((area:any) => area.categoryName)}
                renderInput={(params) => <TextField {...params} label="Khu vực" margin="dense" />}
                fullWidth
            />
            <TextField
                label="Thời gian bắt đầu"
                type="time"
                value={selectedShift?.startTime || ''}
                onChange={(e) => setSelectedShift({ ...selectedShift, startTime: e.target.value })}
                fullWidth
                margin="dense"
            />
            <TextField
                label="Thời gian kết thúc"
                type="time"
                value={selectedShift?.endTime || ''}
                onChange={(e) => setSelectedShift({ ...selectedShift, endTime: e.target.value })}
                fullWidth
                margin="dense"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography>Trạng thái: </Typography>
                <Checkbox
                    checked={selectedShift?.status === 'ENABLE'}
                    onChange={(e) =>
                        setSelectedShift({ ...selectedShift, status: e.target.checked ? 'ENABLE' : 'DISABLE' })
                    }
                    sx={{ ml: 1 }}
                />
                {selectedShift?.status === 'ENABLE' ? '✔️' : '❌'}
            </Box>
            <Box >
               <Button onClick={handleSubmit}>
                 Lưu
               </Button>
            </Box>
        </Box>
    )
}

export default EditShift