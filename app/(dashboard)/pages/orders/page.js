'use client';
import { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Tab,
    Tabs,
    Table,
    Spinner,
    Card,
    Alert,
    Dropdown,
    DropdownButton
} from 'react-bootstrap';
import Cookies from 'js-cookie';
import axiosInstance from 'utils/axios';
import { BsArrowRepeat, BsThreeDotsVertical } from 'react-icons/bs';

const InquiriesPage = () => {
    const [activeTab, setActiveTab] = useState('sent'); // Track active tab
    const [sentInquiries, setSentInquiries] = useState([]);
    const [receivedInquiries, setReceivedInquiries] = useState([]);
    const [allInquiries, setAllInquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch inquiries based on tab
    useEffect(() => {
        const fetchInquiries = async () => {
            setIsLoading(true);
            setError('');
            try {
                const token = Cookies.get('authToken');
                if (!token) {
                    throw new Error('Authentication token is missing.');
                }

                let endpoint = '';
                switch (activeTab) {
                    case 'sent':
                        endpoint = '/inquiries/sent'; // API endpoint for sent inquiries
                        break;
                    case 'received':
                        endpoint = '/inquiries/recive'; // API endpoint for received inquiries
                        break;
                    default:
                        break;
                }

                const response = await axiosInstance.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (activeTab === 'sent') {
                    setSentInquiries(response.data);
                } else if (activeTab === 'received') {
                    setReceivedInquiries(response.data);
                }
            } catch (err) {
                console.error('Error fetching inquiries:', err);
                setError('Failed to fetch inquiries. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInquiries();
    }, [activeTab]);

    // Update Inquiry Status API
    const updateStatus = async (id, status) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Authentication token is missing.');
            }

            await axiosInstance.post(
                '/inquiries/updatestatus',
                { id, status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Refresh the data after updating
            if (activeTab === 'sent') {
                setSentInquiries((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, order_status: status } : item
                    )
                );
            } else if (activeTab === 'received') {
                setReceivedInquiries((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, order_status: status } : item
                    )
                );
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status. Please try again later.');
        }
    };

    const renderTable = (data) => {
        if (isLoading) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-3">Loading inquiries...</p>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            );
        }

        if (!data.length) {
            return (
                <div className="text-center py-5">
                    <p className="text-muted">No inquiries found</p>
                </div>
            );
        }

        return (
            <Table responsive className="align-middle">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Metal Type</th>
                        <th>Launch Year</th>
                        <th>Condition</th>
                        <th>Note</th>
                        <th>Price</th>
                        {
                            activeTab === 'received' && <th>Actions</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        console.log(item)
                        if (item.order_status === 'Accept') {
                            return (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.model_no}</td>
                                    <td>{item.brand}</td>
                                    <td>{item.metal_type}</td>
                                    <td>{item.launch_year}</td>
                                    <td>{item.condition}</td>
                                    <td>{item.note}</td>
                                    <td>${item.total_price}</td>

                                    {
                                        activeTab === 'received' && <td>
                                            <DropdownButton
                                                id="status-dropdown"
                                                title="Update Status"
                                                size="sm"
                                                variant="outline-primary"
                                                onSelect={(status) => updateStatus(item.id, status)}
                                            >
                                                <Dropdown.Item eventKey="Accept">Accept</Dropdown.Item>
                                                <Dropdown.Item eventKey="Reject">Reject</Dropdown.Item>
                                            </DropdownButton>
                                        </td>
                                    }

                                </tr>
                            )
                        }

                    })}
                </tbody>
            </Table>
        );
    };

    return (
        <Container fluid className="p-4">
            <Row>
                <Col>
                    <h3 className="text-primary fw-bold">Inquiries Management</h3>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(tab) => setActiveTab(tab)}
                                className="mb-3"
                            >
                                <Tab eventKey="sent" title="My Orders">
                                    {renderTable(sentInquiries)}
                                </Tab>
                                <Tab eventKey="received" title="Received Orders">
                                    {renderTable(receivedInquiries)}
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default InquiriesPage;
