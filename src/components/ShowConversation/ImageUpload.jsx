import React,{useState} from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { LOAD_STORY_REQUEST } from '../../../reducers/storyline';

const fileBase64List = (file)=>{
    
    return new Promise((resolve,reject)=>{
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


const ImageUpload = ({inputType})=>{
    console.log(`inputType:${inputType}`);
    const [fileName,setFileName] = useState('');
    const dispatch = useDispatch();
    const onDrop = async(acceptedFiles,rejectedFiles)=>{
        if(Object.keys(rejectedFiles).length!=0){
            alert("부적절한 파일이 업로드 되었음!");
            return false;
        }
        try{
            const fileToBase64 = await fileBase64List(acceptedFiles[0]);
            setFileName(acceptedFiles[0].name);
            dispatch({type:LOAD_STORY_REQUEST, data:{storyMode:'story',inputType,inputText:fileToBase64}});
        }catch(err){
            alert(err.message);
        }
    }

    const renderedImgs = (
        <p style={{height:'50%',margin:'0'}}>
            {fileName!==''?'':'파일을 업로드 해주세요!'}
        </p>
    )
            
        
    return(
        <React.Fragment>
            <Dropzone
                style={{
                    display:"flex",
                    width:'100%',
                    height:'100%',
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
                        <div style={{display:'flex',width:'100%',height:'36px'}}>
                            <div style={{backgroundColor:'#fff',display:'flex',flexDirection:'row',alignItems:'center',width:'100%',height:'100%',color:'#000'}} {...getRootProps()}>
                                <input style={{display:'block'}} {...getInputProps()}/>
                                {isDragReject?
                                    <p style={{height:'50%'}}>잘못된 파일 업로드.</p>
                                    :renderedImgs
                                }
                            </div>
                            {/* <div style={{width:'18.5%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <Button loading={loadingStory} onClick={onSearch} style={{width:'90%',height:'100%',border:'none',borderRadius:'5.5px',backgroundColor:'rgb(34, 34, 34)'}}>
                                    <SendOutlined />
                                </Button>
                            </div> */}
                        </div>
                    )
                }}
            </Dropzone>
        </React.Fragment>
    )
}

export default ImageUpload;