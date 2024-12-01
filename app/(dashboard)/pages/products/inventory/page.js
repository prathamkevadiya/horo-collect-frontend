'use client';
import { useEffect, useState } from 'react';
import { Row, Col, Container, Button, Modal, Form, Table, InputGroup, FormControl, Badge } from 'react-bootstrap';
import { DropFiles, PageHeading } from 'widgets'; // Import custom components
import useMounted from 'hooks/useMounted';
import Link from 'next/link';
import './Inventory.css'; // Import custom CSS file for styling
import { redirect } from 'next/navigation';
import { ActiveProjects } from 'sub-components';
import axiosInstance from 'utils/axios';

const Inventory = () => {
    const hasMounted = useMounted();
    const [modalShow, setModalShow] = useState(false);
    const [csvData, setCsvData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const itemsPerPage = 5; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(1);


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


    const fetchProductsByUser = async () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser?.id) {
            console.error('No user ID found in localStorage.');
            return;
        }

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

            const { data } = await axiosInstance.post('/products/by-user',
                {
                    user_id: currentUser.id,    
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            setCsvData(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Fetch data from API
    useEffect(() => {

        fetchProductsByUser();
    }, []);


    const handleCsvDataUpdate = (data) => {
        setCsvData(data);
        localStorage.setItem('csvData', JSON.stringify(data));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const filtered = csvData.filter(product =>
            product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [csvData, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    function MyVerticallyCenteredModal(props) {
        return (
            <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Upload Products</Modal.Title>
                </Modal.Header>
                {hasMounted && (
                    <Form action="#" className="dropzone py-2 border-dashed">
                        <Modal.Body>
                            <Row className="">
                                <Col md={12}>
                                    <DropFiles setModalShow={setModalShow} setCsvData={handleCsvDataUpdate} />
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Form>
                )}
            </Modal>
        );
    }

    return (
        <Container fluid className="p-6">
            <Row>
                <Col lg={12} md={12} xs={12}>
                    <PageHeading heading="Inventory" />
                </Col>
            </Row>

            <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />

            <ActiveProjects csvData={csvData} setModalShow={setModalShow} fetchProductsByUser={fetchProductsByUser} />
        </Container>
    );
};

export default Inventory;
