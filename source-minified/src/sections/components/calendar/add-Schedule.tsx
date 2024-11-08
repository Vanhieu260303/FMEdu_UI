import { Table, TableBody, TableRow, TableCell, Box, IconButton, Button, Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField, Checkbox, useTheme, styled } from '@mui/material'
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons'
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars'
import { RecurrenceEditorComponent } from '@syncfusion/ej2-react-schedule'
import React, { useEffect, useState } from 'react'
import { syncfusionStyles, userMapping } from 'src/utils/schedule/handle-schedule'
import LocationSelector from './location'
import AddIcon from '@mui/icons-material/Add';
import { CalendarItem, User } from 'src/utils/type/Type'
import ScheduleService from 'src/@core/service/schedule'
import './syncfusion-style.css'
import { BorderColor } from '@mui/icons-material'


interface ScheduleData {
    id?: string | null;
    title?: string;
    description?: string;
    recurrenceRule?: string | null;
    responsibleGroupId?: string;
    allDay?: boolean;
    users?: Array<{
        id: string;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
    }>;
    place?: Array<{
        level: string;
        rooms: Array<{
            id: string;
            name: string;
        }>;
    }>;
    startDate: Date;
    endDate: Date;
    index?: number;
}

interface AddScheduleComponentProps {
    scheduleData: any;
    userList: User[];
    calendars: CalendarItem[];
    setOpenPopup: (open: boolean) => void;
    isNewSchedule: boolean;
    onSuccess: (message: string) => void;
}

const AddScheduleComponent = ({ scheduleData, userList, calendars, setOpenPopup, isNewSchedule, onSuccess }: AddScheduleComponentProps) => {
    const theme = useTheme();

    const [formData, setFormData] = useState<ScheduleData>(() => {
        if (isNewSchedule) {
            return {
                id: null,
                title: '',
                description: '',
                recurrenceRule: null,
                responsibleGroupId: '',
                allDay: false,
                users: [],
                place: [],
                startDate: scheduleData ? scheduleData.StartTime : new Date(),
                endDate: scheduleData ? scheduleData.EndTime : new Date(),
                index: undefined
            }
        }
        else {
            return {
                id: scheduleData.id || null,
                title: scheduleData.title || '',
                description: scheduleData.description || '',
                recurrenceRule: scheduleData.recurrenceRule || null,
                responsibleGroupId: scheduleData.responsibleGroupId || '',
                allDay: scheduleData.allDay || false,
                users: scheduleData.users || [],
                place: scheduleData.place || [],
                startDate: scheduleData.startDate || new Date().toISOString(),
                endDate: scheduleData.endDate || new Date().toISOString(),
                index: scheduleData.index
            }
        }
    });

    const [locations, setLocations] = useState(() => {
        if (formData.place && typeof formData.place === 'string') {
            try {
                return JSON.parse(formData.place);
            } catch (error) {
                console.error('Error parsing place:', error);
                return []; // Đặt giá trị mặc định nếu parse thất bại
            }
        }
        return formData.place || [];
    });
    const [users, setUsers] = useState(() => {
        if (formData.users) {
            return userMapping(formData.users);
        }
    })

    const adjustTimeZone = (date: Date, dateType: string) => {

        const adjustedDate = new Date(date);
        adjustedDate.setHours(adjustedDate.getHours() + 7);
        if (dateType === 'end' && adjustedDate.getHours() === 7 && adjustedDate.getMinutes() === 0) {
            adjustedDate.setDate(adjustedDate.getDate() - 1);
            adjustedDate.setHours(30);
            adjustedDate.setMinutes(59);
            console.log("enter end date");
        }

        return adjustedDate;
    };

    const handleInputChange = (name: any, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name: string, value: Date) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResponsibleGroupChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const [isAllDay, setIsAllDay] = useState(formData.allDay || false);

    const handleIsAllDayChange = (args: any) => {
        setIsAllDay(args.checked);
        setFormData(prev => ({ ...prev, ['allDay']: args.checked }));
    };

    const handleRecurrenceChange = (args: any) => {
        setFormData(prev => ({ ...prev, ['recurrenceRule']: args.value }));
    };


    const handleLocationChange = (index: number, level: string, rooms: Array<{ id: string, name: string }>) => {
        const newLocations = [...locations];
        newLocations[index] = { level, rooms };
        setLocations(newLocations);
        setFormData(prev => ({ ...prev, place: newLocations }));
    };

    const addLocation = () => {
        setLocations([...locations, { level: '', rooms: [] }]);
    };

    const removeLocation = (index: number) => {
        const newLocations = locations.filter((_: any, i: number) => i !== index);
        setLocations(newLocations);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        formData.startDate = adjustTimeZone(formData.startDate, 'start');
        formData.endDate = adjustTimeZone(formData.endDate, 'end');
        try {
            if (isNewSchedule) {
                const res = await ScheduleService.createSchedule(formData);
                if (res.status === 200) {
                    onSuccess('Tạo lịch thành công');
                }
            } else {
                const res = await ScheduleService.editSchedule(formData.id as string, formData);
                if (res.status === 200) {
                    onSuccess('Cập nhật lịch thành công');
                }
            }
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
        }

    };
    return (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell colSpan={2}>
                        <TextField
                            fullWidth
                            id="title"
                            label="Tiêu đề"
                            variant="outlined"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                        />
                    </TableCell>

                </TableRow>
                <TableRow>
                    <TableCell colSpan={2}>
                        <Autocomplete
                            multiple
                            options={userMapping(userList)}
                            getOptionLabel={(option) => option.text}
                            defaultValue={!isNewSchedule ? users : []}
                            onChange={(event, newValue) => handleMultiSelectChange('users', newValue.map(v => v.id))}
                            renderInput={(params) => <TextField {...params} label="Chọn người dùng" />}
                            noOptionsText="Không có dữ liệu người dùng"
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.text}
                                </li>
                            )}
                        />

                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={2}>
                        <FormControl fullWidth>
                            <InputLabel id="responsible-group-label">Chọn nhóm người</InputLabel>
                            <Select
                                labelId="responsible-group-label"
                                id="responsibleGroupId"
                                value={formData.responsibleGroupId}
                                label="Chọn nhóm người"
                                onChange={(e) => handleResponsibleGroupChange('responsibleGroupId', e.target.value)}
                            >
                                {calendars.map(cal => (
                                    <MenuItem key={cal.id} value={cal.id}>{cal.groupName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <DateTimePickerComponent id="startDate" value={new Date(formData.startDate)} change={(e) => handleDateChange('startDate', e.value)} className='e-field' floatLabelType="Always" placeholder='Ngày bắt đầu' locale='vi'></DateTimePickerComponent>
                        
                    </TableCell>
                    <TableCell>
                        <DateTimePickerComponent id="endDate" value={new Date(formData.endDate)} change={(e) => handleDateChange('endDate', e.value)} className='e-field' floatLabelType="Always" placeholder='Ngày kết thúc' locale='vi'></DateTimePickerComponent>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={2}>
                        <CheckBoxComponent
                            id="allDay"
                            checked={isAllDay}
                            label="Cả ngày"
                            change={handleIsAllDayChange}
                            className="e-field"

                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={2}>
                        {locations.map((location: any, index: any) => (
                            <Box key={index} sx={{ mt: 2 }}>
                                <LocationSelector
                                    key={index}
                                    index={index}
                                    data={location}
                                    onChange={handleLocationChange}
                                    onRemove={removeLocation} />
                            </Box>
                        ))}
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', border: '1px dashed', borderRadius: '5px', cursor: 'pointer' }} onClick={addLocation}>
                            <IconButton color="primary">
                                <AddIcon />
                            </IconButton>
                        </Box>
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell colSpan={2}>
                        <RecurrenceEditorComponent
                            id='recurrenceRule'
                            style={{ width: '100%' }}
                            value={formData.recurrenceRule || ''}
                            change={handleRecurrenceChange}
                            locale='vi'
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={2}>
                        <TextField
                            fullWidth
                            id="description"
                            label="Mô tả"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={2}>
                        <Button variant="contained" sx={{ width: '100%' }} onClick={handleSubmit}>Lưu</Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default AddScheduleComponent