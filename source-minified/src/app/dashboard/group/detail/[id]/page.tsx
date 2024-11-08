import React from 'react'
import FormDetailView from 'src/sections/four/FormDetail'

type Props = {
    params: {
      id: string;
    };
  };
  const page = ({params}:Props) => {
    
    const {id} = params;
  
    return (
      <FormDetailView id={id}/>
    )
  }
  
  export default page