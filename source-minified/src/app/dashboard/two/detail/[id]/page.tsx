import React from 'react'
import ReportDetailView from 'src/sections/two/ReportDetail'

type Props = {
  params: {
    id: string;
  };
};
const page = ({params}:Props) => {
  
  const {id} = params;

  return (
    <ReportDetailView id={id}/>
  )
}

export default page