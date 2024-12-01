'use client';
// Import required modules and libraries
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import Cookies from 'js-cookie';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsClockHistory } from 'react-icons/bs';
import 'styles/theme.scss';
import NavbarVertical from '/layouts/navbars/NavbarVertical';
import NavbarTop from '/layouts/navbars/NavbarTop';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from 'redux/slices/loaderSlice';
import axiosInstance from 'utils/axios';

export default function DashboardLayout({ children }) {
    const [showMenu, setShowMenu] = useState(true);
    const [loadPage, setLoadPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [verificationPending, setVerificationPending] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter(); // Initialize useRouter for redirection

    const ToggleMenu = () => setShowMenu(!showMenu);

    useEffect(() => {
        const token = Cookies.get('authToken');

        if (!token) {
            // Redirect to sign-in page if token is missing
            router.push('/authentication/sign-in');
            return;
        }

        dispatch(showLoader());

        const fetchUsers = async () => {
            try {
                setIsLoading(true);

                // Fetch user data from API
                const response = await axiosInstance.post(
                    '/users/get-all',
                    {}, // Empty payload for POST request
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Process response
                if (response.data.users && Array.isArray(response.data.users)) {
                    setUsers(response.data.users);

                    // Get current user from localStorage
                    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
                    const foundUser = response.data.users.find((user) => user.id === storedUser?.id);

                    setCurrentUser(foundUser);

                    // Check if the user is under verification
                    if (foundUser && !foundUser.isVerified) {
                        setVerificationPending(true);
                    }
                } else {
                    throw new Error('Unexpected API response format');
                }
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to fetch users. Please try again.');
            } finally {
                setIsLoading(false);
                dispatch(hideLoader());
                setLoadPage(true);
            }
        };

        fetchUsers();
    }, []);

    // Show the "Under Verification" UI if verification is pending
    if (verificationPending) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <Row>
                    <Col xs={12} md={8} lg={6} className="mx-auto">
                        <Card className="shadow-lg border-0">
                            <Card.Body className="text-center py-5">
                                <div className="text-primary mb-4">
                                    <BsClockHistory size={60} />
                                </div>
                                <h3 className="fw-bold text-primary mb-3">
                                    Your Account is Under Verification
                                </h3>
                                <p className="text-muted mb-4">
                                    Thank you for signing up! Our team is currently reviewing your account information. This process usually takes up to <strong>24 hours</strong>.
                                    <br />
                                    We'll notify you as soon as the verification is complete.
                                </p>
                                <Button
                                    variant="primary"
                                    className="shadow-sm px-4"
                                    onClick={() => console.log('Redirecting to support page...')}
                                >
                                    Contact Support
                                </Button>
                                <p className="mt-4 text-muted">
                                    If you have any questions or need assistance, feel free to reach out to us.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    // Main dashboard layout
    return (
        loadPage && (
            <div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
                <div className="navbar-vertical navbar">
                    <NavbarVertical
                        showMenu={showMenu}
                        onClick={(value) => setShowMenu(value)}
                    />
                </div>
                <div id="page-content">
                    <div className="header">
                        <NavbarTop
                            data={{
                                showMenu: showMenu,
                                SidebarToggleMenu: ToggleMenu,
                            }}
                        />
                    </div>
                    {children}
                </div>
            </div>
        )
    );
}
