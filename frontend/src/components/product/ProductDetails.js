import React, { Fragment, useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, clearErrors } from '../../actions/productActions';
import { addItemToCart } from '../../actions/cartActions';

const ProductDetails = () => {

    const [quantity, setQuantity] = useState(1)

    const { id } = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, product } = useSelector(state => state.productDetails);

    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id));
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error, id]);

    const addToCart = () => {
        dispatch(addItemToCart(id, quantity));
        alert.success('Item Added to Cart')
    }

    const increaseQty = () => {
        const count = document.querySelector('.count')

        if (count.valueAsNumber >= product.stock) return;

        const qty = count.valueAsNumber + 1;
        setQuantity(qty)
    }

    const decreaseQty = () => {

        const count = document.querySelector('.count')

        if (count.valueAsNumber <= 1) return;

        const qty = count.valueAsNumber - 1;
        setQuantity(qty)

    }

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={product.name} style={{ color: 'red' }}/>
                    <div className="row d-flex justify-content-around">
                        <div className='col-12 col-lg-5 img-fluid' id="product_image">
                        <Carousel pause='hover'>
                            {product.images && product.images.map((image, index) => (
                                <Carousel.Item key={image.public_id}>
                                    <img className='d-block w-100' src={image.url} alt={product.name}/>
                                </Carousel.Item>
                            ))}
                        </Carousel>

                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{ product.name }</h3>
                            <p id='product_id'>Product #{ product._id }</p>
                            <hr />

                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({ product.numOfReviews } Reviews)</span>

                            <hr />

                            <p id="product_price">Rs.{ product.price }</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
                                <input type="number" className="form-control count d-inline" value={quantity} readOnly />
                                <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                            </div>
                            <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" 
                            disabled={product.stock === 0} onClick={addToCart}>Add to Cart</button>

                            <hr />

                            <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'} >
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                                </p>

                            <hr />

                            <h4 className="mt-2">Description:</h4>
                            <p>{ product.description }</p>
                            <hr />

                            <p id='product_seller mb-3'>Brand: <strong>{ product.brand }</strong></p>
                            <p id='product_seller mb-3'>Category: <strong>{ product.category }</strong></p>

                            <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                                Submit Your Review
                            </button>

                            <div className="row mt-2 mb-5">
                                <div className="rating w-50">
                                    {/* Your rating code here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default ProductDetails;
