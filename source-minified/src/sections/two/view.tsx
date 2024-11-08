'use client';

import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState } from 'react';
import {
  Container, Typography, Box, TextField, Paper, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, MenuItem, FormControl, InputLabel, Select,
  Autocomplete,
  Button,
  Collapse,
  Pagination,
  Stack,
  useTheme
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from '@mui/material/Link';
import moment from 'moment';
import RenderProgressBar from '../components/renderProgressBar';
import CampusService from 'src/@core/service/campus';
import BlockService from 'src/@core/service/block';
import FloorService from 'src/@core/service/floor';
import CleaningReportService from 'src/@core/service/cleaningReport';
import FilterListIcon from '@mui/icons-material/FilterList';
import RoomService from 'src/@core/service/room';

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
interface Shift {
  id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
}


// ----------------------------------------------------------------------

export default function TwoView() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentReportID, setCurrentReportID] = useState<any>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>, report: any) => {
    setAnchorEl(event.currentTarget);
    setCurrentReportID(report.id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const settings = useSettingsContext();
  const theme = useTheme();

  const [campus, setCampus] = useState<Campus[]>([]);
  const [blocks, setBlocks] = useState<Blocks[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [showProgressFilter, setShowProgressFilter] = useState(false);
  const [filterReportsList, setfilterReportsList] = useState<any[]>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [reports, setReports] = useState<any[]>();
  const [mockReports, setMockReports] = useState<any[]>();
  const filterReports = () => {
    let filteredReports = mockReports;
    if (selectedCampus !== null) {
      filteredReports = filteredReports?.filter(report => report.campusName === campus.find(campus => campus.id === selectedCampus)?.campusName);
    }
    if (selectedBlock !== null) {
      filteredReports = filteredReports?.filter(report => report.blockName === blocks.find(block => block.id === selectedBlock)?.blockName);
    }
    if (selectedFloor !== null) {
      filteredReports = filteredReports?.filter(report => report.floorName === floors.find(floor => floor.id === selectedFloor)?.floorName);
    }
    if (selectedRoom !== null) {
      filteredReports = filteredReports?.filter(report => report.roomName === rooms.find(room => room.id === selectedRoom)?.roomName);
    }

    if (start !== null && end !== null) {
      filteredReports = filteredReports?.filter(report =>
        report.value >= start && report.value <= end
      );
    }
    if (selectedDate !== null && selectedDate.isValid()) {
      const startOfDay = selectedDate.startOf('day');
      const endOfDay = selectedDate.endOf('day');

      console.log('Ngày được chọn:', startOfDay.format('DD/MM/YYYY HH:mm:ss'), 'đến', endOfDay.format('DD/MM/YYYY HH:mm:ss'));

      filteredReports = filteredReports?.filter(report => {
        const reportDate = dayjs(report.createAt);
        return reportDate.isAfter(startOfDay) && reportDate.isBefore(endOfDay);
      });
    }

    if (filteredReports && filteredReports?.length > 0) {
      var totalPagesAfterFilter = Math.ceil(filteredReports.length / 10);
      const startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;
      setTotalPages(totalPagesAfterFilter);
      if(totalPages !== totalPagesAfterFilter){
        setPage(1)
      }
      else{
        setPage(page);
      }  
      setfilterReportsList(filteredReports.slice(startIndex, endIndex));
    } else {
      setTotalPages(1);
      setPage(1);
      setfilterReportsList([]);
    }

    setfilterReportsList(newReports => {
      return newReports;
    });
  };


  const fetchData = async (pageNumber: number) => {
    try {
      const response1 = await CampusService.getAllCampus();
      const response2 = await CleaningReportService.getAllCleaningReportInfo(pageNumber);
      const response3 = await CleaningReportService.getAllCleaningReportInfo(1, 9999999);
      setCampus(response1.data);
      setReports(response2.data.reports);
      setMockReports(response3.data.reports);
      var totalPages = Math.ceil(response2.data.totalValue / 10);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Chi tiết lỗi:', error);
    } 
  }

  useEffect(() => {
    setfilterReportsList(reports);
  }, [reports]);

  useEffect(() => {
    filterReports();
  }, [selectedCampus, selectedBlock, selectedFloor, selectedRoom, selectedDate]);

  useEffect(() => {
    if (selectedCampus !== null) {
      setSelectedBlock(null);
      setSelectedFloor(null);
      setSelectedRoom(null);
    }
  }, [selectedCampus]);
  const handleCampusSelect = async (CampusId: string) => {
    try {
      setSelectedCampus(CampusId);
      const response = await BlockService.getBlockByCampusId(CampusId);
      setBlocks(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tòa nhà:', error);
    }
  };

  const handleBlockSelect = async (blockId: string) => {
    var blockId = blockId;

    try {
      const response = await FloorService.getFloorByBlockId(blockId);
      if (response.data.length > 0) {
        setFloors(response.data);
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
  const toggleProgressFilter = () => {
    setShowProgressFilter(!showProgressFilter);
  };
  const handleFilterProgress = () => {
    if (start !== null && end !== null) {
      filterReports();
    }
    else {
      filterReports();
    }
  };
  const handleFloorSelect = async (floorId: string) => {
    setSelectedFloor(floorId);
    try {
      const response = await RoomService.getRoomsByFloorIdAndBlockId(floorId,selectedBlock?selectedBlock:'');
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

  const handleProgressChange = (setValue: React.Dispatch<React.SetStateAction<number | null>>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setValue(value === '' ? null : Number(value));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    if (filterReportsList !== undefined) {
      filterReports();
    }
    else {
      fetchData(page);
    }
  }, [page]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4">Danh sách báo cáo vệ sinh hằng ngày</Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginBottom: 2,
        marginTop: 2,
        gap: 2
      }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
            <DatePicker
              label="Chọn thời gian"
              value={selectedDate}
              onChange={(newDate: Dayjs | null) => {
                console.log('Ngày được chọn:', newDate?.format('DD/MM/YYYY'));
                setSelectedDate(newDate);
              }}
              onAccept={(newDate: Dayjs | null) => {
                if (newDate && moment(newDate.format('DD/MM/YYYY'), 'DD/MM/YYYY', true).isValid()) {
                  setSelectedDate(newDate);
                }
              }}
              format="DD/MM/YYYY"
              sx={{
                '& .MuiInputLabel-root': { // Màu của label
                  color: theme.palette.text.primary,
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { // Màu của border
                    borderColor: theme.palette.divider,
                  },
                  '&:hover fieldset': { // Màu của border khi hover
                    borderColor: theme.palette.text.primary,
                  },
                  '&.Mui-focused fieldset': { // Màu của border khi focus
                    borderColor: theme.palette.text.primary,
                  },
                },
                '& .MuiInputBase-input': { // Màu của text
                  color: theme.palette.text.primary,
                },
                '& .MuiIconButton-root': { // Màu của icon calendar
                  color: theme.palette.text.primary,
                },
              }}
            />
          </LocalizationProvider>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={toggleProgressFilter} color="primary">
                <FilterListIcon />
              </IconButton>
              <Typography variant="body1" sx={{ ml: 1 }}>
                Lọc theo tiến độ
              </Typography>
            </Box>
            <Collapse in={showProgressFilter}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                <TextField
                  label="Tiến độ từ"
                  type="number"
                  value={start === null ? '' : start}
                  onChange={handleProgressChange(setStart)}
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="Tiến độ đến"
                  type="number"
                  value={end === null ? '' : end}
                  onChange={handleProgressChange(setEnd)}
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ width: 120 }}
                />
                <Button variant="contained" onClick={handleFilterProgress}>
                  Lọc
                </Button>
              </Box>
            </Collapse>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
                setSelectedBlock(null);
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
            value={blocks.find((b: any) => b.id === selectedBlock) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedBlock(newValue ? newValue.id : null);
                handleBlockSelect(newValue ? newValue.id : '');
              }
              else {
                setSelectedBlock(null);
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


      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Danh sách báo cáo vệ sinh">
          <TableHead>
            <TableRow>
              <TableCell align="center">Ngày</TableCell>
              <TableCell align="center">Cơ sở</TableCell>
              <TableCell align="center">Tòa nhà</TableCell>
              <TableCell align="center">Tầng</TableCell>
              <TableCell align="center">Phòng</TableCell>
              <TableCell align="center">Tiến độ</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterReportsList?.map(report => (
              <TableRow key={report.id}>
                <TableCell align="center">{dayjs(report.createAt).format('DD/MM/YYYY')} ({report.startTime.substring(0, 5)} - {report.endTime.substring(0, 5)})</TableCell>
                <TableCell align="center">{report.campusName}</TableCell>
                <TableCell align="center">{report.blockName}</TableCell>
                <TableCell align="center">{report.floorName}</TableCell>
                <TableCell align="center">{report.roomName}</TableCell>
                <TableCell align="center"><RenderProgressBar progress={report.value} /></TableCell>
                <TableCell align="center">
                  <div>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? 'long-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={(event) => handleClick(event, report)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      MenuListProps={{
                        'aria-labelledby': 'long-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>
                        <Link href={`/dashboard/two/detail/${currentReportID}`} sx={{ display: 'flex' }} underline='none'>
                          <VisibilityOutlinedIcon sx={{ marginRight: '5px', color: 'black' }} /> Xem chi tiết
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Link href={`/dashboard/two/edit/${currentReportID}`} sx={{ display: 'flex' }} underline='none' >
                          <EditOutlinedIcon sx={{ marginRight: '5px', color: 'black' }} /> Chỉnh sửa
                        </Link>
                      </MenuItem>
                    </Menu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', margin: '10px', float: 'right' }}>
        <Pagination count={totalPages} color="primary" page={page} onChange={handlePageChange} />
      </Stack>
    </Container>
  );
}
