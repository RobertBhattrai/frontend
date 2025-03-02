import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../components/LandingHeader';
import Footer from '../components/Footer';
import section_top_img from '../assets/other/heading-line-dec.png';
import home_design from '../assets/images/landingpage.png';
import bg_design from '../assets/images/bgimg.jpg';
import home1 from '../assets/images/home2.svg';
import AnimatedButton from "../components/Button";

const Landing = () => {
  return (
    <>
    <LandingHeader/>
    <section id="main" className='h-screen flex justify-center items-center' style={{backgroundImage: `url(${bg_design})`, backgroundSize: 'cover', backgroundPositionY: '30%'}}>
    {/* <img src={home_design} alt="" className=''/> */}
    <div className="flex justify-center gap-5 space-x-6 items-end">


      <div className="max-w-lg p-6 bg-white bg-opacity-0 text-black rounded-lg">
        <h1 className="text-4xl mb-10 font-extrabold">
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

    <section id="about" className="h-[90vh] px-4 md:px-6 lg:px-20 py-16 bg-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h4 className="text-3xl font-bold mb-4">
            Platform for <em className="text-blue-600">Donation &amp; Request</em> for you
          </h4>
          <img src={section_top_img} alt="Decorative Line" className="mx-auto mb-4" />
          <p className="text-gray-600">
          Donate blood, it will connect to and make a blood bond with someone. You can save lifes. You can create the hope which someone needs. {}You are the hope. If you need donation we give you the hope.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Service 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-2">App Maintenance</h4>
            <p className="text-gray-600 mb-4">
              You are not allowed to redistribute this template ZIP file on any other website.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              Read More <i className="fa fa-arrow-right ml-1"></i>
            </a>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-2">Rocket Speed of App</h4>
            <p className="text-gray-600 mb-4">
              You are allowed to use the Chain App Dev HTML template. Feel free to modify or edit this layout.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              Read More <i className="fa fa-arrow-right ml-1"></i>
            </a>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-2">Multi Workflow Idea</h4>
            <p className="text-gray-600 mb-4">
              If this template is beneficial for your work, please support us{' '}
              <a
                href="https://paypal.me/templatemo"
                target="_blank"
                rel="nofollow"
                className="text-blue-600 hover:underline"
              >
                a little via PayPal
              </a>. Thank you.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              Read More <i className="fa fa-arrow-right ml-1"></i>
            </a>
          </div>

          {/* Service 4 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-2">24/7 Help & Support</h4>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor consectetur adipiscing elit sedder williamsburg photo booth quinoa and fashion axe.
            </p>
            <a
              href="#"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              Read More <i className="fa fa-arrow-right ml-1"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Landing;
