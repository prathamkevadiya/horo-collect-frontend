'use client';

import { redirect } from 'next/dist/server/api-utils';
import { useEffect, useState } from 'react';
import { Table, Col, Row, Card, Form, Dropdown, Button, Tabs, Tab } from 'react-bootstrap';
import { BsThreeDotsVertical, BsSearch } from 'react-icons/bs';
import axiosInstance from 'utils/axios';
import "./togglerSwitch.css"

const EcommerceProducts = ({ csvData, setModalShow, fetchProductsByUser }) => {

    const getCookie = (cookieName) => {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === cookieName) {
                return value;
            }
        }
        return null;
    };

    const [filters, setFilters] = useState({ company: '', status: '' });
    const [search, setSearch] = useState('');
    const [activeProducts, setActiveProducts] = useState([]);
    const [brands, setBrands] = useState([]); // List of unique brands
    const [viewMode, setViewMode] = useState('table'); // Default to 'table'

    useEffect(() => {
        // Transform `csvData` to match the UI structure
        const transformedProducts = csvData.map((item) => ({
            id: item.id,
            name: item.model_no,
            description: item.gender ? `${item.gender} Watch` : 'No description available',
            sku: item.stock_id,
            amount: item.total_price, // Example random price
            status: item.visibility ? 'Active' : 'Inactive', // Example random status
            color: item.color || 'N/A', // Example color field
            brand: item.brand,
            season: item.season || 'N/A', // Placeholder season
            image: item.image_link || 'https://via.placeholder.com/300', // Placeholder image
            metal: item.metal_type,
            condition: item.condition,
            location: item.location,
            visibility: item.visibility,
            user_id: item.user_id
        }));

        setActiveProducts(transformedProducts);

        // Extract unique brands
        const uniqueBrands = [
            ...new Set(transformedProducts.map((product) => product.brand)),
        ].filter((brand) => brand); // Remove any undefined or empty brands
        setBrands(uniqueBrands);
    }, [csvData]);

    const filteredProducts = activeProducts.filter((item) => {
        const companyFilter = filters.company ? item.brand.toLowerCase().includes(filters.company.toLowerCase()) : true;
        const statusFilter = filters.status ? item.status.toLowerCase() === filters.status.toLowerCase() : true;
        const searchFilter = search ? item.name.toLowerCase().includes(search.toLowerCase()) : true;

        return companyFilter && statusFilter && searchFilter;
    });

    console.log("filteredProducts", filteredProducts)

    const clearFilters = () => {
        setFilters({ company: '', status: '' });
        setSearch('');
    };

    const handleVisibilityUpdate = async (product) => {

        const status = product.visibility === true ? false : true
        const productId = product.id

        try {
            const token = getCookie('authToken'); // Retrieve token from cookies

            if (!token) {
                setUploadAlert(
                    <Alert variant="danger" className="text-center">
                        <ExclamationTriangleFill size={25} className="me-1" />
                        Access Denied. No token found. Please log in.
                    </Alert>
                );
                return;
            }

            const { data } = await axiosInstance.post('/products/updateVisibility',
                {
                    "id": productId,
                    "visibility": status
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            fetchProductsByUser()
        } catch (error) {
            console.error('Error fetching products:', error);
        }

    }

    return (
        <Row>
            <Col md={12}>
                <Card className="shadow-sm border-0">
                    <Card.Header className="bg-white border-0">
                        <Row className="align-items-center">
                            <Col>
                                <h4 className="mb-0">Products</h4>
                            </Col>
                            <Col className="text-end">
                                <Button variant="primary" onClick={() => setModalShow(true)} >Add Product</Button>
                            </Col>
                        </Row>
                    </Card.Header>

                    <Card.Body>
                        {/* Tabs for switching views */}
                        <Tabs activeKey={viewMode} onSelect={(key) => setViewMode(key)} className="mb-4">
                            <Tab eventKey="table" title="Table View" />
                            <Tab eventKey="card" title="Card View" />
                        </Tabs>

                        {/* Filters */}
                        <Row className="mb-4">
                            <Col lg={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="Search products"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="shadow-sm"
                                />
                            </Col>
                            <Col lg={3}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-secondary" className="w-100 shadow-sm">
                                        {filters.company || 'Filter by Company'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                                        <Dropdown.Item onClick={() => setFilters({ ...filters, company: '' })}>
                                            All Companies
                                        </Dropdown.Item>
                                        {brands.map((brand, index) => (
                                            <Dropdown.Item
                                                key={index}
                                                onClick={() => setFilters({ ...filters, company: brand })}
                                            >
                                                {brand}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col lg={3}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-secondary" className="w-100 shadow-sm">
                                        {filters.status || 'Filter by Status'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setFilters({ ...filters, status: '' })}>
                                            All Statuses
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilters({ ...filters, status: 'Active' })}>
                                            Active
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilters({ ...filters, status: 'Inactive' })}>
                                            Inactive
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col lg={2} className="text-end">
                                <Button variant="outline-secondary" onClick={clearFilters} className="shadow-sm">
                                    Clear Filters
                                </Button>
                            </Col>
                        </Row>

                        {/* Table View */}
                        {viewMode === 'table' && (
                            <Table responsive hover className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Product</th>
                                        <th>Brand</th>
                                        <th>SKU</th>
                                        <th>Amount</th>
                                        <th>Attributes</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'contain',
                                                            borderRadius: '5px',
                                                        }}
                                                        onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
                                                    />
                                                    <div className="ms-3">
                                                        <h6 className="mb-1">{product.name}</h6>
                                                        <p className="text-muted mb-0 small">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{product.brand}</td>
                                            <td>{product.sku}</td>
                                            <td>
                                                <strong>€ {product.amount}</strong>
                                            </td>
                                            <td>
                                                <p className="mb-0 small">
                                                    <strong>Metal Type:</strong> {product.metal} <br />
                                                    <strong>Condition:</strong> {product.condition} <br />
                                                    <strong>Location:</strong> {product.location} <br />
                                                </p>
                                            </td>
                                            <td>
                                                <label className="switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={product.visibility}
                                                        onChange={() => handleVisibilityUpdate(product)}
                                                    />
                                                    <span className="slider round"></span>
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}

                        {/* Enhanced Card View */}
                        {viewMode === 'card' && (
                            <Row>
                                {filteredProducts.map((product, index) => (
                                    <Col lg={3} md={4} sm={6} xs={12} key={index} className="mb-4">
                                        <Card className={`shadow-sm h-100 hover-card ${product.visibility ? "border" : "border border-danger"}`}>
                                            <Card.Img
                                                variant="top"
                                                src={product.image}
                                                style={{
                                                    marginTop: '20px',
                                                    height: '200px',
                                                    objectFit: 'contain',
                                                    borderTopLeftRadius: '8px',
                                                    borderTopRightRadius: '8px',
                                                }}
                                                onError={(e) =>
                                                    (e.target.src = 'https://via.placeholder.com/300')
                                                }
                                            />
                                            <Card.Body>
                                                <Card.Title className="text-truncate" title={product.name}>
                                                    {product.name}
                                                </Card.Title>
                                                <Card.Text className="text-muted small">{product.description}</Card.Text>
                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <h5 className="mb-0 text-primary">€ {product.amount}</h5>
                                                    <Button variant="outline-primary" size="sm" onClick={() => console.log(`Inquiring about: ${product.name}`)}>
                                                        Inquiries
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default EcommerceProducts;
