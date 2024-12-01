'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { 
    Container, 
    Row, 
    Col, 
    Table, 
    Button, 
    Form, 
    InputGroup, 
    Pagination, 
    Card, 
    Spinner, 
    Modal 
} from 'react-bootstrap';
import { BsSearch, BsTrash, BsShieldCheck } from 'react-icons/bs';
import axiosInstance from 'utils/axios';
import { useRouter } from 'next/navigation';

const Users = () => {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [deleteUser, setDeleteUser] = useState(null); // Store user data for delete modal
    const [modalLoading, setModalLoading] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        const checkAuthorization = () => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Retrieve current user from localStorage
            
            if (!currentUser || currentUser.role_id === 3) {
                router.push('/'); // Redirect to dashboard if unauthorized
            } else {
                setIsAuthorized(true); // Allow access to the page
            }
        };

        checkAuthorization();
    }, [router]);



    // Fetch users from the API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);

                // Retrieve the token from cookies
                const token = Cookies.get('authToken');

                if (!token) {
                    setError('Authentication token is missing. Please log in.');
                    setIsLoading(false);
                    return;
                }

                // Make the API call with the token in headers
                const response = await axiosInstance.post(
                    '/users/get-all',
                    {}, // Empty payload for POST request
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Include token
                        },
                    }
                );

                // Set the data safely
                if (response.data.users && Array.isArray(response.data.users)) {
                    setUsers(response.data.users);
                    setFilteredUsers(response.data.users);
                } else {
                    throw new Error('Unexpected API response format');
                }
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to fetch users. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();   
    }, [isAuthorized]);

   

    // Filter users based on the search input
    useEffect(() => {
        if (Array.isArray(users)) {
            const result = users.filter((user) =>
                `${user.username} ${user.email} ${user.companyName}`.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredUsers(result);
            setCurrentPage(1); // Reset to the first page when searching
        }
    }, [search, users]);

    if (isAuthorized === null) {
        return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(filteredUsers)
        ? filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    const totalPages = Math.ceil(
        Array.isArray(filteredUsers) ? filteredUsers.length / itemsPerPage : 0
    );

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // Handle Delete button click (open modal)
    const handleDeleteClick = (user) => {
        setDeleteUser(user); // Store user data for modal
        setShowModal(true); // Show the confirmation modal
    };

    // Handle Confirm Delete
    const confirmDelete = async () => {
        try {
            setModalLoading(true);

            // Call the delete API
            const token = Cookies.get('authToken');
            await axiosInstance.post(
                '/users/delete',
                { userId: deleteUser.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token
                    },
                }
            );

            // Update the UI after deletion
            const updatedUsers = users.filter((user) => user.id !== deleteUser.id);
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);

            // Close the modal
            setShowModal(false);
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user. Please try again.');
        } finally {
            setModalLoading(false);
        }
    };

    // Handle Verify button click
    const handleVerify = async (userId) => {
        try {
            setIsLoading(true); // Optional: Show loading state for individual actions

            // Call the verification status API
            const response = await axiosInstance.post(
                '/users/update-verification-status',
                { userId }, // Pass the userId in the body
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('authToken')}`, // Include token
                    },
                }
            );

            // Check if the response is successful
            if (response.status === 200) {
                // Update user's verification status in the frontend
                const updatedUsers = users.map((user) =>
                    user.id === userId ? { ...user, isVerified: true } : user
                );
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
            }
        } catch (err) {
            console.error('Error verifying user:', err);
            setError('Failed to verify user. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container fluid className="p-4">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h3 className="text-primary fw-bold">User Management</h3>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" className="shadow-sm">
                        Add User
                    </Button>
                </Col>
            </Row>

            {/* Search Bar */}
            <Row className="mb-4">
                <Col lg={6}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search by name, email, or company..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <InputGroup.Text className="bg-light">
                            <BsSearch />
                        </InputGroup.Text>
                    </InputGroup>
                </Col>
            </Row>

            {/* User Table */}
            <Row>
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            {isLoading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" />
                                    <p className="mt-3">Loading users...</p>
                                </div>
                            ) : error ? (
                                <div className="text-danger text-center py-5">
                                    <p>{error}</p>
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted">No users found</p>
                                </div>
                            ) : (
                                <>
                                    <Table responsive className="align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Company</th>
                                                <th>Plan</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((user, index) => (
                                                <tr key={user.id}>
                                                    <td>{indexOfFirstItem + index + 1}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.companyName}</td>
                                                    <td>{user.plan}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${user.isVerified
                                                                ? 'bg-success'
                                                                : 'bg-secondary'
                                                            }`}
                                                        >
                                                            {user.isVerified
                                                                ? 'Verified'
                                                                : 'Unverified'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() =>
                                                                handleDeleteClick(user)
                                                            }
                                                        >
                                                            <BsTrash />
                                                        </Button>
                                                        {!user.isVerified && (
                                                            <Button
                                                                variant="outline-success"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleVerify(user.id)
                                                                }
                                                            >
                                                                <BsShieldCheck />
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>

                                    {/* Pagination */}
                                    <Pagination className="justify-content-center mt-4">
                                        {[...Array(totalPages).keys()].map((pageNumber) => (
                                            <Pagination.Item
                                                key={pageNumber + 1}
                                                active={currentPage === pageNumber + 1}
                                                onClick={() => handlePageChange(pageNumber + 1)}
                                            >
                                                {pageNumber + 1}
                                            </Pagination.Item>
                                        ))}
                                    </Pagination>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Confirmation Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteUser && (
                        <>
                            <p>
                                Are you sure you want to delete the user{' '}
                                <strong>{deleteUser.username}</strong>?
                            </p>
                            <p className="text-muted">
                                This action cannot be undone.
                            </p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={confirmDelete}
                        disabled={modalLoading}
                    >
                        {modalLoading ? (
                            <Spinner as="span" animation="border" size="sm" />
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Users;
