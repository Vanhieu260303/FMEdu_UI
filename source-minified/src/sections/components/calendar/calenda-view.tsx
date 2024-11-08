'use client'
registerLicense(CALENDAR_LICENSE_KEY as string);
import {
  Week, Day, Month, Agenda, ScheduleComponent, ViewsDirective, ViewDirective, Inject, Resize, DragAndDrop, TimelineMonth, TimelineViews,
  CellClickEventArgs, CurrentAction,
  RecurrenceEditor,
  ResourcesDirective,
  ResourceDirective,
  EventClickArgs
} from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

import numberingSystems from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';
import gregorian from '@syncfusion/ej2-cldr-data/main/vi/ca-gregorian.json';
import numbers from '@syncfusion/ej2-cldr-data/main/vi/numbers.json';
import timeZoneNames from '@syncfusion/ej2-cldr-data/main/vi/timeZoneNames.json';

import { useCallback, useEffect, useRef, useState } from 'react';
import { L10n, loadCldr } from '@syncfusion/ej2-base';
import { Box, IconButton, Button, Typography, Container } from '@mui/material';
import { CALENDAR_LICENSE_KEY } from 'src/config-global';
import CalendarList from './list-UserGroup-view';
import ScheduleService from 'src/@core/service/schedule';
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import { getResponsibleGroupText } from 'src/utils/schedule/handle-schedule';
import { User, CalendarItem } from 'src/utils/type/Type';
import UserService from 'src/@core/service/user';
import SnackbarComponent from '../snackBar';
import Popup from '../form/Popup'
import AddScheduleComponent from './add-Schedule';
import CloseIcon from '@mui/icons-material/Close';
import { useSettingsContext } from 'src/components/settings';

L10n.load({
  vi: {
    "schedule": {
      "day": "Ngày",
      "week": "Tuần",
      "workWeek": "Tuần công việc",
      "month": "Tháng",
      "year": "Năm",
      "agenda": "Chương trình nghị sự",
      "weekAgenda": "Chương trình nghị sự tuần",
      "workWeekAgenda": "Chương trình làm việc trong tuần",
      "monthAgenda": "Chương trình nghị sự tháng",
      "today": "Hôm nay",
      "noEvents": "Không có sự kiện",
      "emptyContainer": "Không có sự kiện theo lịch trình vào ngày này.",
      "allDay": "Cả ngày",
      "start": "Khởi đầu",
      "end": "Kết thúc",
      "more": "Hơn",
      "close": "Đóng",
      "cancel": "Hủy bỏ",
      "noTitle": "(Không tiêu đề)",
      "delete": "Xóa bỏ",
      "deleteEvent": "Xóa sự kiện",
      "deleteMultipleEvent": "Xóa nhiều sự kiện",
      "selectedItems": "Các mục được chọn",
      "deleteSeries": "Xóa toàn bộ loạt sự kiện",
      "edit": "Chỉnh sửa",
      "editSeries": "Chỉnh sửa toàn bộ loạt sự kiện",
      "editEvent": "Chỉnh sửa sự kiện",
      "createEvent": "Tạo sự kiện",
      "subject": "Tiêu đề sự kiện",
      "addTitle": "Thêm tiêu đề",
      "moreDetails": "Thêm chi tiết",
      "moreEvents": "Thêm sự kiện",
      "save": "Lưu",
      "editContent": "Bạn muốn thay đổi cuộc hẹn trong chuỗi như thế nào?",
      "deleteContent": "Bạn có chắc chắn muốn xóa sự kiện này không?",
      "deleteMultipleContent": "Bạn có chắc chắn muốn xóa các sự kiện đã chọn không?",
      "newEvent": "Sự kiện mới",
      "title": "Tiêu đề",
      "location": "Vị trí",
      "description": "Sự miêu tả",
      "timezone": "Múi giờ",
      "startTimezone": "Bắt đầu múi giờ",
      "endTimezone": "Múi giờ kết thúc",
      "repeat": "Lặp lại",
      "saveButton": "Lưu",
      "cancelButton": "Hủy bỏ",
      "deleteButton": "Xóa bỏ",
      "recurrence": "Sự lặp lại",
      "wrongPattern": "Mẫu tái phát không hợp lệ.",
      "seriesChangeAlert": "Bạn có muốn hủy các thay đổi được thực hiện cho các phiên bản cụ thể của chuỗi này và khớp lại với toàn bộ chuỗi không?",
      "createError": "Thời gian của sự kiện phải ngắn hơn tần suất xảy ra. Rút ngắn thời lượng hoặc thay đổi mẫu lặp lại trong trình chỉnh sửa sự kiện lặp lại.",
      "sameDayAlert": "Hai lần xuất hiện của cùng một sự kiện không thể xảy ra trong cùng một ngày.",
      "occurenceAlert": "Không thể lên lịch lại lần xuất hiện của cuộc hẹn định kỳ nếu cuộc hẹn đó bỏ qua lần xuất hiện sau của cùng một cuộc hẹn.",
      "editRecurrence": "Chỉnh sửa tái phát",
      "repeats": "Lặp lại",
      "alert": "Thông báo",
      "startEndError": "Ngày kết thúc được chọn xảy ra trước ngày bắt đầu.",
      "invalidDateError": "Giá trị ngày nhập không hợp lệ.",
      "blockAlert": "Sự kiện không thể lên lịch trong thời gian bị chặn.",
      "ok": "Đồng ý",
      "of": "Của",
      "yes": "Đúng",
      "no": "Không",
      "occurrence": "Tần suất xảy ra",
      "series": "Loạt",
      "previous": "Trước",
      "next": "Kế tiếp",
      "timelineDay": "Mốc thời gian theo ngày",
      "timelineWeek": "Mốc thời gian theo tuần",
      "timelineWorkWeek": "Mốc thời gian theo tuần làm việc",
      "timelineMonth": "Mốc thời gian theo tháng",
      "timelineYear": "Mốc thời gian theo năm",
      "editFollowingEvent": "Sự kiện sau",
      "deleteTitle": "Xóa sự kiện",
      "editTitle": "Chỉnh sửa sự kiện",
      "beginFrom": "Bắt đầu từ",
      "endAt": "Kết thúc tại",
      "expandAllDaySection": "Mở rộng phần cả ngày",
      "collapseAllDaySection": "Thu gọn cả ngày phần",
      "searchTimezone": "Tìm kiếm múi giờ",
      "noRecords": "Không có dữ liệu được tìm thấy"
    },
    "recurrenceeditor": {
      "none": "Không có",
      "daily": "Hằng ngày",
      "weekly": "Hàng tuần",
      "monthly": "Hàng tháng",
      "month": "Tháng",
      "yearly": "Hàng năm",
      "never": "Không bao giờ",
      "until": "Cho đến khi",
      "count": "Đếm",
      "first": "Đầu tiên",
      "second": "Thứ hai",
      "third": "Thứ ba",
      "fourth": "Thứ tư",
      "last": "Cuối cùng",
      "repeat": "Lặp lại",
      "repeatEvery": "Lặp lại mỗi",
      "on": "Lặp lại trên",
      "end": "Kết thúc",
      "onDay": "Ngày",
      "days": "Ngày",
      "weeks": "Tuần",
      "months": "Tháng",
      "years": "Năm",
      "every": "Mỗi",
      "summaryTimes": "Thời gian",
      "summaryOn": "Trên",
      "summaryUntil": "Cho đến khi",
      "summaryRepeat": "Lặp lại",
      "summaryDay": "Ngày",
      "summaryWeek": "Tuần",
      "summaryMonth": "Tháng",
      "summaryYear": "Năm",
      "monthWeek": "Tháng tuần",
      "monthPosition": "Vị trí tháng",
      "monthExpander": "Mở rộng tháng",
      "yearExpander": "Mở rộng năm",
      "repeatInterval": "Khoảng lặp lại"
    },
    "calendar": {
      "today": "Hôm nay"
    },
  }
});



const CalendarView = () => {
  loadCldr(numbers, timeZoneNames, gregorian, numberingSystems);
  const settings = useSettingsContext();
  const scheduleObj = useRef<ScheduleComponent | null>(null);
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const timeScale = { enable: true, slotCount: 4 };
  const [currentEventSettings, setCurrentEventSettings] = useState([]);
  const [scheduleData, setScheduleData] = useState<any>();
  const [userList, setUserList] = useState<User[]>([])
  const [filterData, setFilterData] = useState(currentEventSettings)
  const [isNewSchedule, setIsNewSchedule] = useState<boolean>(true);
  const handleFilterChange = useCallback((checkedIds: string[]) => {
    const SelectedResponsibleGroup = calendars
      .filter(cal => checkedIds.includes(cal.id.toString()))
      .map(cal => cal.id);


    const filteredEvents = currentEventSettings.filter((event: any) =>
      SelectedResponsibleGroup.includes(event.responsibleGroupId)
    );
    setFilterData(filteredEvents);

    setCalendars(prevCalendars =>
      prevCalendars.map(cal => ({
        ...cal,
        isChecked: checkedIds.includes(cal.id)
      }))
    );
  }, [calendars, currentEventSettings]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarStatus, setSnackbarStatus] = useState('success');
  const [openPopup, setOpenPopup] = useState(false);
  const reloadScheduleData = async () => {
    const ScheduleData = await ScheduleService.getAllSchedule();
    setCurrentEventSettings(ScheduleData.data);
    setFilterData(ScheduleData.data);
  };

  const handleAddScheduleSuccess = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarStatus('success');
    setSnackbarOpen(true);
    setOpenPopup(false);
    reloadScheduleData();
  };

  const handleSnackbarClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  }, [snackbarStatus]);

  const handleAddSchedule = async () => {
    const getSlotData = () => {
      const selectedElements = scheduleObj.current?.getSelectedElements();
      if (!selectedElements) return null;

      const cellDetails = scheduleObj.current?.getCellDetails(selectedElements);
      if (!cellDetails) return null;

      const formData = scheduleObj.current?.eventWindow.getObjectFromFormData("e-quick-popup-wrapper");
      if (!formData) return null;

      const addObj: any = {};
      addObj.Id = scheduleObj.current?.getEventMaxID();
      addObj.Subject = formData.Subject && formData.Subject.length > 0 ? formData.Subject : "Add title";
      addObj.StartTime = new Date(cellDetails.startTime);
      addObj.EndTime = new Date(cellDetails.endTime);
      return addObj;
    };
    const eventData = getSlotData();
    console.log("eventData", eventData);
    setScheduleData(eventData);
    setIsNewSchedule(true);
    setOpenPopup(true);
  }

  const handleEditSchedule = async () => {
    const eventData = scheduleObj.current?.activeEventData?.event;
    setScheduleData(eventData);
    setIsNewSchedule(false);
    setOpenPopup(true);
  }

  const buttonClickActions = useCallback(async (action: string) => {
    let eventData: any = {};
    let actionType: CurrentAction = "Add";

    switch (action) {
      case "delete":
        eventData = scheduleObj.current?.activeEventData?.event;
        if (eventData && eventData.recurrenceRule) {
          actionType = "DeleteSeries";
          eventData = scheduleObj.current?.eventBase.getParentEvent(eventData, true);
          scheduleObj.current?.deleteEvent(eventData, actionType);
        }
        else {
          actionType = "Delete";
          scheduleObj.current?.deleteEvent(eventData, actionType);
        }
        const response = await ScheduleService.deleteSchedule(eventData.id);
        if (response.status === 200) {
          setSnackbarMessage(response.data.message);
          setSnackbarStatus("success");
          setSnackbarOpen(true);
          reloadScheduleData();
        }
        break;
      default:
        break;
    }
    scheduleObj.current?.closeQuickInfoPopup();
  }, []);

  const header = (props: any) => {
    return (
      <Box>
        {props.elementType === "cell" ? (
          <Box
            className="e-cell-header e-popup-header"
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',

            }}
          >
            <IconButton
              id="close"
              className="e-close"
              onClick={() => buttonClickActions("close")}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon fontSize="medium" />
            </IconButton>
          </Box>
        ) : (
          <Box
            className="e-event-header e-popup-header"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              p: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {props.title || 'Không có tiêu đề'}
            </Typography>
            <IconButton
              id="close"
              className="e-close"
              onClick={() => buttonClickActions("close")}
              size="small"
              sx={{
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              <CloseIcon fontSize="medium" />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  }

  const content = (props: any) => {
    return (
      <Box>
        {props.elementType === "cell" ? (
          <Box sx={{ padding: '10px 0' }}>
            <Typography variant='h4' textAlign={"center"}>Chưa có sự kiện nào</Typography>
          </Box>
        ) : (
          <Box className="e-event-content e-template">
            <Box className="e-subject-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {props.place && (
                <Box><b>Địa điểm: </b>{formatLocation(props.place)}</Box>
              )}
              <Box>
                <b>Thời gian: </b>
                {props.startDate.toLocaleDateString('vi-VN', { weekday: 'long' })} - {props.startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })},
                {props.startDate.toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: true })} - {props.endDate.toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: true })}
              </Box>
              <Box><b>Người dùng: </b>
                {props.users?.map((user: any) => `${user.firstName} ${user.lastName}`).join(', ')}
              </Box>
              <Box><b>Nhóm: </b>{getResponsibleGroupText(props.responsibleGroupId, calendars)}</Box>
              {props.description !== undefined && <Box><b>Mô tả: </b> {props.description}</Box>}
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  const footer = (props: any) => {
    return (
      <Box>
        {props.elementType === "cell" ? (
          <Box className="e-cell-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Box className="right-button" sx={{ marginRight: '10px' }}>
              <ButtonComponent id="add" className="e-event-create" title="Add" onClick={handleAddSchedule}> Thêm </ButtonComponent>
            </Box>
          </Box>
        ) : (
          <Box className="e-event-footer" sx={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginRight: '10px' }}>
            <Box className="left-button">
              <ButtonComponent id="edit" className="e-event-edit" title="Edit" onClick={handleEditSchedule}> Chỉnh sửa </ButtonComponent>
            </Box>
            <Box className="right-button">
              <ButtonComponent id="delete" className="e-event-delete" title="Delete" onClick={() => buttonClickActions("delete")}> Xóa </ButtonComponent>
            </Box>
          </Box>
        )}
      </Box>
    );
  }
  const quickInfoTemplates = { header: header, content: content, footer: footer };

  const formatLocation = (place: any) => {
    if (typeof place === 'string') {
      try {
        place = JSON.parse(place);
      } catch (error) {
        console.error('Error parsing Place in template:', error);
        return '';
      }
    }
    return place.map((item: any) => {
      const roomStrings = item.rooms.map((room: any) => room.name);
      return `${roomStrings.join(', ')}`;
    }).join('; ');
  };

  const eventTemplate = (props: any) => {
    return (
      <div>
        <div><b>Tiêu đề: </b>{props.title}</div>
        <div>
          <b>Thời gian: </b>
          {new Date(props.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -
          {new Date(props.endDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };

  const OnEventDoubleClick = (args: EventClickArgs) => {
    args.cancel = true;
    handleEditSchedule();
  }
  const OnCellDoubleClick = (args: CellClickEventArgs) => {
    args.cancel = true;
    handleAddSchedule();
  }




  useEffect(() => {
    const fetchData = async () => {
      const [ResponsibleGroupRes, ScheduleData, UserData] = await Promise.all([ResponsibleGroupRoomService.getAllResponsibleGroups(), ScheduleService.getAllSchedule(), UserService.getAllUsers()]);
      const updatedCalendars = ResponsibleGroupRes.data.map((item: any) => ({
        ...item,
        isChecked: true
      }));
      setCalendars(updatedCalendars);
      setCurrentEventSettings(ScheduleData.data);
      setFilterData(ScheduleData.data);
      setUserList(UserData.data);
    }
    fetchData();
  }, [])


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>
        <Box sx={{flex:4, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">Lịch công việc</Typography>
          <Button variant='contained' onClick={handleAddSchedule} sx={{mr:3.5}}>Tạo mới lịch</Button>
        </Box>
        <Box sx={{flex:1}}>

        </Box>
      </Box>
      <Popup title='Form đánh giá' openPopup={openPopup} setOpenPopup={setOpenPopup}>
        <AddScheduleComponent scheduleData={scheduleData} userList={userList} calendars={calendars} setOpenPopup={setOpenPopup} isNewSchedule={isNewSchedule} onSuccess={handleAddScheduleSuccess} />
      </Popup>

      <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
        <Box sx={{ flex: 4 }}>
          <ScheduleComponent width='100%' height='700px' dateFormat='dd-MM-yyyy' eventSettings={{
            dataSource: filterData, fields: {
              id: 'index',
              subject: { name: 'title' },
              isAllDay: { name: 'allDay' },
              startTime: { name: 'startDate' },
              endTime: { name: 'endDate' },
              recurrenceRule: { name: 'recurrenceRule' },
              description: { name: 'description' },
              Users: { name: 'users' },
              ResponsibleGroupId: { name: 'responsibleGroupId' },
              Place: { name: 'place' },
              resourceFields: { name: 'responsibleGroupId' },
              customId: { name: 'id' }
            }
            , template: eventTemplate
          }} ref={scheduleObj} rowAutoHeight={true} locale='vi' cssClass="schedule-customization" quickInfoTemplates={quickInfoTemplates} eventDoubleClick={OnEventDoubleClick} cellDoubleClick={OnCellDoubleClick} enableAdaptiveUI={true}>
            <ViewsDirective>
              <ViewDirective option="Day" interval={5}></ViewDirective>
              <ViewDirective option="Month" isSelected={true}></ViewDirective>
              <ViewDirective option="Week" timeScale={timeScale}></ViewDirective>
              <ViewDirective option="TimelineDay" ></ViewDirective>
              <ViewDirective option="TimelineMonth"></ViewDirective>
              <ViewDirective option="Agenda"></ViewDirective>
            </ViewsDirective>
            <ResourcesDirective>
              <ResourceDirective
                field='responsibleGroupId'
                title='Nhóm người dùng'
                name='ResponsibleGroupIds'
                allowMultiple={true}
                dataSource={calendars}
                textField='text'
                idField='id'
                colorField='color'
              />
            </ResourcesDirective>
            <Inject services={[Week, Day, Month, Agenda, Resize, DragAndDrop, TimelineMonth, TimelineViews, RecurrenceEditor]} />
          </ScheduleComponent>
        </Box>
        <Box sx={{ flex: 1 }}>
          <CalendarList
            calendars={calendars}
            onFilterChange={handleFilterChange}
            onCalendarsChange={e => setCalendars(e)}
          />
        </Box>

      </Box>
      <SnackbarComponent
        status={snackbarStatus as 'success' | 'error' | 'info' | 'warning'}
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Container>

  )
}

export default CalendarView;