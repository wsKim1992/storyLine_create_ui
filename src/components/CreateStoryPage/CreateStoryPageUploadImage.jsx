import React,{useState,useEffect,useRef,useContext} from 'react';
import { useCallback } from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import {PictureOutlined,CloseOutlined} from '@ant-design/icons';
import {CHANGE_STORYPAGE_COVER,StoryPageContext} from '../../pages/CreatingStoryPage';

const StyledImageWrap = styled.div`
    width: 100%;
    height:100%;
    background-color:#454545;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    position: absolute;
    z-index: 500;
`;

const StyledDropZoneContainer=styled.div`
    height:74.6vh;
    width:55.9vh;
    @media screen and (max-width:380px){
        height:81vh;
        width:60.75vh;
     }
`

const StyledDropZone = styled(Dropzone)`
    height:100%;
    width:100%;
    border:1px solid #000;
`;

const StyledDropZoneDiv = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    height:100%;
    width:100%;
`;

const StyledIconWrap = styled.p`
    width:100%;
    height:auto;
    font-size:30.5px;
    display:flex;
    justify-content:center;
    align-items:center;
    margin:0;
`
const StyledIconWrapCloseBtn=styled.p`
    position:absolute;
    top:3.5%;right:3%;
    width:30px;
    height:30px;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    font-size:23.5px;
    cursor:pointer;
    z-index: 510;
    color:#fff;
    margin:0;
    color:#fff;
    background-color:rgba(45,45,45,0.7);
    border-radius:50%;
`;

const StyledImage=styled.img`
    display:block;
    height: 74.6vh;
    width : 55.9vh;
`

const getFileBase64=(file,dropZoneElement)=>{
    return new Promise((resolve,reject)=>{
        if(!file.type.match('image/*')){
            reject({message:'이미지 파일 (.jpg,.png,.jpeg 파일을 업로드 해주세요!!)'});
        }else{
            const fileReader = new FileReader();
            fileReader.onload=(evt)=>{
                const tempImage = new Image();
                tempImage.src = evt.target.result;
                tempImage.onload = ()=>{
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.height = parseFloat(document.defaultView.getComputedStyle(dropZoneElement).height);
                    tempCanvas.width = parseFloat(document.defaultView.getComputedStyle(dropZoneElement).width);
                    const ctx = tempCanvas.getContext('2d');

                    ctx.drawImage(tempImage,0,0
                        ,tempCanvas.width
                        ,tempCanvas.height
                    );
                    resolve(tempCanvas.toDataURL('image/png'));
                }
            }
            fileReader.readAsDataURL(file);
        }
    })
}

const CreateStoryPageUploadImage = ({setIsShowLoadBookCoverUpload})=>{

    const dropzoneRef = useRef(null);
    const [imageSrc,setImageSrc] = useState(null);
    const {dispatch} = useContext(StoryPageContext);

    useEffect(()=>{
        if(imageSrc){
            dispatch({type:CHANGE_STORYPAGE_COVER,storypage_cover:imageSrc});
        }
    },[imageSrc])

    const onDrop = useCallback(async(acceptedFiles,rejectedFiles)=>{
        if(Object.keys(rejectedFiles).length!=0){
            alert('이미지 파일 (.jpg,.png,.jpeg 파일을 업로드 해주세요!!)');
            return false;
        }
        try{
            const fileSrcList = await Promise.all(acceptedFiles.map(async ele=>{
                return await getFileBase64(ele,dropzoneRef.current);
            }))
            setImageSrc(fileSrcList[0]);
        }catch(err){
            console.error(err.message)
            alert(err.message);
        }
    },[dropzoneRef.current])

    const onClickCloseBtn = useCallback((evt)=>{
        evt.preventDefault();
        evt.stopPropagation();
        setIsShowLoadBookCoverUpload(false);
    })

    return (
        <StyledImageWrap>
            <StyledDropZoneContainer ref={dropzoneRef}>
            {
                <StyledDropZone
                    multiple={false}
                    accept="image/*"
                    onDrop={(acceptedFiles,rejectedFiles)=>onDrop(acceptedFiles,rejectedFiles)}
                >
                    {({getRootProps,getInputProps,isDragAccept,isDragReject})=>(
                        <StyledDropZoneDiv {...getRootProps()}>
                            <StyledIconWrapCloseBtn onClick={onClickCloseBtn}>
                                <CloseOutlined />
                            </StyledIconWrapCloseBtn>
                            <input {...getInputProps()}/>
                            {
                                imageSrc?
                                <StyledImage src={imageSrc} />
                                :(
                                    <div>
                                        <StyledIconWrap>
                                            <PictureOutlined />
                                        </StyledIconWrap>
                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                    </div>
                                )
                            }
                        </StyledDropZoneDiv>
                    )}
                </StyledDropZone>
            }
            </StyledDropZoneContainer>
        </StyledImageWrap>
    )
}

export default CreateStoryPageUploadImage;