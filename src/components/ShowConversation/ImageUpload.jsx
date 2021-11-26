import React,{useState, useMemo} from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import { Button } from 'antd';
import Slider from 'react-slick';
import {SendOutlined} from '@ant-design/icons';
import { useSelector } from 'react-redux';

const StyledImage = styled.img`
    display:inline-block;
    object-position:center;
    width:150px;
    height:90px;
    border-radius:5.5px;
    border:none;
    margin-right:5px;
`

const fileBase64List = (file)=>{
    
    return new Promise((resolve,reject)=>{
        if(file.type.match('image/*')){
            let reader = new FileReader();
            reader.onload = (evt)=>{
                let tempImg = new Image();
                tempImg.src = evt.target.result;
                tempImg.onload=()=>{
                    resolve({url:tempImg.src,width:tempImg.width,height:tempImg.height});
                }
            }
            reader.readAsDataURL(file);
        }else{
            reject({message:'이미지 파일 (.jpg,.png,.jpeg 파일을 업로드 해주세요!!)'})
        }
    })
}


const ImageUpload = ({message,setMessage,onSearch})=>{
    /* const [fileArr,setFileArr]=useState([]) */
    const {loadingStory} = useSelector((state)=>state.storyline);
    const onDrop = async(acceptedFiles,rejectedFiles)=>{
        if(Object.keys(rejectedFiles).length!=0){
            alert("부적절한 파일이 업로드 되었음!");
            return false;
        }
        
        const imgDataArr = await Promise.all(acceptedFiles.map(async(v,i)=>{
            const data = await fileBase64List(v);
            return data;
        }))
        setMessage([...imgDataArr.map(v=>v.url)]);
    }

    const renderedImgs = message.length!==0?(
        <div>
            {message.map((v,i)=><StyledImage key={i} src={v}/>)}
        </div>):(
            <p>
                사진을 업로드 해주세요.
            </p>
        )
            
        
    return(
        <React.Fragment>
            <Dropzone
                style={{
                    width:'100%',
                    height:'100%',
                    borderRadius:'8.5px',
                    objectFit:"cover",
                    objectPosition:"center",
                    backgroundColor:'#fff',
                    color:'#fff'
                }}
                multiple={true}
                accept="image/*"
                onDrop={(acceptedFiles,rejectedFiles)=>onDrop(acceptedFiles,rejectedFiles)}>
                {({getRootProps,getInputProps,isDragAccept,isDragReject})=>{
                    
                    return (
                        <>
                            <div style={{overflowY:'auto',display:'flex',flexDirection:'row',alignItems:'center',width:'80%',height:'100%',color:'#fff'}} {...getRootProps()}>
                                <input {...getInputProps()}/>
                                {isDragReject?
                                    <p>잘못된 파일 업로드.</p>
                                    :renderedImgs
                                }
                            </div>
                            <div style={{width:'18.5%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <Button loading={loadingStory} onClick={onSearch} style={{width:'90%',height:'90%',border:'none',borderRadius:'5.5px',backgroundColor:'rgb(34, 34, 34)'}}>
                                    <SendOutlined />
                                </Button>
                            </div>
                        </>
                    )
                }}
            </Dropzone>
        </React.Fragment>
    )
}

export default ImageUpload;