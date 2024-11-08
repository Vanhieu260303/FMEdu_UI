"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, Box, Button, Collapse, Container, FormControl, IconButton, InputLabel, Link, Menu, MenuItem, Pagination, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, alpha } from '@mui/material';
import Dayjs from 'dayjs';
import Popup from '../components/form/Popup';
import AddForm from '../components/form/AddForm';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditForm from '../components/form/EditForm';
import BlockService from 'src/@core/service/block';
import axios from 'axios';
import FloorService from 'src/@core/service/floor';
import RoomService from 'src/@core/service/room';
import CampusService from 'src/@core/service/campus';
import CleaningFormService from 'src/@core/service/form';
import SnackbarComponent from '../components/snackBar';
import { KeyboardArrowDown } from '@mui/icons-material';
import { KeyboardArrowUp } from '@mui/icons-material';
import CollapsibleForm from '../components/table/form/CollapsibleForm';
import { useSettingsContext } from 'src/components/settings';
interface Campus {
  id: string;
  campusCode: string;
  campusName: string;
  campusName2: string;
  campusSymbol: string;
  sortOrder: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
interface Blocks {
  id: string,
  blockCode: string,
  blockName: string,
  blockName2: string,
  blockNo: string,
  dvtcode: string,
  dvtname: string,
  assetTypeCode: string,
  assetTypeName: string,
  sortOrder: number,
  useDepartmentCode: string,
  useDepartmentName: string,
  manageDepartmentCode: string,
  manageDepartmentName: string,
  floorArea: number,
  contructionArea: number,
  functionCode: string,
  functionName: string,
  valueSettlement: number,
  originalPrice: number,
  centralFunding: number,
  localFunding: number,
  otherFunding: number,
  statusCode: string,
  statusName: string,
  campusCode: string,
  campusName: string,
  campusId: string,
  createdAt: string,
  updatedAt: string
}


type Floor = {
  id: string,
  floorCode: string,
  floorName: string,
  description: string,
  floorOrder: number,
  basementOrder: number,
  sortOrder: number,
  notes: string,
  createdAt: string,
  updatedAt: string
};

type Room = {
  id: string,
  roomCode: string,
  roomName: string,
  description: string,
  roomNo: string,
  dvtcode: string,
  dvtname: string,
  assetTypeCode: string,
  assetTypeName: string,
  useDepartmentCode: string,
  useDepartmentName: string,
  manageDepartmentCode: string,
  manageDepartmentName: string,
  numberOfSeats: number,
  floorArea: number,
  contructionArea: number,
  valueSettlement: number,
  originalPrice: number,
  centralFunding: number,
  localFunding: number,
  otherFunding: number,
  statusCode: string,
  statusName: string,
  sortOrder: number,
  blockId: string,
  roomCategoryId: string,
  floorId: string,
  createdAt: string,
  updatedAt: string,
  roomCategory: null | any,
  lessons: any[]
};
type Tag = {
  Id: string;
  name: string;
};

type Form = {
  id?: string,
  formName: string,
  campusName?: string,
  blockName?: string,
  floorName?: string,
  roomName?: string
};



export default function FourView() {
  const [formList, setFormList] = useState<Form[]>()
  const [campus, setCampus] = useState<Campus[]>([]);
  const [blocks, setBlocks] = useState<Blocks[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFormID, setCurrentFormID] = useState<string>('0');
  const [filterFormList, setFilterFormList] = useState<Form[]>();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mockForm, setMockForm] = useState<Form[]>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openRow, setOpenRow] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarStatus, setSnackbarStatus] = useState('success');

  const settings = useSettingsContext();  



  const handleAddFormSuccess = async (message: string) => {
    setSnackbarMessage(message);
    setSnackbarStatus('success');
    setSnackbarOpen(true);
    await fetchData(page);
  };

  const handleEditFormSuccess = async (message: string) => {
    setSnackbarMessage(message);
    setSnackbarStatus('success');
    setSnackbarOpen(true);
    await fetchData(page);
  }

  const handleSnackbarClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  }, [snackbarStatus]);

  const filterForm = () => {
    let filteredForm = mockForm;
    if (selectedCampus !== null) {
      filteredForm = filteredForm?.filter(report => report?.campusName === campus.find(campus => campus.id === selectedCampus)?.campusName);
    }
    if (selectedBlocks !== null) {
      filteredForm = filteredForm?.filter(report => report?.blockName === blocks.find(block => block.id === selectedBlocks)?.blockName);
    }
    if (selectedFloor !== null) {
      filteredForm = filteredForm?.filter(report => report?.floorName === floors.find(floor => floor.id === selectedFloor)?.floorName);
    }
    if (selectedRoom !== null) {
      filteredForm = filteredForm?.filter(report => report?.roomName === rooms.find(room => room.id === selectedRoom)?.roomName);
    }

    if (filteredForm && filteredForm.length > 0) {
      var totalPagesAfterFilter = Math.ceil(filteredForm.length / 10);
      const startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;
      setTotalPages(totalPagesAfterFilter);
      if (totalPages !== totalPagesAfterFilter) {
        setPage(1)
      }
      else {
        setPage(page);
      }
      setFilterFormList(filteredForm.slice(startIndex, endIndex));
    } else {
      setFilterFormList([]);
      setTotalPages(1);
      setPage(1);
    }
    setFilterFormList(newReports => {
      console.log('Updated Reports:', newReports);
      return newReports;
    });
  };


useEffect(() =>{
  filterForm();

},[selectedCampus,selectedBlocks,selectedFloor,selectedRoom] )


  const fetchData = async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response1 = await CampusService.getAllCampus();
      const response2 = await CleaningFormService.getAllCleaningForm(pageNumber);
      const response3 = await CleaningFormService.getAllCleaningForm(1, 500);
      setCampus(response1.data);
      setFormList(response2.data.result);
      setMockForm(response3.data.result);
      var totalPages = Math.ceil(response2.data.totalValue / 10);
      setTotalPages(totalPages);
    } catch (error) {
      setError(error.message);
      console.error('Chi tiết lỗi:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddClick = () => {
    setIsEditing(false);
    setOpenPopUp(true);
  }
  const handleRowClick = (rowId: any) => {
    setOpenRow(openRow === rowId ? null : rowId);
  };


  useEffect(() => {
    setFilterFormList(formList);
  }, [formList]);

  const handleCampusSelect = async (CampusId: string) => {
    var campusId = CampusId;
    try {
      const response = await BlockService.getBlockByCampusId(campusId);
      setBlocks(response.data);
      setFloors([]);
      setRooms([]);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };
  const handleBlockSelect = async (blockId: string) => {
    var blockId = blockId;

    try {
      const response = await FloorService.getFloorByBlockId(blockId);
      if (response.data.length > 0) {
        setFloors(response.data);
        console.log(response.data);
        setRooms([]);
      }
      else {
        setFloors([]);
        setRooms([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };

  const handleFloorSelect = async (floorId: string) => {
    var floorId = floorId;

    try {
      const response = await RoomService.getRoomsByFloorIdAndBlockId(floorId, selectedBlocks ? selectedBlocks : '');
      if (response.data.length > 0) {
        setRooms(response.data);
      }
      else {
        setRooms([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    if (filterFormList !== undefined) {
      filterForm();
    }
    else {
      fetchData(page);
      console.log("totalPages", totalPages);
    }

  }, [page]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Danh sách các Form đánh giá</Typography>
        <Button variant='contained' onClick={handleAddClick}>Tạo mới</Button>
        <Popup title={isEditing ? 'Chỉnh sửa Form' : 'Tạo mới Form'} openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
          {isEditing ? (
            <EditForm formId={currentFormID} setOpenPopup={setOpenPopUp} onSuccess={handleEditFormSuccess} />
          ) : (
            <AddForm setOpenPopup={setOpenPopUp} onSuccess={handleAddFormSuccess} />
          )
          }
        </Popup>
      </Box>
      <Box
        sx={{
          mt: 5,
          width: 1,
          minHeight: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            marginBottom: 2,
          }}>
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={campus}
              getOptionLabel={(option: any) => option.campusName || ''}
              value={campus.find((c: any) => c.id === selectedCampus) || null}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSelectedCampus(newValue ? newValue.id : null);
                  handleCampusSelect(newValue ? newValue.id : '');
                }
                else {
                  setSelectedCampus(null);
                  setBlocks([]);
                  setSelectedBlocks(null);
                  setFloors([]);
                  setSelectedFloor(null);
                  setRooms([]);
                  setSelectedRoom(null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn cơ sở"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu cơ sở"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={blocks}
              getOptionLabel={(option: any) => option.blockName || ''}
              value={blocks.find((b: any) => b.id === selectedBlocks) || null}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSelectedBlocks(newValue ? newValue.id : null);
                  handleBlockSelect(newValue ? newValue.id : '');
                }
                else {
                  setSelectedBlocks(null);
                  setFloors([]);
                  setSelectedFloor(null);
                  setRooms([]);
                  setSelectedRoom(null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn tòa nhà"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu tòa nhà"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={floors}
              getOptionLabel={(option: Floor) => option.floorName || ''}
              value={floors.find(floor => floor.id === selectedFloor) || null}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSelectedFloor(newValue ? newValue.id : null);
                  handleFloorSelect(newValue ? newValue.id : '');
                }
                else {
                  setSelectedFloor(null);
                  setRooms([]);
                  setSelectedRoom(null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn tầng"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu tầng"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={rooms}
              getOptionLabel={(option: any) => option.roomName || ''}
              value={rooms.find(room => room.id === selectedRoom) || null}
              onChange={(event, newValue) => {
                setSelectedRoom(newValue ? newValue.id : null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn phòng"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu phòng"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead sx={{ width: 1 }}>
                <TableRow>
                  <TableCell align='center' sx={{ width: '5px' }}>STT</TableCell>
                  <TableCell align='center'>Cơ sở</TableCell>
                  <TableCell align='center'>Tòa nhà</TableCell>
                  <TableCell align="center">Tầng</TableCell>
                  <TableCell align="center">Khu vực</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterFormList?.map((form: any, index) => (
                  <React.Fragment>
                    <TableRow key={form.id} sx={{ marginTop: '5px' }}>
                      <TableCell align='center' sx={{ width: '5px' }}>{index + 1 + ((page - 1) * 10)}</TableCell>
                      <TableCell align='center'>
                        {form.campusName}
                      </TableCell>
                      <TableCell align='center'>
                        {form.blockName}
                      </TableCell>
                      <TableCell align='center'>
                        {form.floorName}
                      </TableCell>
                      <TableCell align='center'>
                        {form.roomName}
                      </TableCell>
                      <TableCell align='right'>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleRowClick(form.id)}
                        >
                          {openRow === form.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={openRow === form.id} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <CollapsibleForm id={form.id}></CollapsibleForm>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>

                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

      </Box>
      <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', margin: '10px', float: 'right' }}>
        <Pagination count={totalPages} color="primary" page={page} onChange={handlePageChange} />
      </Stack>
      <SnackbarComponent
        status={snackbarStatus as 'success' | 'error' | 'info' | 'warning'}
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Container>
  );
}
