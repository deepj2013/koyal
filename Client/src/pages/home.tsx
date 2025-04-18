import { useState, useEffect } from "react";
import homebg from "../assets/vedio/koyal_bg.mp4";
import sectionbg from "../assets/vedio/section_bg.mp4";

import logo from "../assets/images/koyal_nav.svg";
import mit from "../assets/images/mit.png";
import meta from "../assets/images/Meta.png";
import cali from "../assets/images/cali.png";
import Realstic from "../assets/vedio/clean_mehul_no_face_lipsync.mp4";
import Cartoon from "../assets/vedio/cartoon_video_soumya.mp4";
import Sketch from "../assets/vedio/sketch_video_prakhar.mp4";
import bgcircle from "../assets/images/bgcircle.png";
import bgcirclewhite from "../assets/images/bgcirclewhite.png";
import arrow from "../assets/images/Vector5.svg";

import usecaseimg from "../assets/images/usecase.png";
import usecaseimgright from "../assets/images/usecaseright.png";
import usecaseimgleft from "../assets/images/usecaseleft.png";
import charcha1 from "../assets/images/charcha_mehul.png";

import Real from "../assets/images/realistic_preview.png";
import Animated from "../assets/images/animated_preview.png";
import SketchImg from "../assets/images/sketch_preview.png";

import instagramicon from "../assets/images/instagram.png";
import twittericon from "../assets/images/twitter.png";
import readcvicon from "../assets/images/readcv.png";
import discardicon from "../assets/images/discard.png";
import "../styles/home.css";
import { TiThMenu } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { INSTAGRAM_URL } from "../utils/constants";
import { AutoImageSlider } from "../components/AutoImageSlider";
import { VideoPlayer } from "../components/VideoPlayer";
import AdvertiserSection from "../components/layouts/AdvertiserSection";
import Logo from "../components/common/Logo/Logo";
import VideoBackground from "../components/common/VideoBackground/VideoBackground";
import { config } from "../config/config";
import { WaitingListApiRoutes } from "../redux/environment/apiRoutes";

const images = {
  Realistic: Realstic,
  Cartoon: Cartoon,
  Sketch: Sketch,
};
const charachaImages = [Animated, Real, SketchImg];

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeStyle, setActiveStyle] = useState("Realistic"); // Default active button
  const styles = Object.keys(images);
  const [activeOption, setActiveOption] = useState("advertisers");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
    setActiveSection(id);
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative h-screen overflow-y-hidden">
      {/* Background Video */}
      {/* Inline Menu (Sticky) */}

      <div className="h-screen overflow-y-scroll snap-start snap-mandatory">
        {/* Section 1 */}
        <section
          id="section0"
          className="relative flex flex-col justify-start "
        >
          <div className="absolute w-full h-full bg-white bg-opacity-10"></div>

          {/* Navbar */}
          <nav className="absolute z-50 w-full bg-transparent text-white">
            <div className="mx-auto px-5 py-4 flex items-center justify-between">
              {/* Logo (Left Aligned) */}
              <div className="flex items-center space-x-4">
                <Logo />
              </div>

              {/* Powered By Section (Hidden on Mobile) */}
              <div className="hidden md:flex inset-x-0 mx-auto w-max bg-black/30 backdrop-blur-md px-4 md:px-6 py-2 rounded-full items-center space-x-3 md:space-x-4">
                <span className="text-sm md:text-[1.1rem] font-medium text-gray-200">
                 Powered by researchers from
                </span>
                <span className="text-gray-200">—</span>
                <div className="flex space-x-2 items-center">
                  <img
                    src={mit}
                    alt="MIT"
                    className="w-[60px] md:w-[80px] h-auto object-contain opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                      window.open("https://web.mit.edu/", "_blank")
                    }
                  />
                  <img
                    src={meta}
                    alt="Meta"
                    className="w-[60px] md:w-[80px] h-auto object-contain opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                      window.open("https://about.meta.com/", "_blank")
                    }
                  />
                  <img
                    src={cali}
                    alt="CMU"
                    className="w-[60px] md:w-[80px] h-auto object-contain opacity-80 hover:opacity-100 cursor-pointer"
                    onClick={() =>
                      window.open("https://www.cmu.edu/", "_blank")
                    }
                  />
                </div>
              </div>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center space-x-4 bg-white backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
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
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <ImCross /> : <TiThMenu />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden absolute top-16 right-4 bg-white backdrop-blur-md px-4 py-4 rounded-lg shadow-lg flex flex-col space-y-4">
                <span
                  className="text-[12px]  cursor-pointer text-black font-semibold"
                  onClick={() => handleScroll("section1")}
                >
                  Use cases
                </span>
                <span
                  className="text-[12px]  cursor-pointer text-black font-semibold"
                  onClick={() => handleScroll("section2")}
                >
                  C.H.A.R.C.H.A.
                </span>
                <button
                  className="text-[12px]  bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                  onClick={() => setModalOpen(true)}
                >
                  Join our waitlist
                </button>
              </div>
            )}
          </nav>
          <VideoBackground />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

          <WaitingListModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
          {/* Subsection 1 */}
          <div className=" flex flex-col justify-center items-start px-5 snap-start pt-40">
            {/* Left-aligned heading with 30% blank space on the right */}
            <div className="flex flex-row w-full">
              <div className="z-10">
                <h1 className="text-[32px] md:text-[84px] font-inter font-bold leading-[32px] md:leading-[83px] text-white tracking-[-0.05em]">
                  Turn your audio into engaging <br />
                  storytelling video with <br />
                  consistent characters and <br />
                  scenes using Koyal
                </h1>
                <hr className="w-[80%] md:w-[60%] mt-6 border-2" />
                <p className="w-[90%] md:w-[60%] font-inter mt-6 text-[14px] md:text-[18px] text-white tracking-[-0.56px] md:tracking-[-0.72px] leading-[18px] md:leading-[21.6px]">
                  Koyal's AI-powered platform allows you to seamlessly convert
                  audio into personalized, visually compelling stories. With its
                  suite of multimodal AI generation and translation models,
                  Koyal generates custom characters, settings, and animations
                  that maintain a cohesive aesthetic throughout your video
                  content.
                </p>
                <div className="mt-8 flex flex-wrap space-x-4">
                  {/* View demo button */}
                  {/* <button className="border border-white text-white px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-gray-200 hover:text-black transition">
                      View demo
                    </button> */}
                  {/* Join our waitlist button */}
                  <button
                    className="bg-black text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-sm sm:text-base md:text-lg rounded-full hover:bg-gray-800 transition"
                    onClick={() => setModalOpen(true)}
                  >
                    Join our waitlist
                  </button>
                </div>
              </div>
              <div className="w-[30%]"></div>
            </div>
          </div>
          {/* Subsection 4 */}
          <div className="relative  md:h-[40vh] flex flex-col justify-center items-center mt-[6rem] md:mt-[50rem] px-8 snap-start bg-cover bg-center">
            {/* Subsection 1 - Heading & Description */}
            <div className="text-center w-[75%] md:w-[50%]">
              {" "}
              {/* 3rem gap */}
              <p className="text-[10px] sm:text-[17px] leading-[28px] sm:leading-[36px] tracking-[0px] font-medium text-center font-inter text-white">
                Styles
              </p>
              <h4 className="text-[20px] sm:text-[36px] md:text-[42px] lg:text-[46px] leading-[32px] sm:leading-[40px] md:leading-[46px] tracking-[-1.5px] font-normal text-center font-inter text-white">
                Koyal generates personalized narrative-driven videos from your
                audio in a variety of engaging styles:
              </h4>
            </div>
          </div>
          <div className="relative flex flex-col justify-center items-center  snap-start bg-cover bg-center md:max-h-[70vh] mt-6">
            {/* Buttons & Image Display */}
            <div className="relative flex flex-col items-center ">
              {/* Buttons */}
              <div className="flex">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setActiveStyle(style)}
                    className={`px-6 py-2 md:text-[17.02px] text-[10px] font-bold tracking-[0px] text-center font-inter rounded-2xl transition-all
            ${
              activeStyle === style
                ? "bg-white/30 text-white backdrop-blur-md"
                : "bg-transparent text-gray-500 hover:text-gray-300"
            }`}
                    style={{
                      padding: "10px 24px",
                      borderColor:
                        activeStyle === style
                          ? "rgba(255, 255, 255, 0.5)"
                          : "transparent",
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>

              {/* Video Display Section */}
              <div className="rounded-lg   overflow-hidden md:w-[50rem] md:h-[40rem] w-[20rem] h-[19rem] flex items-center justify-center p-10 relative">
                <div className="bg-[#030400]/20 backdrop-blur-md ">
                  <div className="bg-black/20 backdrop-blur-md md:m-[70px_100px_100px] m-[20px]">
                    <VideoPlayer
                      videoSrc={images[activeStyle]}
                      className="pointer-events-auto"
                    />
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevious}
                  className="absolute top-1/2 left-0 md:left-4 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full w-6 h-6 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:bg-white/30 transition-all border border-white/30"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={handleNext}
                  className="absolute top-1/2 right-0 md:right-4 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white rounded-full w-6 h-6 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:bg-white/30 transition-all border border-white/30"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* Section 2 */}
        <section
          id="section1"
          className="relative flex flex-col items-center justify-center px-8 md:px-20 py-10 bg-[#FFF8EF] text-black"
        >
          {/* Background Circles */}
          <div className="absolute z-10 top-0 w-[60%]  flex justify-center items-center overflow-hidden">
            <img src={bgcircle} alt="Background Circles" className="w-[100%]" />
          </div>

          {/* Heading Section */}
          <div className="text-center mt-6 relative z-10">
            <p className="text-[17.02px] font-medium leading-[46.17px] tracking-[0px] text-center  font-inter text-gray-600 ">
              Use cases
            </p>
            <div className="flex items-center justify-center">
              <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[46px] font-light leading-[32px] sm:leading-[40px] md:leading-[46px] tracking-[-1px] sm:tracking-[-1.5px] md:tracking-[-2px] lg:tracking-[-2.3px] text-center font-inter w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%]">
                Turn ideas into content easily. The possibilities with Koyal are
                endless - from short-form social videos to professional ads.
              </h2>
            </div>
          </div>

          {/* Two-Column Section */}
          <AdvertiserSection
            activeOption={activeOption}
            setActiveOption={setActiveOption}
          />

          {/* Footer Section */}

          <div className="relative flex flex-col md:flex-row items-center justify-center m-12 sm:m-16 md:m-24 w-full md:px-4 mt-0 space-y-6 md:space-y-0">
            {/* Left Image (Background) */}
            <img
              src={usecaseimgright}
              alt="Left"
              className="w-25 h-20 md:w-40 md:h-40 object-cover opacity-50"
            />
            {/* Text */}
            <p className="relative z-10 text-[34px] sm:text-[35px] md:text-[43px] font-light leading-[28px] sm:leading-[38px] md:leading-[46px] tracking-[-1px] sm:tracking-[-1.5px] md:tracking-[-2.309px] text-center font-inter xl:w-[25%]  lg:w-[35%] sm:w-[70%] md:w-[50%]">
              Sky is the limit <br /> for the use cases...
            </p>

            {/* Right Image (Background) */}
            <img
              src={usecaseimgleft}
              alt="Right"
              className="w-25 h-20 md:w-40 md:h-40 object-cover opacity-50"
            />
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
          <div className="text-center relative z-10 mb-16 md:w-[50%] w-[70%]">
            {/* Top Label */}
            <p className="text-[17.02px] font-medium leading-[46.17px] tracking-[0px] text-center font-inter text-gray-400 mb-4">
              Personalize your videos
            </p>

            {/* Heading */}
            <h2 className="mb-20 text-[28px] sm:text-[36px] md:text-[46.2px] font-light leading-[32px] sm:leading-[40px] md:leading-[46.17px] tracking-[-1px] sm:tracking-[-1.5px] md:tracking-[-2.309px] text-center font-inter w-[90%] sm:w-[80%] md:w-full mx-auto">
              Inject yourself into the videos with{" "}
              <span className="relative">
                <span className="text-yellow-400">C.H.A.R.C.H.A.</span>
                <div className="patent-pending absolute bottom-[-2rem] right-[-4rem]">
                  {/* <div className="absolute bottom-[0px] right-[-5rem] sm:bottom-[-30px] sm:right-[-3rem] md:right-[-3rem] flex justify-center sm:justify-end mt-[-4px] sm:mt-[-10px]"> */}
                  <span
                    className="text-[12px] sm:text-[14px] md:text-[16px] font-normal tracking-[0px] italic text-yellow-400"
                    style={{ fontFamily: "Gloria Hallelujah" }}
                  >
                    Patent pending ⏳
                  </span>
                </div>
              </span>
              <span className="inline-flex items-center space-x-2">
                {/* Arrow Image (Immediately After C.H.A.R.C.H.A.) */}
                {/* <img src={arrow} className="w-8 sm:w-10 h-8 sm:h-10 inline-block" alt="Arrow" /> */}
              </span>
              {/* Patent Pending (Positioned Below the Arrow) */}
            </h2>

            {/* Description */}
            <p className="mt-6 text-[22.46px] font-normal leading-[27.6px] tracking-[-0.72px] text-center font-inter max-w-3xl mx-auto">
              <div>
                <span className="text-gray-400">
                  It stands for Computer Human Assessment for Recreating
                  Characters with Human Actions.
                </span>{" "}
              </div>
              <span className="text-white">
                It generates personalized videos with your avatar. Upload clips
                — our AI creates on-brand visuals featuring you.
              </span>
            </p>
          </div>

          {/* Content Row 1 */}
          <div className="bg-zinc-900 text-white py-16 rounded-xl shadow-lg">
            {/* Content Row 1 */}
            <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-6xl mx-auto mb-16 space-y-8 lg:space-y-0">
              {/* Left Content */}
              <div className="w-full lg:w-[45%]  p-6 rounded-lg shadow-lg">
                <h3 className="text-3xl sm:text-4xl md:text-[43.13px] font-bold leading-tight md:leading-[46.17px] tracking-tight md:tracking-[-2.309px] font-inter mb-4">
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
                <div className="w-full rounded-lg shadow-lg overflow-hidden">
                  <AutoImageSlider
                    images={charachaImages}
                    currentButtonColor={"white"}
                  />
                </div>
              </div>

              {/* Right Content */}
              <div className="w-full lg:w-[45%]  p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl sm:text-3xl md:text-[43.13px] font-bold leading-tight md:leading-[46.17px] tracking-tight md:tracking-[-2.309px] font-inter mb-4">
                  Select from your generated avatars to use for the final video
                </h3>
              </div>
            </div>
          </div>
        </section>

        <section
          id="section3"
          className="relative w-full h-[40vh] md:h-[70vh] overflow-hidden"
        >
          {/* Background Video */}
          <video
            className="absolute top-0 left-0 w-full h-full md:object-cover object-fill"
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
            <h1 className="text-3xl sm:text-4xl md:text-[50.7px] font-bold leading-tight md:leading-[55.72px] tracking-tight md:tracking-[-2.786px] text-center font-inter w-[90%] sm:w-[70%] md:w-[50%] mx-auto">
              The new age of video
              <br /> creation starts here
            </h1>
            <button
              className="px-6 py-3 bg-white text-black rounded-full  m-4 font-semibold hover:bg-gray-200"
              onClick={() => setModalOpen(true)}
            >
              Join our waitlist
            </button>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-black text-white py-16 px-8 relative md:h-[50vh]">
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
                  <Logo/>
                </div>
                <p className="text-[15px] font-medium text-gray-400 font-inter">
                  Turn audio to video seamlessly
                </p>
                <button
                  className="px-6 py-2 bg-[#141414] text-white rounded-full font-semibold"
                  onClick={() => setModalOpen(true)}
                >
                  Join the waitlist
                </button>
              </div>

              {/* Right Section: Menus */}
              <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-16 md:m-10 pt-10 lg:mt-0">
                {/* Company Links */}
                <div className="md:space-y-10 space-y-4">
                  <h4 className="text-white-100 text-sm uppercase tracking-wider">
                    Company
                  </h4>
                  <ul className="md:space-y-6 space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 text-sm hover:underline"
                        onClick={() => handleScroll("section0")}
                      >
                        About us
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 text-sm hover:underline"
                        onClick={() => handleScroll("section1")}
                      >
                        Use cases
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 text-sm hover:underline"
                        onClick={() => handleScroll("section2")}
                      >
                        C.H.A.R.C.H.A
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Legal Links */}
                <div className="md:space-y-10 space-y-4">
                  <h4 className="text-white-100 text-sm uppercase tracking-wider">
                    Legal
                  </h4>
                  <ul className="md:space-y-6 space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 text-sm hover:underline"
                      >
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-400 text-sm hover:underline"
                      >
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
                {/* <a href="#" className="text-white hover:text-gray-400">
                  <img src={twittericon} alt="Twitter" className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-gray-400">
                  <img src={readcvicon} alt="Doc" className="w-6 h-6" />
                </a>
                <a href="#" className="text-white hover:text-gray-400">
                  <img src={discardicon} alt="Discord" className="w-6 h-6" />
                </a> */}
                <a
                  href={INSTAGRAM_URL}
                  className="text-white hover:text-gray-400"
                >
                  <img
                    src={instagramicon}
                    alt="Instagram"
                    className="w-6 h-6"
                  />
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
      const response = await fetch(
        `${config.baseUrl}${WaitingListApiRoutes.JoinWaitList}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, mobile }),
        }
      );

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

        <h2 className="text-xl font-semibold text-white text-center mb-4">
          Join Our Waitlist
        </h2>

        {/* Success / Error Message */}
        {message && (
          <p className="text-center text-green-400 font-medium">{message}</p>
        )}
        {error && (
          <p className="text-center text-red-400 font-medium">{error}</p>
        )}

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
              style={{
                backgroundColor: "#acacaf",
                WebkitAppearance: "none", // Prevents iOS default styles
                MozAppearance: "none",
                appearance: "none",
              }}
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
              style={{
                backgroundColor: "#acacaf",
                WebkitAppearance: "none", // Prevents iOS default styles
                MozAppearance: "none",
                appearance: "none",
              }}
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
              style={{
                backgroundColor: "#acacaf",
                WebkitAppearance: "none", // Prevents iOS default styles
                MozAppearance: "none",
                appearance: "none",
              }}
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
