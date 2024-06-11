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
                fontSize: "20pt",
                fontWeight: "600",
              }}
            >
              당신의 꿈을 이루기 위한 첫 걸음,
            </h3>
            <p
              style={{
                color: "#6E7783",
                fontSize: "30pt",
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
              width={"300px"}
              alt="AI Robot"
            ></img>
          </div>
        </div>
        <div>
          <h3>Slide 2</h3>
          <p>테스트 내용 2</p>
        </div>
        <div>
          <h3>Slide 3</h3>
          <p>테스트 내용 3</p>
        </div>
      </Slider>
    </>
  );
};

export default MainComponent;
