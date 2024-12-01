'use client';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Breadcrumb, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaPlay } from 'react-icons/fa';
import styles from './InventoryDetail.module.css'; // Custom CSS for your styles

const ProductDetails = ({ params }) => {
    const id = params.slug; // Assuming 'slug' here is the Stock ID
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Retrieve and parse CSV data from local storage
        const storedData = localStorage.getItem("csvData");
        if (storedData) {
            const parsedData = JSON.parse(storedData);

            // Find the product by Stock ID
            const foundProduct = parsedData.find(p => p["Model No"] == id);

            console.log(parsedData)
            if (foundProduct) {
                setProduct(foundProduct);
            } else {
                setError('Product not found.');
            }
        } else {
            setError('No product data available.');
        }
        setLoading(false);
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Container className={styles.mainContainer}>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="/inventory">Products</Breadcrumb.Item>
                <Breadcrumb.Item active>{product["Model No"]}</Breadcrumb.Item>
            </Breadcrumb>

            <Row>
                <Col md={6}>
                    <Card className={styles.imageCard}>
                        <img src={product["Image Link"]} alt={product["Model No"]} className={styles.productImage} />
                        {/* <Button variant="light" className={styles.videoButton} href={product["Video Link"]} target="_blank">
                            <FaPlay /> Watch Video
                        </Button> */}
                    </Card>
                </Col>

                <Col md={6}>
                    <h2 className={styles.productTitle}>{product["Model No"]}</h2>
                    <div className={styles.priceSection}>
                        <span className={styles.productPrice}>${product["Total Price ($US)"]}</span>
                    </div>

                    <p className="mt-3">inclusive of all taxes</p>

                    <h5>Product Details</h5>
                    <p>Brand Name : {product['Brand']}</p>
                    <p>Metal Type : {product['Metal Type']}</p>
                    <p>Case Size (MM) : {product['Case Size (MM)'] + " MM"}</p>
                    <p>Condition : {product['Condition']}</p>
                    <p>Launch Year : {product['Launch Year']}</p>

                    <h5>Features:</h5>
                    <ul>
                        <li>{product.features || 'No features listed.'}</li>
                    </ul>

                    <div className={styles.actionButtons}>
                        <Button variant="danger" className={styles.addToCartButton}>
                            <FaShoppingCart /> Add To Cart
                        </Button>
                        <Button variant="outline-secondary" className={styles.wishlistButton}>
                            <FaHeart /> Wishlist
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetails;
