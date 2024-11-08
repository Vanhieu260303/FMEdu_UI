// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    two: `${ROOTS.DASHBOARD}/two`,
    detail: (id: string) => `${ROOTS.DASHBOARD}/two/detail/${id}`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    roomgroup:{
      root: `${ROOTS.DASHBOARD}/room-group`,
      list: `${ROOTS.DASHBOARD}/room-group/list`,
    } ,
    responsiblegroup:{
      root: `${ROOTS.DASHBOARD}/responsible-group`,
      list: `${ROOTS.DASHBOARD}/responsible-group/list`,
      createUserPerTag: `${ROOTS.DASHBOARD}/responsible-group/createUserPerTag`,
    } ,

    shift:{
      root: `${ROOTS.DASHBOARD}/shift`,
      list: `${ROOTS.DASHBOARD}/shift/list`,
    } ,
  },
};
