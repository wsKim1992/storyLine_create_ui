import React from 'react';
import SideComponent from '../components/SideComponent';
import ShowConverasation from '../components/ShowConversation';
import { PageHeader,Layout,Row,Col } from 'antd';
import CommonHeader from '../components/CommonHeader';

const StoryLinePage = ()=>{
    return (
        <Layout style={{width:'100%',height:'100%',backgroundColor:'rgb(18, 18, 18)'}}>
            <CommonHeader title={'스토리 생성과 편집'} onClickNextFunc={null}/>
            <Row style={{width:'100%',height:'92.5%'}} gutter={[16,16]}>
                <Col md={4} style={{width:'100%',height:'auto'}}>
                    <SideComponent/>
                </Col>
                <Col md={16} style={{width:'100%',height:'100%'}}>
                    <ShowConverasation/>
                </Col>
                <Col md={4} style={{width:'100%',height:'auto'}}>
                    <SideComponent/>
                </Col>
            </Row>
        </Layout>
        
    )
}

export default StoryLinePage;