'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import {
  Paper, Table, TableCell, TableContainer, TableRow, TableHead, TableBody,
  IconButton, Menu, MenuItem, Link, Pagination, TableFooter, Select, MenuItem as MuiMenuItem, TextField,
  Autocomplete, Dialog, DialogActions,
  DialogContent, DialogTitle, Button, Checkbox,
  Snackbar,
  Alert
} from '@mui/material';
import { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShiftService from 'src/@core/service/shift';
import RoomCategoryService from 'src/@core/service/RoomCategory';
import Popup from '../components/form/Popup';
import EditShift from '../components/form/EditShift';
import AddShift from '../components/form/AddShift';
import SnackbarComponent from '../components/snackBar';


export default function ShiftListView() {
  const settings = useSettingsContext();
  const [shifts, setShifts] = useState<any>([]);
  const [filteredShifts, setFilteredShifts] = useState<any>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>('');
  const [areas, setAreas] = useState<any[]>([]);
  const [openPopUp,setOpenPopUp] = useState<boolean>(false);
  const [searchShiftName, setSearchShiftName] = useState<string>('');
  const [debounceTimeout, setDebounceTimeout] = useState<any>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');



  const handleAddClick = async () => {
    setOpenPopUp(true);
  }
  const handleAddSuccess = async (message:string)=>{
    setSnackbarMessage(message);
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    setTimeout(()=>{setOpenSnackbar(false)},3000);
  }

  const fetchAreas = async () => {
    try {
      const response = await RoomCategoryService.getAllRoomCategory();
      setAreas(response.data);
    } catch (error: any) {
      console.error('Lỗi khi tải danh sách khu vực:', error);
    }
  };
  useEffect(() => {
    
    fetchAreas();
  }, []);


  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await ShiftService.getAllShifts(pageNumber, pageSize, searchShiftName, selectedArea);
        setShifts(response.data.shifts);
        setTotalPages(Math.ceil(response.data.totalRecords / pageSize));
      } catch (error: any) {
        console.error('Lỗi khi tải dữ liệu ca làm:', error);
      } finally {
        setLoading(false);
      }
    }, 500);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchShiftName, selectedArea, pageNumber]);

  useEffect(() => {
    const filtered = shifts.filter((shift: any) =>
      shift.shiftName.toLowerCase().includes(searchShiftName.toLowerCase())
    );
    setFilteredShifts(filtered);
  }, [shifts, searchShiftName]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPageNumber(newPage);
  };

  const handleOpenEditDialog = (shift: any) => {
    setSelectedShift(shift);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedShift(null);
  };

  const handleSaveEdit = async () => {
    const data = {
      id: selectedShift.id,
      shiftName: selectedShift.shiftName,
      category: [selectedShift.roomCategoryId],
      startTime: selectedShift.startTime,
      endTime: selectedShift.endTime,
      status: selectedShift.status,

    }
    console.log(data)
    if (selectedShift) {
      try {
        // Gọi API chỉnh sửa ca làm việc
        const response = await ShiftService.editShifts(selectedShift.id, {
          shiftName: selectedShift.shiftName,
          category: [selectedShift.roomCategoryId],
          startTime: selectedShift.startTime,
          endTime: selectedShift.endTime,
          status: selectedShift.status,
        });

        setSnackbarMessage(response.data.message || 'Sửa ca làm việc thành công!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        const updatedShifts = await ShiftService.getAllShifts();
        setShifts(updatedShifts.data.shifts);

      } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.message : 'Có lỗi xảy ra khi sửa ca làm việc.';
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        handleCloseEditDialog();
      }
    }
  };



  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4">Danh sách ca làm việc</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between',alignItems:'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Autocomplete
            value={selectedArea}
            onChange={(event, newValue) => {
              setSelectedArea(newValue);
            }}
            options={areas
              .filter((area) => area.categoryName.trim() !== '')
              .map((area) => area.categoryName.trim() || 'Khu vực không tên')}
            renderInput={(params) => (
              <TextField {...params} label="Chọn khu vực" variant="outlined" />
            )}
            sx={{ minWidth: 200 }}
          />

          <TextField
            variant="outlined"
            placeholder="Tìm kiếm theo tên ca"
            value={searchShiftName}
            onChange={(e) => setSearchShiftName(e.target.value)}
            sx={{ minWidth: 300 }}
          />
        </Box>
        <Button variant="contained" onClick={handleAddClick}>Tạo mới</Button>
        <Popup title="Tạo mới nhóm phòng" openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
          <AddShift setOpenPopUp={setOpenPopUp} onSuccess={handleAddSuccess} />
        </Popup>
      </Box>


      {loading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : filteredShifts.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Tên Ca</TableCell>
                <TableCell align="center">Thời gian bắt đầu</TableCell>
                <TableCell align="center">Thời gian kết thúc</TableCell>
                <TableCell align="center">Khu vực</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredShifts.map((shift: any, index: any) => (
                <TableRow key={shift.id}>
                  <TableCell align="center">{(pageNumber - 1) * pageSize + index + 1}</TableCell>
                  <TableCell align="center">{shift.shiftName}</TableCell>
                  <TableCell align="center">{shift.startTime}</TableCell>
                  <TableCell align="center">{shift.endTime}</TableCell>
                  <TableCell align="center">{shift.categoryName}</TableCell>
                  <TableCell align="center">{shift.status === 'ENABLE' ? '✔️' : '❌'}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpenEditDialog(shift)}>
                      <EditIcon />
                    </IconButton>       
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                      count={totalPages}
                      page={pageNumber}
                      onChange={handlePageChange}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Không có dữ liệu nào.</Typography>
      )}


      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Chỉnh sửa ca làm việc</DialogTitle>
        <DialogContent>
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
            options={areas.map((area) => area.categoryName)}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="error">
            Hủy
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarComponent
        status={snackbarSeverity as 'success' | 'error' | 'info' | 'warning'}
        open={openSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
}