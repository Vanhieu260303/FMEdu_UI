"use client"
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import "src/global.css";
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Button, Chip, FormControl, FormControlLabel, IconButton, InputLabel, Link, MenuItem, PaletteColor, Popover, Radio, RadioGroup, Select, TextField, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import 'dayjs/locale/vi';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RenderRatingInput from 'src/sections/components/rating/renderRatingInput';
import BlockService from 'src/@core/service/block';
import FloorService from 'src/@core/service/floor';
import CampusService from 'src/@core/service/campus';
import ShiftService from 'src/@core/service/shift';
import CriteriaService from 'src/@core/service/criteria';
import RoomService from 'src/@core/service/room';
import CleaningReportService from 'src/@core/service/cleaningReport';
import CleaningFormService from 'src/@core/service/form';
import Upload from '../components/files/Upload';
import SnackbarComponent from '../components/snackBar';
import ScheduleService from 'src/@core/service/schedule';
import responsibleUserView from '../components/table/Report/responsibleUserView';
import ResponsibleUserView from '../components/table/Report/responsibleUserView';
import QRCodeScanner from '../components/QRScanner';
import FileService from 'src/@core/service/files';
import { useSettingsContext } from 'src/components/settings';

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

type Shift = {
  id: string,
  shiftName: string,
  startTime: string,
  endTime: string,
  roomCategoryId: string,
  createAt: string,
  updateAt: string
}

type Criteria = {
  id: string,
  criteriaName: string,
  roomCategoryId: string,
  criteriaType: string,
  createAt: string,
  updateAt: string
};
interface CriteriaEvaluation {
  criteriaId: string;
  value: any;
  note: string;
  images: { [key: string]: string };
}



// ----------------------------------------------------------------------

export default function OneView() {
  const [selectedBlocks, setSelectedBlocks] = useState<any>(null);
  const [selectedCampus, setSelectedCampus] = useState<any>(null);
  const [selectedFloor, setSelectedFloor] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const [criteriaEvaluations, setCriteriaEvaluations] = useState<Array<{ criteriaId: string, value: any, note: string }>>([]);
  const [form, setForm] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [campus, setCampus] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarStatus, setSnackbarStatus] = useState('success');
  const [criteriaImages, setCriteriaImages] = useState<{ [criteriaId: string]: string[] }>({});
  const [isSending, setIsSending] = useState(false);
  const settings = useSettingsContext();

  const resetComponent = useCallback(() => {
    setSelectedCampus(null);
    setBlocks([]);
    setSelectedBlocks(null);
    setFloors([]);
    setSelectedFloor(null);
    setRooms([]);
    setSelectedRoom(null);
    setShifts([]);
    setSelectedShift(null);
    setCriteria([]);
    setCriteriaEvaluations([]);
    setCriteriaImages({});
    setData([]);
    setForm(null);
    setIsSending(false);
  }, []);


  const handleImagesChange = (images: { [criteriaId: string]: string[] }) => {
    setCriteriaImages(prevImages => ({
      ...prevImages,
      ...images
    }));
  };


  const updateCriteriaEvaluation = (criteriaId: string, value: any, note: string) => {
    setCriteriaEvaluations(prevEvaluations => {
      const numericValue = Number(value);
      const existingIndex = prevEvaluations.findIndex(evaluation => evaluation.criteriaId === criteriaId);
      if (existingIndex !== -1) {
        const newEvaluations = [...prevEvaluations];
        newEvaluations[existingIndex] = { criteriaId, value: numericValue, note };
        return newEvaluations;
      } else {
        return [...prevEvaluations, { criteriaId, value: numericValue, note }];
      }
    });
  };

  useEffect(() => {
    const fetchCampus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await CampusService.getAllCampus();

        setCampus(response.data);
      } catch (error) {
        setError(error.message);

      } finally {
        setIsLoading(false);
      }
    };
    fetchCampus();
  }, []);



  const handleCampusSelect = async (CampusId: string) => {
    setSelectedCampus(CampusId);
    try {
      const response = await BlockService.getBlockByCampusId(CampusId);
      setBlocks(response.data);
      setFloors([]);
      setRooms([]);
      setShifts([]);
      setSelectedShift(null);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };
  const handleBlockSelect = async (blockId: string) => {
    setSelectedBlocks(blockId);
    try {
      const response = await FloorService.getFloorByBlockId(blockId);
      if (response.data.length > 0) {
        setFloors(response.data);
        setSelectedFloor(null)
        setRooms([]);
        setSelectedRoom(null)
        setShifts([]);
        setSelectedShift(null);
      }
      else {
        setFloors([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };

  const handleFloorSelect = async (floorId: string) => {
    setSelectedFloor(floorId);
    try {
      const response = await RoomService.getRoomsByFloorIdAndBlockIdIfExistForm(floorId, selectedBlocks);
      if (response.data.length > 0) {
        setRooms(response.data);
        setSelectedRoom(null);
        setShifts([]);
        setSelectedShift(null);
      }

    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };

  const handleRoomSelect = async (roomId: string) => {
    setSelectedRoom(roomId);
    if (roomId) {
      try {
        const response = await ShiftService.getShiftsByRoomId(roomId);
        setShifts(response.data);
        setSelectedShift(null);
        setCriteriaEvaluations([]);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách ca:', error);
      }
      try {
        const responseForm = await CleaningFormService.getFormByRoomId(roomId);
        setForm(responseForm.data);
      }
      catch (error) {
        alert("Chưa có Form báo cáo cho khu vực này");
        setSelectedRoom(null);
      }
    } else {
      console.error('Không tìm thấy phòng hoặc phòng không có roomCategoryId');
      setShifts([]);
    }
  };


  const handleShiftSelect = async (ShiftId: string) => {
    if (ShiftId === null || ShiftId === '') {
      setCriteria([])
    }
    else {
      setSelectedShift(ShiftId);
      try {
        const place = {
          campusId: selectedCampus,
          blockId: selectedBlocks,
          floorId: selectedFloor,
          roomId: selectedRoom,
          shiftId: ShiftId,
        }
        const response = await CriteriaService.getCriteriaByRoomId(selectedRoom);
        const crtIds = response.data.map((c: any) => c.id);
        console.log(ShiftId, place, crtIds)
        const userPerTagResponse = await ScheduleService.getTagAndUserByShiftAndRoom(place, crtIds)
        setCriteria(response.data);
        setData(userPerTagResponse.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tiêu chí:', error);
      }
    }
  };

  const uploadImages = async (temporaryUrls: any) => {

    const uploadedUrls = await Promise.all(
      temporaryUrls.map(async (tempUrl: any) => {
        const blob = await fetch(tempUrl).then(res => res.blob());
        const file = new File([blob], `image_${Math.random()}.jpg`, { type: blob.type });
        const formData = new FormData();
        formData.append("files", file);
        const res = await FileService.PostFile(formData);

        return res.data.fileUrls[0]; // Giả sử server trả về URL của file đã upload
      })
    );
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    const reportData: {
      formId: string;
      shiftId: string;
      value: number;
      userId: string;
      criteriaList: CriteriaEvaluation[];
      userPerTags: any;
  } = {
      formId: form.id,
      shiftId: selectedShift,
      value: 0,
      userId: "abc",
      criteriaList: [],
      userPerTags: data
  };

    if (criteriaEvaluations.length < criteria.length) {
      setSnackbarMessage("Vui lòng đánh giá đầy đủ các tiêu chí");
      setSnackbarStatus('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const criteriaListWithUploadedImages = await Promise.all(
        criteriaEvaluations.map(async (criteria) => {
          const images = criteriaImages[criteria.criteriaId] || [];

          // Gọi hàm uploadImages để upload và lấy URL thực
          const uploadedImageUrls = await uploadImages(images);

          const imagesObject = uploadedImageUrls.reduce((acc, url, index) => {
            acc[`image_${index + 1}`] = url;
            return acc;
          }, {});

          return {
            criteriaId: criteria.criteriaId,
            value: criteria.value,
            note: criteria.note,
            images: imagesObject
          };
        })
      );

      reportData.criteriaList = criteriaListWithUploadedImages;

      const response = await CleaningReportService.PostReport(reportData);
      if (response.status === 200) {
        const reportId = response.data.id;
        const addUserScoreResponse = await CleaningReportService.AddUserScore({ ...reportData, reportId });
        if (addUserScoreResponse.status === 200) {
          setIsSending(true);
          setSnackbarMessage("Đã gửi thành công");
          setSnackbarStatus("success");
          setSnackbarOpen(true);
        }
      }
    } catch (e) {
      setIsSending(false);
      setSnackbarMessage(e.response?.data || "Đã xảy ra lỗi khi gửi báo cáo");
      setSnackbarStatus("error");
      setSnackbarOpen(true);
      console.error("Submit error:", e);
    }
  };


  const handleValueChange = (criteriaId: string, value: number | null) => {
    const existingEvaluation = criteriaEvaluations.find(evaluation => evaluation.criteriaId === criteriaId);
    updateCriteriaEvaluation(criteriaId, value, existingEvaluation?.note || '');
  };

  const handleNoteChange = (criteriaId: string, note: string) => {
    const existingEvaluation = criteriaEvaluations.find(evaluation => evaluation.criteriaId === criteriaId);
    updateCriteriaEvaluation(criteriaId, existingEvaluation?.value || '', note);
  };

  const handleSnackbarClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    if (snackbarStatus === 'success') {
      resetComponent();
    } else {
      setIsSending(false); // Enable lại nút Send nếu có lỗi
    }
  }, [snackbarStatus]);


  const handleQRScan = useCallback(async (data: any) => {
    await handleCampusSelect(data.campusId);
    await handleBlockSelect(data.blockId);
    await handleFloorSelect(data.floorId);
    await handleRoomSelect(data.roomId);
    if (data.shiftId) {
      await handleShiftSelect(data.shiftId);
    }
  }, [])


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4">Đánh giá vệ sinh</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between',marginY:'15px' }}>
        <QRCodeScanner onchange={handleQRScan} />
        <Button variant="contained" href="/dashboard/group" sx={{ height: '40px' }}>
          Tạo form đánh giá
        </Button>
      </Box>

      <Box
        sx={{
          mt: 2,
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
                  setShifts([]);
                  setSelectedShift(null);
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
                  handleBlockSelect(newValue ? newValue.id : '');
                }
                else {
                  setSelectedBlocks(null);
                  setFloors([]);
                  setSelectedFloor(null);
                  setRooms([]);
                  setSelectedRoom(null);
                  setShifts([]);
                  setSelectedShift(null);
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
                  handleFloorSelect(newValue ? newValue.id : '');
                }
                else {
                  setSelectedFloor(null);
                  setRooms([]);
                  setSelectedRoom(null);
                  setShifts([]);
                  setSelectedShift(null);
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
                if (newValue) {
                  handleRoomSelect(newValue ? newValue.id : '');
                }
                else {
                  setSelectedRoom(null);
                  setShifts([]);
                  setSelectedShift(null)
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn phòng"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu phòng"
              isOptionEqualToValue={(option, value) => option.id === (value?.id || value)}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.roomName}
                </li>
              )}
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={shifts}
              getOptionLabel={(option: any) => `${option.shiftName} (${option.startTime.substring(0, 5)} - ${option.endTime.substring(0, 5)})`}
              value={shifts.find(shift => shift.id === selectedShift) || null}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleShiftSelect(newValue ? newValue.id : '');
                }
                else {
                  setSelectedShift(null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn ca"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu ca"
              isOptionEqualToValue={(option, value) => option.id === value.id}

            />
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead sx={{ width: 1 }}>
                <TableRow>
                  <TableCell align='center' sx={{ width: '25%' }}>Tiêu chí</TableCell>
                  <TableCell align="center" sx={{ width: '25%' }}>Đánh giá</TableCell>
                  <TableCell align="center" sx={{ width: '50%' }}>Ghi chú</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {criteria.map(criterion => (
                  <TableRow
                    key={criterion.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, margin: '10px 0' }}
                  >
                    <TableCell component="th" scope="row" align='center' sx={{ width: '25%' }}>
                      {criterion.criteriaName}
                    </TableCell>
                    <TableCell align="center" sx={{ width: '25%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <RenderRatingInput
                          criteriaID={criterion.id}
                          inputRatingType={criterion.criteriaType}
                          value={criteriaEvaluations.find(evaluation => evaluation.criteriaId === criterion.id)?.value || ''}
                          onValueChange={handleValueChange} />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ width: '50%' }}>
                      <TextField fullWidth sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                          },
                        }
                      }} placeholder=''
                        onChange={(e) => handleNoteChange(criterion.id, e.target.value)}
                      />
                      <Upload onImagesChange={handleImagesChange} criteriaId={criterion.id} ></Upload>
                    </TableCell>

                  </TableRow>
                ))}
                {criteria.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <ResponsibleUserView data={data} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {criteria.length !== 0 &&
          <Box sx={{ mt: 'auto', alignSelf: 'flex-end', mb: 2, mr: 2 }}>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSubmit}
              disabled={isSending}
            >
              Gửi
            </Button>
            <SnackbarComponent
              status={snackbarStatus as 'success' | 'error' | 'info' | 'warning'}
              open={snackbarOpen}
              message={snackbarMessage}
              onClose={handleSnackbarClose}
            />
          </Box>}
      </Box>

    </Container>
  );
}
