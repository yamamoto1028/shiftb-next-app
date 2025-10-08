import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import RouterApp from "./RouterApp";
import ArticleList from "../page";
import ArticleDetail from "../details/page";
import InquiryPage from "../inquiry/page";

const RoutesLink = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RouterApp />}>
      <Route path="/" element={<ArticleList />}></Route>
      <Route path="/details/:id" element={<ArticleDetail />}></Route>
      <Route path="/inquiry" element={<InquiryPage />}></Route>
    </Route>
  )
);
export default RoutesLink;
