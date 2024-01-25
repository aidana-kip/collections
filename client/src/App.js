import SignIn from "./users/SignIn";
import SignUp from "./users/SignUp";
import MyCollections from "./collections/MyCollections";
import AllCollections from "./collections/AllCollections";
import NewCollection from "./collections/NewCollection";
import EditCollection from "./collections/EditCollection";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./Welcome";
import MyItems from "./items/MyItems";
import AllItems from "./items/AllItems";
import NewItem from "./items/NewItem";
import Users from "./users/Users";
import EditItem from "./items/EditItem";
import ViewCollection from "./collections/ViewCollection";
import ViewItem from "./items/ViewItem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/my-collections" element={<MyCollections />}></Route>
        <Route path="/new-collection" element={<NewCollection />}></Route>
        <Route path="/edit-collection" element={<EditCollection />}></Route>
        <Route path="/new-item" element={<NewItem />}></Route>
        <Route path="/my-items" element={<MyItems />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/edit-item" element={<EditItem />}></Route>,
        <Route path="/all-collections" element={<AllCollections />}></Route>
        <Route path="/view-collection" element={<ViewCollection />}></Route>
        <Route path="/view-item" element={<ViewItem />}></Route>
        <Route path="/all-items" element={<AllItems />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
