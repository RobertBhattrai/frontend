import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LandingHeader from "../components/LandingHeader";

const UserLayout = () => {
  return (
    <>
      <div className="px-2 sm:px-4 md:px-8 lg:px-20">
        <LandingHeader />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default UserLayout;
