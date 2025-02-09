import { useState, useEffect } from "react";
import homebg from "../assets/vedio/koyal_bg.mp4";
import sectionbg from "../assets/vedio/section_bg.mp4";


import logo from "../assets/images/Nav.svg";
import mit from "../assets/images/mit.png";
import meta from "../assets/images/Meta.png";
import cali from "../assets/images/cali.png";
import Realstic from "../assets/vedio/realistic_video_drake.mp4";
import Cartoon from "../assets/vedio/cartoon_video_soumya.mp4";
import Sketch from "../assets/vedio/sketch_video_prakhar.mp4";
import bgcircle from "../assets/images/bgcircle.png";
import bgcirclewhite from "../assets/images/bgcirclewhite.png";
import arrow from "../assets/images/Vector5.svg"

import usecaseimg from "../assets/images/usecase.png";
import usecaseimgright from "../assets/images/usecaseright.png";
import usecaseimgleft from "../assets/images/usecaseleft.png";
import charcha1 from "../assets/images/drake_koyal_charcha.png";
import charcha01 from "../assets/images/drake_anime.png";
import charcha02 from "../assets/images/drake_real.png";
import charcha03 from "../assets/images/drake_sketch.png";


import instagramicon from "../assets/images/instagram.png";
import twittericon from "../assets/images/twitter.png";
import readcvicon from "../assets/images/readcv.png";
import discardicon from "../assets/images/discard.png";


const images = {
  Realistic: Realstic,
  Cartoon: Cartoon,
  Sketch: Sketch,
};
const charachaImages = [charcha01, charcha02, charcha03]

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeStyle, setActiveStyle] = useState("Realistic"); // Default active button
  const styles = Object.keys(images);
  const [activeOption, setActiveOption] = useState("advertisers");


  const handleNext = () => {
    const currentIndex = styles.indexOf(activeStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setActiveStyle(styles[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = styles.indexOf(activeStyle);
    const prevIndex = (currentIndex - 1 + styles.length) % styles.length;
    setActiveStyle(styles[prevIndex]);
  };
  const [activeSection, setActiveSection] = useState("");



  const handleScroll = (id) => {
    setActiveSection(id);
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative h-screen overflow-y-hidden">
      {/* Background Video */}
      {/* Inline Menu (Sticky) */}
      <div className="fixed top-4 right-4 bg-white backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-4 z-50 shadow-lg">
        <span
          className="text-sm cursor-pointer text-black font-semibold"
          onClick={() => handleScroll("section1")}
        >
          Use cases
        </span>
        <span
          className="text-sm cursor-pointer text-black font-semibold"
          onClick={() => handleScroll("section2")}
        >
          C.H.A.R.C.H.A.
        </span>
        <button
          className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
          onClick={() => setModalOpen(true)}
        >
          Join our waitlist
        </button>

        {/* Modal Component */}

      </div>
      <div className="h-screen overflow-y-scroll snap-start snap-mandatory">
        {/* Section 1 */}
        <section
          id="section0"
          className="relative flex flex-col justify-start "
        >
          <div className="absolute w-full h-full bg-white bg-opacity-10"></div>

          {/* Navbar */}
          <nav className="absolute z-10 w-full bg-transparent text-white">
            <div className="container mx-auto pr-[18rem] px-2 py-1 flex  items-center">
              {/* Logo (Left Aligned) */}
              <div className="flex items-center space-x-4">
                <img src={logo} alt="Logo" className="w-30 h-13" />
              </div>

              {/* Powered By Section (Centered) */}
              <div className="hidden md:flex inset-x-0 mx-auto w-max bg-black/30 backdrop-blur-md px-6 py-2 rounded-full items-center space-x-4">
                <span className="text-sm font-medium text-gray-200">
                  Powered by researchers from
                </span>
                <span className="text-gray-200">—</span>
                <div className="flex space-x-2 items-center">
                  <img
                    src={mit}
                    alt="MIT"
                    className="w-20 h-10 object-contain opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() => window.open("https://web.mit.edu/", "_blank")}
                  />

                  <img
                    src={meta}
                    alt="Meta"
                    className="w-20 h-10 object-contain opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() => window.open("https://about.meta.com/", "_blank")}
                  />

                  <img
                    src={cali}
                    alt="CMU"
                    className="w-20 h-10 object-contain opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() => window.open("https://www.cmu.edu/", "_blank")}
                  />
                </div>
              </div>
            </div>
          </nav>

          <video
            className="absolute top-0 left-0 w-full h-auto object-cover"
            autoPlay
            loop
            muted
          >
            <source src={homebg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <WaitingListModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
          {/* Subsection 1 */}
          <div className=" flex flex-col justify-center items-start px-20 snap-start pt-40">
            {/* Left-aligned heading with 30% blank space on the right */}
            <div className="flex flex-row w-full">
              <div className="w-[100%] z-10">
                <h1 className="text-[80px] font-inter font-bold leading-[83px] tracking-[-4.6px] text-white">
                  Turn your audio into engaging storytelling video with consistent characters and scenes using Koyal
                </h1>
                <hr className="w-[38%] mt-2 border-2" />
                <p className=" w-[40%] font-inter mt-6 text-[60px]leading-[45px] text-white">
                  Koyal's AI-powered platform allows you to seamlessly convert audio
                  into personalized, visually compelling stories. With its suite of multimodal AI generation and translation models,
                  Koyal generates custom characters, settings,
                  and animations that maintain a cohesive aesthetic throughout your
                  video content.
                </p>
                <div className="mt-8 flex flex-wrap space-x-4">
                  {/* View demo button */}
                  {/* <button className="border border-white text-white px-6 py-3 rounded-full hover:bg-gray-200 hover:text-black transition">
                    View demo
                  </button> */}
                  {/* Join our waitlist button */}
                  <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
                    onClick={() => setModalOpen(true)}>
                    Join our waitlist
                  </button>
                </div>

              </div>
              <div className="w-[30%]"></div>
            </div>
          </div>
          {/* Subsection 4 */}
          <div className="relative h-[40vh] flex flex-col justify-center items-center mt-[50rem] px-8 snap-start bg-cover bg-center">
            {/* Subsection 1 - Heading & Description */}
            <div className="text-center w-[50%]"> {/* 3rem gap */}
              <p className="text-[17.02px] leading-[46.17px] tracking-[0px] font-medium text-center font-inter text-white">
                Styles
              </p>
              <h4 className="text-[46.2px] leading-[46.17px] tracking-[-2.309px] font-normal text-center font-inter text-white">
                Koyal generates personalized narrative-driven videos from your audio in a variety of engaging styles:
              </h4>
            </div>
          </div>
          <div className="relative flex flex-col justify-center items-center  snap-start bg-cover bg-center max-h-[70vh]">
            {/* Buttons & Image Display */}
            <div className="relative flex flex-col items-center ">

              {/* Buttons */}
              <div className="flex">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setActiveStyle(style)}
                    className={`px-6 py-2 text-[17.02px] font-bold tracking-[0px] text-center font-inter rounded-2xl transition-all
            ${activeStyle === style
                        ? "bg-white/30 text-white backdrop-blur-md"
                        : "bg-transparent text-gray-500 hover:text-gray-300"
                      }`}
                    style={{
                      padding: "10px 24px",
                      borderColor: activeStyle === style ? "rgba(255, 255, 255, 0.5)" : "transparent",
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>

              {/* Video Display Section */}
              <div className="rounded-lg overflow-hidden w-[50rem] h-[40rem] flex items-center justify-center p-10 relative">
                <VideoPlayer videoSrc={images[activeStyle]} className="pointer-events-auto" />

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevious}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-white/30 transition-all border border-white/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={handleNext}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-white/30 transition-all border border-white/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>




        </section>
        {/* Section 2 */}
        <section
          id="section1"
          className="relative flex flex-col items-center justify-center px-20 py-10 bg-[#f9f6f1] text-black"
        >
          {/* Background Circles */}
          <div className="absolute z-10 top-0 w-[60%]  flex justify-center items-center overflow-hidden">
            <img
              src={bgcircle}
              alt="Background Circles"
              className="w-[100%]"
            />
          </div>

          {/* Heading Section */}
          <div className="text-center mt-6 relative z-10">
            <p className="text-[17.02px] font-medium leading-[46.17px] tracking-[0px] text-center  font-inter text-gray-600 ">
              Use cases
            </p>
            <div className="flex items-center justify-center">
              <h2 className="text-[46.2px] font-light leading-[46.17px] tracking-[-2.309px]  text-center font-inter w-[50%]">
                Turn ideas into content easily. The possibilities with Koyal are endless -
                from short-form social videos to professional ads.
              </h2>
            </div>
          </div>

          {/* Two-Column Section */}
          <div className="flex flex-wrap w-full m-[5rem]  relative z-10">
            {/* Left Column: Expandable Options */}
            <div className="w-full md:w-1/2 pr-12 ">
              {/* Option 1 */}
              <div className="border-b border-gray-300 pb-8 mb-12">
                <button
                  className="w-full flex justify-between items-center text-[43.13px] font-bold leading-[46.17px] tracking-[-2.309px] font-inter focus:outline-none"
                  onClick={() => setActiveOption("advertisers")}
                >
                  Advertisers
                  <span>
                    {activeOption === "advertisers" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 11l5-5 5 5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 13l5 5 5-5"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                {activeOption === "advertisers" && (
                  <p className="text-[22.46px] font-normal leading-[27.6px] tracking-[-1.38px] font-inter text-gray-600 mt-4">
                    Produce on-brand video content as well as client testimonials.
                  </p>
                )}
              </div>

              {/* Option 2 */}
              <div className="border-b border-gray-300 pb-8 mb-8">
                <button
                  className="w-full flex justify-between items-center text-[43.13px] font-bold leading-[46.17px] tracking-[-2.309px] font-inter focus:outline-none"
                  onClick={() => setActiveOption("podcasters")}
                >
                  Podcasters
                  <span>
                    {activeOption === "podcasters" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 11l5-5 5 5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 13l5 5 5-5"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                {activeOption === "podcasters" && (
                  <p className="text-[22.46px] font-normal leading-[27.6px] tracking-[-1.38px] font-inter text-gray-600 mt-4">
                    Enhance your podcast visuals with stunning AI-driven animations.
                  </p>
                )}
              </div>

              {/* Option 3 */}
              <div className="border-b border-gray-300 pb-8 mb-10">
                <button
                  className="w-full flex justify-between items-center text-[43.13px] font-bold leading-[46.17px] tracking-[-2.309px] font-inter focus:outline-none"
                  onClick={() => setActiveOption("musicians")}
                >
                  Musicians
                  <span>
                    {activeOption === "musicians" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 11l5-5 5 5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 13l5 5 5-5"
                        />
                      </svg>
                    )}
                  </span>
                </button>
                {activeOption === "musicians" && (
                  <p className="text-[22.46px] font-normal leading-[27.6px] tracking-[-1.38px] font-inter text-gray-600 mt-4">
                    Create visual stories for your songs that captivate audiences.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Dynamic Image Display */}
            <div className="w-full md:w-1/2 flex justify-center items-center p-4">
              {activeOption === "advertisers" && (
                <VideoPlayer videoSrc={Cartoon} />
              )}
              {activeOption === "podcasters" && (
                <VideoPlayer videoSrc={Sketch} />
              )}
              {activeOption === "musicians" && (
                <VideoPlayer videoSrc={Realstic} />
              )}
            </div>
          </div>

          {/* Footer Section */}


          <div className="relative flex items-center justify-center m-[8rem]   w-full px-4">
            {/* Left Image (Background) */}
            <img
              src={usecaseimgright}
              alt="Left"
              className="absolute left-[25%]  w-40 h-40 object-cover opacity-50"
            />

            {/* Right Image (Background) */}
            <img
              src={usecaseimgleft}
              alt="Right"
              className="absolute right-[25%] w-40 h-40 object-cover opacity-60"
            />

            {/* Text */}
            <p className="relative z-10 text-[43.13px] font-light leading-[46.17px] tracking-[-2.309px] text-center font-inter w-[50%]">
              Sky is the limit <br /> for the use cases...
            </p>
          </div>

        </section>

        <section
          id="section2"
          className="relative flex flex-col items-center px-8 py-16 bg-black text-white"
        >
          <div className="absolute top-0 w-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center overflow-hidden">
            <img
              src={bgcirclewhite}
              alt="Background Circles"
              className="w-full h-auto filter"
            />
          </div>

          {/* Heading Section */}
          <div className="text-center relative z-10 mb-16 w-[50%]">
            {/* Top Label */}
            <p className="text-[17.02px] font-medium leading-[46.17px] tracking-[0px] text-center font-inter text-gray-400 mb-4">
              Personalize your videos
            </p>

            {/* Heading */}
            <h2 className="text-[46.2px] font-light leading-[46.17px] tracking-[-2.309px] text-center font-inter">
              Inject yourself into the videos with{" "}
              <span className="text-yellow-400">
                C.H.A.R.C.H.A.
              </span>
              <span className="inline-flex items-center space-x-2">
                {/* Arrow Image (Immediately After C.H.A.R.C.H.A.) */}
                <img src={arrow} className="w-10 h-10 inline-block" alt="Arrow" />
              </span>

              {/* Patent Pending (Positioned Below the Arrow) */}
              <div className="flex justify-end mt-[-10px] mr-20">
                <span
                  className="text-[16px] font-normal tracking-[0px] italic text-yellow-400"
                  style={{ fontFamily: "Gloria Hallelujah" }}
                >
                  Patent pending ⏳
                </span>
              </div>
            </h2>

            {/* Description */}
            <p className="mt-6 text-[22.46px] font-normal leading-[27.6px] tracking-[-0.72px] text-center font-inter max-w-3xl mx-auto">
              <span className="text-gray-400">
                It stands for Computer Human Assessment for Recreating Characters with Human Actions.
              </span>{" "}
              <span className="text-white">
                It generates personalized videos with your avatar. Upload clips — our AI creates on-brand visuals featuring you.
              </span>
            </p>
          </div>

          {/* Content Row 1 */}
          <div className="bg-zinc-900 text-white py-16 rounded-xl shadow-lg">
            {/* Content Row 1 */}
            <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-6xl mx-auto mb-16 space-y-8 lg:space-y-0">
              {/* Left Content */}
              <div className="w-full lg:w-[45%]  p-6 rounded-lg shadow-lg">
                <h3 className="text-[43.13px] font-bold leading-[46.17px] tracking-[-2.309px] font-inter mb-4">
                  Validate your identity in one minute with C.H.A.R.C.H.A.
                </h3>

              </div>

              {/* Right Content */}
              <div className="w-full lg:w-[45%]  p-6 rounded-lg shadow-lg">
                <div className="relative">
                  <img
                    src={charcha1}
                    alt="Action Instruction"
                    className="rounded-lg w-full"
                  />
                </div>
              </div>
            </div>

            {/* Content Row 2 */}
            <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-6xl mx-auto space-y-8 lg:space-y-0">

              <div className="w-full lg:w-[45%] p-6 rounded-lg shadow-lg">
                <AutoImageSlider images={charachaImages} />
              </div>

              {/* Right Content */}
              <div className="w-full lg:w-[45%]  p-6 rounded-lg shadow-lg">
                <h3 className="text-[43.13px] font-bold leading-[46.17px] tracking-[-2.309px] font-inter mb-4">
                  Select from your generated avatars to use for the final video
                </h3>
              </div>
            </div>
          </div>
        </section>

        <section id="section3" className="relative w-full h-[70vh] overflow-hidden">
          {/* Background Video */}
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
          >
            <source src={sectionbg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1
              className="text-[50.7px] font-bold leading-[55.72px] tracking-[-2.786px] text-center font-inter w-[50%] mx-auto"
            >
              The new age of video<br /> creation  starts here
            </h1>
            <button className="px-6 py-3 bg-white text-black rounded-full  m-4 font-semibold hover:bg-gray-200"
              onClick={() => setModalOpen(true)}>
              Join our waitlist
            </button>
          </div>

        </section>

        {/* Footer Section */}
        <footer className="bg-black text-white py-16 px-8 relative h-[50vh]">
          {/* Background Circles */}
          <div className="absolute top-0 left-0 w-[100%] h-[100%] overflow-hidden z-0">
            <img
              src={bgcirclewhite}
              alt="Background Circles"
              className="w-[50%] h-full object-cover translate-x-[-25%]"
            />
          </div>


          <div className="max-w-6xl mx-auto flex flex-col gap-16 relative z-10">
            {/* Upper Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start">
              {/* Left Section: Logo and Button */}
              <div className="flex flex-col items-start space-y-6">
                <div className="flex items-center space-x-2">
                  <img src={logo} alt="Logo" className="w-25 h-12 object-contain" />
                </div>
                <p className="text-[15px] font-medium text-gray-400 font-inter">
                  Turn audio to video seamlessly
                </p>
                <button className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200"
                  onClick={() => setModalOpen(true)}>
                  Join the waitlist
                </button>
              </div>

              {/* Right Section: Menus */}
              <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-16 m-10    lg:mt-0">
                {/* Company Links */}
                <div className="space-y-10">
                  <h4 className="text-white-100 text-sm uppercase tracking-wider">
                    Company
                  </h4>
                  <ul className="space-y-6">
                    <li>
                      <a href="#" className="text-gray-400 text-sm hover:underline" onClick={() => handleScroll("section0")}>
                        About us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 text-sm hover:underline" onClick={() => handleScroll("section1")}>
                        Use cases
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 text-sm hover:underline" onClick={() => handleScroll("section2")}>
                        C.H.A.R.C.H.A
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Legal Links */}
                <div className="space-y-10">
                  <h4 className="text-white-100 text-sm uppercase tracking-wider">
                    Legal
                  </h4>
                  <ul className="space-y-6">
                    <li>
                      <a href="#" className="text-gray-400 text-sm hover:underline">
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 text-sm hover:underline">
                        Terms
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-center w-full">
              {/* Left Aligned Text */}
              <p className="text-[15px] font-medium leading-[24px] tracking-[0px] text-gray-400 font-inter">
                ©2025 koyal.ai copyright
              </p>

              {/* Right Aligned Icons */}
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-gray-400">
                  <img src={twittericon} alt="Twitter" className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-gray-400">
                  <img src={readcvicon} alt="Doc" className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-gray-400">
                  <img src={discardicon} alt="Discord" className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-gray-400">
                  <img src={instagramicon} alt="Instagram" className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;


const WaitingListModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Reset on unmount
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("https://koyal.ai/api/api/public/createWaitingList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage("✅ Thank you for registering! We will contact you soon.");
        // Only reset fields on success
        setName("");
        setEmail("");
        setMobile("");

      } else {
        setError(result.message || "❌ Something went wrong. Try again.");
      }
    } catch (error) {
      setError("❌ Error submitting the form. Please try again.");
    }

    setLoading(false);
  };

  const handleClose = () => {
    setMessage("");
    setError("");
    setName("");
    setEmail("");
    setMobile("");
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-lg z-50"
      onClick={handleClose} // Close when clicking outside
    >
      {/* Modal Container */}
      <div
        className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative z-50 border border-white/20"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-white hover:text-gray-300 text-xl"
          onClick={handleClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold text-white text-center mb-4">Join Our Waitlist</h2>

        {/* Success / Error Message */}
        {message && <p className="text-center text-green-400 font-medium">{message}</p>}
        {error && <p className="text-center text-red-400 font-medium">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-white">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-white outline-none text-white placeholder-gray-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-white">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-white outline-none text-white placeholder-gray-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Mobile Number Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-white">
              Mobile Number (Optional)
            </label>
            <input
              type="tel"
              className="w-full p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-white outline-none text-white placeholder-gray-200"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white/20 text-white py-3 rounded-lg hover:bg-white/30 transition duration-200 border border-white/30"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Join Waitlist"}
          </button>
        </form>
      </div>
    </div>
  );
};




const VideoPlayer = ({ videoSrc }) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative z-50 w-[25rem] h-[25rem] bg-black rounded-2xl overflow-hidden">
      {/* Video Element */}
      <video
        src={videoSrc}
        autoPlay
        loop
        muted={isMuted}
        className="w-full h-full object-cover"
      />

      {/* Sound Toggle Button - iPhone Style */}
      <button
        className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center w-12 h-12 shadow-lg transition-all hover:bg-white/30"
        onClick={() => setIsMuted(!isMuted)}
      >
        <img
          src={isMuted ? "https://cdn-icons-png.flaticon.com/512/727/727240.png" : "https://cdn-icons-png.flaticon.com/512/727/727269.png"}
          alt={isMuted ? "Muted" : "Unmuted"}
          className="w-6 h-6 filter invert"
        />
      </button>
    </div>
  );
};





const AutoImageSlider = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(slideInterval);
  }, [images.length, interval]);

  return (
    <div className="w-full rounded-lg shadow-lg overflow-hidden">
      {/* Image Display */}
      <img
        src={images[currentIndex]}
        alt="Sliding Images"
        className="rounded-lg w-full transition-all duration-700 ease-in-out object-cover"
      />

      {/* Dots Navigation (Placed Below Image) */}
      <div className="flex justify-center mt-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all mx-1 ${currentIndex === index ? "bg-white w-4 h-4" : "bg-gray-300"
              }`}
          />
        ))}
      </div>
    </div>
  );
};
