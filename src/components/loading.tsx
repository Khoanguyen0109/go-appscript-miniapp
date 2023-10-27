import React from 'react'
import ReactLoading from "react-loading";

type Props = {}

function Loading({}: Props) {
  return (
    <div className='absolute left-24 top-0'>
      <ReactLoading type="bubbles" color={"fff"} />
    </div>  )
}

export default Loading