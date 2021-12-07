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
        console.log(file);
        if(file.type.match('image/*')){
            let reader = new FileReader();
            reader.onload = (evt)=>{
                resolve(evt.target.result);
            }
            reader.readAsDataURL(file);
        }else{
            reject({message:'이미지 파일 (.jpg,.png,.jpeg 파일을 업로드 해주세요!!)'})
        }
    })
}


const ImageUpload = ({message,setMessage,onSearch})=>{
    const {loadingStory} = useSelector((state)=>state.storyline);
    const [fileName,setFileName] = useState('');

    const onDrop = async(acceptedFiles,rejectedFiles)=>{
        if(Object.keys(rejectedFiles).length!=0){
            alert("부적절한 파일이 업로드 되었음!");
            return false;
        }
        try{
            const data = await fileBase64List(acceptedFiles[0]);
            setFileName(acceptedFiles[0].name);
            setMessage(data);
        }catch(err){
            alert(err.message);
        }
    }

    const renderedImgs = (
        <p>
            {fileName!==''?fileName:'파일을 업로드 해주세요!'}
        </p>
    )
            
        
    return(
        <React.Fragment>
            <Dropzone
                style={{
                    display:"flex",
                    width:'100%',
                    height:'50%',
                    borderRadius:'8.5px',
                    objectFit:"cover",
                    objectPosition:"center",
                    backgroundColor:'#fff',
                    color:'#fff'
                }}
                multiple={false}
                accept="image/*"
                onDrop={(acceptedFiles,rejectedFiles)=>onDrop(acceptedFiles,rejectedFiles)}>
                {({getRootProps,getInputProps,isDragAccept,isDragReject})=>{
                    
                    return (
                        <div style={{display:'flex',width:'100%'}}>
                            <div style={{display:'flex',flexDirection:'row',alignItems:'center',width:'80%',height:'100%',color:'#fff'}} {...getRootProps()}>
                                <input style={{display:'block'}} {...getInputProps()}/>
                                {isDragReject?
                                    <p>잘못된 파일 업로드.</p>
                                    :renderedImgs
                                }
                            </div>
                            <div style={{width:'18.5%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <Button loading={loadingStory} onClick={onSearch} style={{width:'90%',height:'100%',border:'none',borderRadius:'5.5px',backgroundColor:'rgb(34, 34, 34)'}}>
                                    <SendOutlined />
                                </Button>
                            </div>
                        </div>
                    )
                }}
            </Dropzone>
        </React.Fragment>
    )
}

export default ImageUpload;