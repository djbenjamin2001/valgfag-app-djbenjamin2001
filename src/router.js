import { createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import Searchside from "./components/Search";

export const router = createBrowserRouter(
    createRoutesFromElements(
    <Route path="/" element={<App/>}>
<Route index element={<Home/>} />
<Route path="search" element={<Searchside/>} />
        </Route>
        
       
        )
    
    )