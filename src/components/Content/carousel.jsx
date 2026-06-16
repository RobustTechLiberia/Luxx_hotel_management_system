import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import image1 from "../../assets/images/Z (6).jpeg";
import image2 from "../../assets/images/Z (7).jpeg";
import image3 from "../../assets/images/Z (6).jpeg";

const SlideShow = () => {
  return (
    <Carousel
      showStatus={false}
      showIndicators={false}
      showThumbs={true}
      showArrows={false}
    >
      <div>
        <img
          src={image1}
          alt="Royal Grand Hotel"
          className="object-cover  md:rounded-none border-none"
        />
      </div>
      <div>
        <img
          src={image2}
          alt=""
          className="object-cover md:rounded-none border-none"
        />
      </div>
      <div>
        <img
          src={image3}
          alt=""
          className="object-cover md:rounded-none border-none"
        />
      </div>
    </Carousel>
  );
};

export default SlideShow;
