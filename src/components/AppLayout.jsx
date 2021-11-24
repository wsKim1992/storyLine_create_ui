import React,{useState,useEffect} from 'react';

const AppLayout = ({children})=>{
    return (
        <>
            <div>
                {children}
            </div>
        </>
    )
}

export default AppLayout;
