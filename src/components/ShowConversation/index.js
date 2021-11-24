import React from 'react';
import ConversationComponent from './ConversationComponent';
import InputComponent from './InputComponent';
import {Row,Col,Layout} from 'antd';

const {Content}=Layout;

const ConversationIndex = ()=>{
    return(
        <React.Fragment>
            <Content style={{width:'100%',height:'100%'}}>
                <Row style={{width:'100%',height:'100%'}}>
                    <Col style={{overflowY:'scroll',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',border:'1px solid #454545',borderRadius:'10px',height:'77.5%'}} xs={24}>
                        <ConversationComponent/>
                    </Col>
                    <Col style={{height:'20%'}} xs={24}>
                        <InputComponent/>
                    </Col>
                </Row>
            </Content>
        </React.Fragment>
    )
}

export default ConversationIndex;