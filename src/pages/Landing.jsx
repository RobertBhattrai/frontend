import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../components/LandingHeader';
import Footer from '../components/Footer';
import section_top_img from '../assets/other/heading-line-dec.png';
import home_design from '../assets/images/landingpage.png';
import bg_design from '../assets/images/bgimg.jpg';
import home1 from '../assets/images/home2.svg';
import AnimatedButton from "../components/Button";
import features from "../config/LandingContent";
import WaveDivider from '../components/WaveDivider';

const Landing = () => {
  return (
    <>
    <LandingHeader/>
    <section id="main" className='h-screen flex justify-center items-center' style={{backgroundImage: `url(${bg_design})`, backgroundSize:'110%', backgroundPositionX:'-130px'}}>
    {/* <img src={home_design} alt="" className=''/> */}
    <div className="flex justify-center gap-5 space-x-6 items-end">
      <div className="max-w-lg p-6 bg-white bg-opacity-0 text-black rounded-lg">
        <h1 className="teko-font text-6xl font-medium text-center">
          <span className='text-blue-600'>Donate</span> Blood, <span className='text-red-600'>Save</span> Lives, Connect <span className='text-green-600'>Hope</span>!
        </h1>
        <p className='text-center pt-4'>Every drop counts! Join our blood donation community and make a difference. Whether you're in need of blood or want to save lives by donating, <span className='font-medium'>100% free, direct blood donation from donor to recipient.</span> Register now and help someone in need today!</p>
        <div className="flex gap-10 justify-center mt-10">
          <Link
            to="/register"
            className=""
          >
          <AnimatedButton/>
          </Link>
          {/* <AnimatedButton/> */}
          <Link
            to="/login"
            className="button"
          >
            Login
          </Link>
        </div>
      </div>
      <div className='max-w-lg'><img src={home1} alt="" className='h-96'/></div>
      </div>
    </section>

    {/* backgroundColor:'#3cd1ae' */}
    <section className='h-20 relative' style={{backgroundColor:'#3cd1ae', background: 'linear-gradient(90deg, rgba(52,199,164,1) 0%, rgba(96,228,197,1) 25%, rgba(116,245,189,1) 65%, rgba(58,199,166,1) 100%)'}}>
    <div class="wave">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
    </svg>
    </div>
    </section>

    <section id="about" className="h-auto px-4 md:px-6 lg:px-20 py-3 relative" style={{backgroundColor:'#3cd1ae', background: 'linear-gradient(90deg, rgba(52,199,164,1) 0%, rgba(96,228,197,1) 25%, rgba(116,245,189,1) 65%, rgba(58,199,166,1) 100%)'}}>
      <div className="container mx-auto sm:px-4 md:px-6 lg:px-40 mt-10">
        <div className="text-center mb-8">
          <h4 className="text-3xl font-bold mb-4">
            Platform for <em className="text-blue-600">Donation &amp; Request</em> for you
          </h4>
          <img src={section_top_img} alt="Decorative Line" className="mx-auto mb-4" />
          <p className="text-gray-600 mt-5 pt-5 font-medium font-sans">
          Donate blood, it will connect to and make a blood bond with someone. You can save lifes. You can create the hope which someone needs. {}You are the hope. If you need donation we give you the hope.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10 mt-8 px-20 pb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-full shadow-md hover:shadow-lg transition text-center">
              <div className="text-5xl">{feature.icon}</div>
              <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
          
    </section>
    <Footer/>
    </>
  );
};

export default Landing;
