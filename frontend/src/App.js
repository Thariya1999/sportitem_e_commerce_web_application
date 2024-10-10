
import { useEffect } from 'react';

// react router dom is for give different web routes for different web pages
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

// Component Imports
import Header from './components/layout/Header'
import Footer from './components/layout/Footer';
import Home from './components/Home'

// Product Imports
import ProductDetails from './components/product/ProductDetails';

// User Imports
import Login from './components/user/Login'
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';

// Admin Imports
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import UsersList from './components/admin/UsersList'

// Cart Imports
import Cart from './components/cart/Cart'

import { loadUser } from './actions/userActions';
import store from './store'

function App() {

  useEffect(()=>{
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <div className="App">
        <Header/>
        <div className="container container-fluid">
          <Routes>

            <Route path = "/" Component={Home} exact />
            <Route path = "/search/:keyword" Component={Home} />
            <Route path="/product/:id" Component={ProductDetails} exact/>

            <Route path='/cart' Component={Cart}/>

            <Route path="/login" Component={Login}/>
            <Route path="/register" Component={Register}/>
            <Route path="/me" Component={Profile}/>
            <Route path='/me/update' Component={UpdateProfile}/>

          </Routes>
        </div>
        <Routes>
          <Route path='/dashboard' Component={Dashboard}/>
          <Route path='/admin/products' Component={ProductsList}/>
          <Route path='/admin/product' Component={NewProduct}/>
          <Route path='/admin/product/:id' Component={UpdateProduct}/>
          <Route path='/admin/users' Component={UsersList}/>
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
