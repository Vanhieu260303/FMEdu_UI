import React from 'react'
import ReportEditView from 'src/sections/two/EditReport'

type Props = {
  params: {
    id: string;
  };
};
const page = ({params}:Props) => {
  
  const {id} = params;

  return (
    <ReportEditView reportId={id}/>
  )
}

export default page