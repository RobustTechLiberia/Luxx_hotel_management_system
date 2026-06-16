import React from "react";
// import "../styles/stylings.scss";
import DemoCarousel from "./carousel";
class Banner extends React.Component {
  render() {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-8 bg-white px-4 pt-24 pb-6 sm:px-6 md:flex-row md:gap-0 md:px-8 md:pt-0 md:pb-0">
          <div className="w-full max-w-xl bg-white md:h-96">
            <h1 className="mx-1 mt-2 text-4xl font-sans font-medium uppercase sm:mx-3 md:mx-3 md:mt-10 md:text-5xl">
              {/* <span className="text-sm">live</span>
              <br /> */}
              live in luxury <br /> with comfort &amp; style
            </h1>
            <p className="mx-1 py-2 font-sans front-normal sm:mx-3 md:mt-3 md:mx-3 md:max-w-lg">
              Eleifend et natoque quibusdam vivamus aute, labore labore, natus
              accusamus, laboris! Nunc, dui occaecati ante, pariatur.
              {/* Lobortis.Occaecat quasi dignissimos fugiat fringilla! Curabitur
              aliquam porro imperdiet magni lacus scelerisque. Integer
              exercitationem, mollitia dapibus esse do sagittis est ea nemo sit?
              Adipiscing! Voluptatibus! */}
            </p>
            <br />
            <div className="mx-1 py-0 sm:mx-3 md:mx-0 md:py-1">
              <a
                href="#discover"
                className="bg-amber-500 text-md rounded-sm cursor-pointer hover:bg-amber-400 font-sans px-8 py-3 capitalize"
              >
                discover
              </a>
            </div>
          </div>
          {/* carousel image */}
          <div className="h-auto w-full max-w-lg bg-white md:mt-32">
            <div className="mx-auto w-full rounded bg-white md:max-w-lg">
              <DemoCarousel />
              {/* <img src={image1} alt="" className="w-full h-full rounded" /> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Banner;
