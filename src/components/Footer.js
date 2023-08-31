import {FaSearchLocation} from "react-icons/fa"
import {SiGooglehome} from "react-icons/si"
import { Link } from "react-router-dom";
const Footer = () => {
    return ( 
        <footer className="sticky bg-white bg-opacity-80 p-4 md:p-8 rounded-[2rem]  text-gray-800 justify-center md:text-white md:bg-opacity-30 md:flex md:flex-col md:items-center md:space-y-4 w-[15rem] mx-auto mb-[2rem] md:w-[15rem]">
   <nav className="flex items-center justify-evenly">
 <Link to="/"><SiGooglehome className="text-2xl  mx-auto "/></Link>
 <Link to="search"> <FaSearchLocation className="text-2xl  mx-auto "/></Link>
   
   </nav>
      </footer>
     );
}
 
export default Footer;