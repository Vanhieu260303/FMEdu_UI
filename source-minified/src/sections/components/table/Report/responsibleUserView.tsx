import { Paper, alpha, Box, Typography, colors, PaletteColor, Chip, Avatar, useTheme } from '@mui/material';
import React from 'react'

interface Props {
  data: any[],
  isShadow?: boolean,
}

const ResponsibleUserView = ({ data, isShadow = true }: Props) => {
  const theme = useTheme();

  const getFirstLetter = (str: string) => str.charAt(0).toUpperCase();
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        boxShadow: isShadow
          ? `0 0 2px ${alpha(theme.palette.grey[500], 0.12)}, 0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.24)}`
          : 'none',
        borderRadius: 2,
      }}
    >
      <Box sx={{ mb: '10px' }}>
        <Typography variant='h4'>Bộ phận chịu trách nhiệm</Typography>
      </Box>
      {data?.map((group: { tagName: string, [key: string]: any }, index: number) => {
        const colorKey = index % 2 === 0 ? 'primary' : 'secondary';
        const groupColor = theme.palette[colorKey].main;
        return (
          <Box
            key={group.tagName}
            sx={{
              mb: 2,
              p: 2,
              backgroundColor: alpha(groupColor, 0.1),
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: groupColor }}>
              {group.tagName}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {group.users.map((user: any) => (
                <Chip
                  key={user.id}
                  avatar={<Avatar sx={{ bgcolor: 'white', color: groupColor }}>{getFirstLetter(user.firstName)}</Avatar>}
                  label={`${user.firstName} ${user.lastName}`}
                  color={colorKey}
                  sx={{
                    color: 'white',
                  }}
                />
              ))}
            </Box>
          </Box>
        );
      })}
    </Paper>
  )
}

export default ResponsibleUserView