'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState } from 'react';
import {
  Button,
  Pagination,
  Stack
} from '@mui/material';

import Popup from '../../components/form/Popup';
import AddUserPerTag from '../../components/form/AddUserPerTag';
import UserPerTagListView from '../../components/userPerTag/userPerTagListView';
import TagService from 'src/@core/service/tag';

// ----------------------------------------------------------------------

export default function UserPerTagCreate() {
  const settings: any = useSettingsContext();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [data, setData] = useState<any>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const handlePageChange = (event: any, newPage: any) => {
    setPage(newPage);
  }
  useEffect(() => {
    fetchData(page);
  }, [page])

  const fetchData = async (page:number) => {
    try {
      const response = await TagService.getTagGroups(page);
      setData(response.data);
      const totalPages = Math.ceil(response.data.totalRecords / 10);
      setTotalPages(totalPages);
    }
    catch (e) {
      console.log(e)
    }
  }
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <Box sx={{ marginTop: '10px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Typography variant='h4'>Danh sách các nhóm tag đã tạo</Typography>
          <Button
            variant='contained'
            onClick={() => setOpenPopUp(true)}
          >
            Tạo mới
          </Button>
          <Popup
            title='Thêm người chịu trách nhiệm cho từng Tag'
            openPopup={openPopUp}
            setOpenPopup={setOpenPopUp} >
            <AddUserPerTag setOpenPopup={setOpenPopUp} />
          </Popup>
        </Box>
        <Box>
          <UserPerTagListView data={data.tags} />
        </Box>
        <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', margin: '10px', float: 'right' }}>
          <Pagination count={totalPages} color="primary" page={page} onChange={handlePageChange} />
        </Stack>
      </Box>
    </Container>
  );
}
