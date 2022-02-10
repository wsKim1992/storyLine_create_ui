import React from 'react';
import SideComponent from '../components/SideComponent';
import ShowConverasation from '../components/ShowConversation';
import { PageHeader,Layout,Row,Col } from 'antd';
import CommonHeader from '../components/CommonHeader';
import styled from 'styled-components';

const StyledStorylineWrap = styled(Row)`
    width:100%;
    height:92.5%;
    background-image:url(/assets/img/novel_main_002.jpg);
`;

const StoryLinePage = ()=>{
    return (
        <Layout style={{width:'100%',height:'100%',backgroundColor:'rgb(18, 18, 18)'}}>
            <CommonHeader title={'스토리 생성과 편집'} onClickNextFunc={null}/>
            <StyledStorylineWrap >
            <Col md={4} style={{width:'100%',height:'auto'}}>
                    <SideComponent/>
                </Col>
                <Col md={16} style={{width:'100%',height:'100%'}}>
                    <ShowConverasation/>
                </Col>
                <Col md={4} style={{width:'100%',height:'auto'}}>
                    <SideComponent/>
                </Col>
            </StyledStorylineWrap>
        </Layout>
        
    )
}

export default StoryLinePage;