import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import header_design from '../assets/images/landingpage.png';
import ScrollWatcher from './ScrollWatcher';


const Header = () => {
  return (
        <header className="sticky top-0 bg-white shadow-md z-50 animate-slideInDown">
        {/* <div className="scroll-watcher fixed top-0 left-0 h-[4px] w-full bg-white origin-left scale-x-0 scale-y-1 z-[1000] animate-scroll-watcher">
        </div> */}
        <ScrollWatcher/>
          <div className="container mx-auto px-4 p-1 pl-20 pr-20">
            <div className="flex items-center justify-between mt-2">
              {/* Logo */}
              <a href="index.html" className="flex items-center">
                <img src={logo} alt="raktadan" className="h-13" />
              </a>
              
              {/* Navigation Menu */}
              <nav className="hidden md:flex space-x-8 items-center mb-2">
                <Link to="/" className="text-gray-800 hover:text-blue-600 font-medium active">
                  Home
                </Link>
                <a href="service" className="text-gray-800 hover:text-blue-600 font-medium">
                  About
                </a>
                <a href="" className="text-gray-800 hover:text-blue-600 font-medium">
                  Contact 
                </a>
                <Link to="/home" className="text-gray-800 hover:text-blue-600 font-medium">
                  Website
                </Link>
                
                <div>
                  <Link
                    id="modal_trigger"
                    to="/register"
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-md font-medium flex items-center"
                  >
                    <i className="fa fa-sign-in-alt mr-2"></i> Sign up Now
                    </Link>
                </div>
              </nav>

              {/* Mobile Menu Trigger */}
              <div className="md:hidden">
                <button className="text-gray-800">
                  <span>Menu</span>
                </button>
              </div>
            </div>
      </div>
    </header>
  );
};
export default Header;



// import React, { Fragment } from 'react';

// import { Popover, Transition } from '@headlessui/react';
// import { MenuIcon, XIcon } from '@heroicons/react/outline';
// import { Link } from 'react-scroll';

// import config from '../config/index.json';

// const Menu = () => {
//   const { navigation, company, callToAction } = config;
//   const { name: companyName, logo } = company;

//   return (
//     <>
//       <svg
//         className={`hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-background transform translate-x-1/2`}
//         fill="currentColor"
//         viewBox="0 0 100 100"
//         preserveAspectRatio="none"
//         aria-hidden="true"
//       >
//         <polygon points="50,0 100,0 50,100 0,100" />
//       </svg>

//       <Popover>
//         <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
//           <nav
//             className="relative flex items-center justify-between sm:h-10 lg:justify-start"
//             aria-label="Global"
//           >
//             <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
//               <div className="flex items-center justify-between w-full md:w-auto">
//                 <a href="#">
//                   <span className="sr-only">{companyName}</span>
//                   <img alt="logo" className="h-16 w-auto sm:h-16" src={logo} />
//                 </a>
//                 <div className="-mr-2 flex items-center md:hidden">
//                   <Popover.Button
//                     className={`bg-background rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary`}
//                   >
//                     <span className="sr-only">Open main menu</span>
//                     <MenuIcon className="h-6 w-6" aria-hidden="true" />
//                   </Popover.Button>
//                 </div>
//               </div>
//             </div>
//             <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
//               {navigation.map((item) => (
//                 <Link
//                   spy={true}
//                   active="active"
//                   smooth={true}
//                   duration={1000}
//                   key={item.name}
//                   to={item.href}
//                   className="font-medium text-gray-500 hover:text-gray-900"
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//               <a
//                 href="#"
//                 className={`font-medium text-primary hover:text-secondary`}
//               >
//                 Call to action
//               </a>
//             </div>
//           </nav>
//         </div>

//         <Transition
//           as={Fragment}
//           enter="duration-150 ease-out"
//           enterFrom="opacity-0 scale-95"
//           enterTo="opacity-100 scale-100"
//           leave="duration-100 ease-in"
//           leaveFrom="opacity-100 scale-100"
//           leaveTo="opacity-0 scale-95"
//         >
//           <Popover.Panel
//             focus
//             className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
//           >
//             <div
//               className={`rounded-lg shadow-md bg-background ring-1 ring-black ring-opacity-5 overflow-hidden`}
//             >
//               <div className="px-5 pt-4 flex items-center justify-between">
//                 <div>
//                   <img className="h-8 w-auto" src={logo} alt="" />
//                 </div>
//                 <div className="-mr-2">
//                   <Popover.Button
//                     className={`bg-background rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary`}
//                   >
//                     <span className="sr-only">Close main menu</span>
//                     <XIcon className="h-6 w-6" aria-hidden="true" />
//                   </Popover.Button>
//                 </div>
//               </div>
//               <div className="px-2 pt-2 pb-3 space-y-1">
//                 {navigation.map((item) => (
//                   <Link
//                     spy={true}
//                     active="active"
//                     smooth={true}
//                     duration={1000}
//                     key={item.name}
//                     to={item.href}
//                     className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
//                   >
//                     {item.name}
//                   </Link>
//                 ))}
//               </div>
//               <a
//                 href={callToAction.href}
//                 className={`block w-full px-5 py-3 text-center font-medium text-primary bg-gray-50 hover:bg-gray-100`}
//               >
//                 {callToAction.text}
//               </a>
//             </div>
//           </Popover.Panel>
//         </Transition>
//       </Popover>
//     </>
//   );
// };

// export default Menu;