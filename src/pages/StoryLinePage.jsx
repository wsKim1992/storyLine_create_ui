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
                    <Col md={4} style={{height:'auto'}}>
                        <SideComponent/>
                    </Col>
                    <Col md={16} style={{height:'100%'}}>
                        <ShowConverasation/>
                    </Col>
                    <Col md={4} style={{height:'auto'}}>
                        <SideComponent/>
                    </Col>
                </Row>
            </Layout>
        </>
    )
}

export default StoryLinePage;