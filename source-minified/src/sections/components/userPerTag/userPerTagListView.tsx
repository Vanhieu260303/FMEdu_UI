"use client"
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Menu, MenuItem, Box, Collapse } from "@mui/material";
import dayjs from "dayjs";
import Link from '@mui/material/Link';
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TagService from "src/@core/service/tag";
import { KeyboardArrowDown } from "@mui/icons-material";
import { KeyboardArrowUp } from "@mui/icons-material";
import CollapsibleResUserGroup from "../table/ResponsibleUserGroup/CollapsibleResUserGroup";
import React from "react";
import CollapsibleUserPerTag from "./CollapsibleUserPerTag";
import SnackbarComponent from "../snackBar";

interface props {
    data:any
}

export default function UserPerTagListView({data}:props) {
    const [openRow, setOpenRow] = useState(null);


    const handleRowClick = (rowId: any) => {
        setOpenRow(openRow === rowId ? null : rowId);
    };

   

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Danh sách báo cáo vệ sinh">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">STT</TableCell>
                        <TableCell align="center">Tên Tag</TableCell>
                        <TableCell align="center">Số lượng người</TableCell>
                        <TableCell align="center"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.map((tag: any, index:any) => (
                        <React.Fragment key={tag.id}>
                            <TableRow key={tag.id}>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="center">{tag.tagName}</TableCell>
                                <TableCell align="center">{tag.numberOfUsers}</TableCell>
                                <TableCell align='right'>
                                    <IconButton
                                        aria-label="expand row"
                                        size="small"
                                        onClick={() => handleRowClick(tag.id)}
                                    >
                                        {openRow === tag.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                    <Collapse in={openRow === tag.id} timeout="auto" unmountOnExit>
                                        <Box margin={1}>
                                            <CollapsibleUserPerTag id={tag.id} tagName={tag.tagName}></CollapsibleUserPerTag>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>

                    ))}
                </TableBody>
            </Table>

        </TableContainer>
    )
}