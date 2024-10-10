import React, { Fragment,useState, useEffect } from "react"
import Pagination from 'react-js-pagination'
import MetaData from "./layout/MetaData"
import { useParams } from "react-router-dom"; // Import useParams hook


// import product layout from Product.js frontend file
import Product from './product/Product'

// import loader to give user, proper loading experience
import Loader from "./layout/Loader"

import { useDispatch, useSelector } from 'react-redux'

// get productAction 
import { getProducts } from "../actions/productActions"

// this is for showing user alerts
import { useAlert } from 'react-alert';

const Home = ({ match }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const alert = useAlert();
    const dispatch = useDispatch();
    const { keyword } = useParams(); // Use useParams hook to get the keyword

    // get products from the database
    const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products)

    useEffect(() =>{
        if(error){
            alert.error(error)
        }
        dispatch(getProducts(keyword, currentPage));

    },[dispatch, alert, error, keyword, currentPage])

    function setCurrentPageNo(pageNumber){
        setCurrentPage(pageNumber)
    }

    let count = productsCount;
    if (keyword) {
        count = filteredProductsCount
    }

    return(
        // loading is for when site is loading, user can see proper waiting message until site is loadind.
        // when loading is true
        <Fragment>
            {loading ? <Loader/> : (  
                <Fragment>
                    <MetaData title={'Buy Best Products Online'}/>
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (
                                <Product key={product._id} product={product} />
                            ))}
                            
                        </div>        
                    </section>

                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}

                </Fragment>
            )}
            
        </Fragment>
    )
}

export default Home