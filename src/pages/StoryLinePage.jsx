import React from 'react';
import SideComponent from '../components/SideComponent';
import ShowConverasation from '../components/ShowConversation';
import { PageHeader,Layout,Row,Col } from 'antd';
import 'antd/dist/antd.css';

const StoryLinePage = ()=>{
    return (
        <>
            <Layout style={{height:'100%',backgroundColor:'rgb(18, 18, 18)'}}>
                <PageHeader style={{height:'7.5%'}} title={'Stroy Creation GAME'}/>
                <Row style={{height:'92.5%'}} gutter={[16,16]}>
                    <Col xs={24} md={4} style={{height:'100%'}}>
                        <SideComponent/>
                    </Col>
                    <Col xs={24} md={16} style={{height:'100%'}}>
                        <ShowConverasation/>
                    </Col>
                    <Col xs={24} md={4} style={{height:'100%'}}>
                        <SideComponent/>
                    </Col>
                </Row>
            </Layout>
        </>
    )
}

export default StoryLinePage;