import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Slider.scss'


export default function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 4000,
    cssEase: "linear"
  };
  return (
    <div className='slider_wrap'>
      <Slider {...settings}>
        <div>
          <img className='pc' src="./img/img01.webp" alt="메인배너"/>
          <img className='mobile' src="./img/img01_m.webp" alt="메인배너_모바일"/>
        </div>
        <div>
          <img className='pc' src="./img/img02.webp" alt="메인배너"/>
          <img className='mobile' src="./img/img02_m.webp" alt="메인배너_모바일"/>
        </div>
        <div>
          <img className='pc' src="./img/img03.webp" alt="메인배너"/>
          <img className='mobile' src="./img/img03_m.webp" alt="메인배너_모바일"/>
        </div>
      </Slider>
      <div className='absolute w-full top-72 text-center'>
        <img className=' w-1/3 md:w-1/6 m-auto mb-4' src="./img/womens_polo_logo_white.svg" alt="배너_로고"/>
        <p className=' text-white text-5xl font-extrabold font-logofont'>Summer</p>
      </div>
    </div>

  );
}

/*
.wrap{
  position:relative;  
  .mobile { display:none }

  @media (max-width: 768px) {
    .mobile { display:block }
    .pc { display:none }
  }

  .slick-slider {
		.slick-arrow {
			border: none;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			z-index: 100;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, 0.6);

			&::after {
				content: "";
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				width: 25%;
				height: 25%;
				border-top: 2px solid #000;
			}
			&::before {
				display: none;
			}

			&.slick-prev {
				left: 20px;
				&::after {
					left: 55%;
					border-left: 2px solid #000;
					transform: translate(-50%, -50%) rotate(-45deg);
				}
			}
			&.slick-next {
				right: 20px;
				&::after {
					left: 45%;
					border-right: 2px solid #000;
					transform: translate(-50%, -50%) rotate(45deg);
				}
			}
		}	
	}
}

*/