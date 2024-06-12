import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MainComponent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <>
      <Slider {...settings}>
        <div className="slider1">
          <div className="slider1_left">
            <h3
              style={{
                color: "#9DC3C1",
                fontSize: "15pt",
                fontWeight: "600",
              }}
            >
              당신의 꿈을 이루기 위한 첫 걸음,
            </h3>
            <p
              style={{
                color: "#6E7783",
                fontSize: "25pt",
                fontWeight: "900",
              }}
            >
              똑똑한 인재 관리 AI파트너 NAIN
            </p>
          </div>
          <div className="slider1_right">
            <img
              className="AIrobot"
              src="/image/AIrobot.png"
              width={"250px"}
              alt="AI Robot"
            ></img>
          </div>
        </div>
        <div className="slider1">
          <div className="slider1_left">
            <h3
              style={{
                color: "#9DC3C1",
                fontSize: "15pt",
                fontWeight: "600",
              }}
            >
              당신의 꿈을 이루기 위한 첫 걸음,
            </h3>
            <p
              style={{
                color: "#6E7783",
                fontSize: "25pt",
                fontWeight: "900",
              }}
            >
              똑똑한 인재 관리 AI파트너 NAIN
            </p>
          </div>
          <div className="slider1_right">
            <img
              className="AIrobot"
              src="/image/AIrobot.png"
              width={"250px"}
              alt="AI Robot"
            ></img>
          </div>
        </div>
        <div className="slider1">
          <div className="slider1_left">
            <h3
              style={{
                color: "#9DC3C1",
                fontSize: "15pt",
                fontWeight: "600",
              }}
            >
              당신의 꿈을 이루기 위한 첫 걸음,
            </h3>
            <p
              style={{
                color: "#6E7783",
                fontSize: "25pt",
                fontWeight: "900",
              }}
            >
              똑똑한 인재 관리 AI파트너 NAIN
            </p>
          </div>
          <div className="slider1_right">
            <img
              className="AIrobot"
              src="/image/AIrobot.png"
              width={"250px"}
              alt="AI Robot"
            ></img>
          </div>
        </div>
      </Slider>
      <div className="middle_word">
        <h1
          style={{
            color: "#6E7783",
            fontSize: "25pt",
            fontWeight: "900",
          }}
        >
          꼼꼼한 평가와 철저한 관리로 채용까지
        </h1>
        <h3
          style={{
            color: "#6E7783",
            fontSize: "14pt",
            fontWeight: "600",
            margin: "30px",
          }}
        >
          내 역량을 잘 표현할 수 있도록 이력서부터 면접까지 관리하여 돋보이는
          개발자로 만들어드립니다.
        </h3>
      </div>
      <div className="resume_banner">
        <div className="resume_image">
          <img
            className="ResumeImage"
            src="/image/ResumeImage.png"
            width={"320px"}
            alt="ResumeImage"
          ></img>
        </div>
        <div className="resume_word">
          <h1
            style={{
              color: "#6E7783",
              fontSize: "17pt",
              fontWeight: "900",
              margin: "30px, 0px;",
            }}
          >
            나만의 이력서 매니저
          </h1>
          <ul
            style={{
              color: "#6E7783",
              fontSize: "14pt",
              fontWeight: "600",
            }}
          >
            <li>이력서 작성</li>
            <li>이력서 관리</li>
            <li>합격자 이력서 공유</li>
            <li>합격 키워드 분석</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MainComponent;
