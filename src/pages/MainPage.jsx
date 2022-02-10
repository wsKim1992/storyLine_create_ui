import React,{useEffect,useCallback} from 'react';
import { Link , useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '../include/bootstrap';

const StyledMainPageWrap = styled.div`
    display:block;
    width:100%;height:100%;
`;

const StyledH2 = styled.h2`
    font-family:wt021;
    margin:0;
    font-size:13em;
    color:#fff;
`

const MainPage = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        $('.carousel').carousel({
            interval: 1000 //changes the speed
        })
    },[])

    const onClickStartService = ()=>{
        navigate("/creating_story",{replace:true});
    }

    return (
        <StyledMainPageWrap>
            <header>
                <div className="top_cover">
                    <div className="con_center">
                        <div className="box_line">
                            <div className="top_logo">
                                <img src="/assets/img/logo.png" />
                            </div>
                        </div>
                        <div className="box_line"></div>
                        <div className="box_line"></div>
                        <div className="box_line"></div>
                        <div className="box_line"></div>
                    </div>
                </div>
            </header>

            <div className="container-wrap">
                <div className="containts_cover">
                    <div className="visual_text">
                        <h1 style={{fontFamily: 'Metal-Regular',margin:0,fontSize:'6em',color:"#fff"}}>Welcome to</h1>
                        <h2 style={{fontFamily: 'wt021',margin:0,color:"#fff"}}>
                            AI作
                        </h2>
                    </div>
                    <div className="con_center">
                        <div className="box_line"></div>
                        <div className="box_line"></div>
                        <div className="box_line"></div>
                        <div className="box_line">
                            <div className="start_menu">
                                <div className="start_menu_con">
                                </div>
                                <div className="start_menu_con">
                                    <div style={{margin:0}} className="start_menu_text">
                                        <p style={{margin:0}}>AI 웹소설</p>
                                        <p style={{margin:'3px'}}>창작 서비스</p>
                                    </div>
                                    <a onClick={onClickStartService} className="start_btn">
                                        시작하기
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="box_line"></div>
                    </div>
                </div>

                <div id="slide_Carousel" className="carousel slide">

                    <ol className="carousel-indicators">
                        <li data-target="#slide_Carousel" data-slide-to="0" className="active"></li>
                        <li data-target="#slide_Carousel" data-slide-to="1"></li>
                    </ol>

                    <div className="carousel-inner">
                        <div className="item active">
                            <div className="fill" style={{backgroundImage:"url('/assets/img/novel_main_001.jpg')"}}></div>
                        </div>
                        <div className="item">
                            <div className="fill" style={{backgroundImage:"url('/assets/img/novel_main_002.jpg')"}}></div>
                        </div>
                    </div>
                </div>

                {/* <a className="left carousel-control" href="#myCarousel" data-slide="prev">
                    <span className="icon-prev"></span>
                </a>
                <a className="right carousel-control" href="#myCarousel" data-slide="next">
                    <span className="icon-next"></span>
                </a> */}

                <footer>
                    <div className="copy_text">
                        <p>Copyright &copy;  2022. AI-zac. All rights reserved.</p>
                    </div>
                    <div className="bottom_cover">
                        <div className="con_center">
                            <div className="box_line"></div>
                            <div className="box_line"></div>
                            <div className="box_line"></div>
                            <div className="box_line"></div>
                            <div className="box_line"></div>
                        </div>
                    </div>
                </footer>

            </div>
        </StyledMainPageWrap>
    )
}

export default MainPage;