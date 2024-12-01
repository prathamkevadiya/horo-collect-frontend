'use client';
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BsClockHistory } from 'react-icons/bs';

const AccountUnderVerification = () => {
    const handleSupportClick = () => {
        // Redirect or handle the support/help action
        console.log('Redirecting to support page...');
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Row>
                <Col xs={12} md={8} lg={6} className="mx-auto">
                    <Card className="shadow-lg border-0">
                        <Card.Body className="text-center py-5">
                            {/* Icon */}
                            <div className="text-primary mb-4">
                                <BsClockHistory size={60} />
                            </div>
                            
                            {/* Title */}
                            <h3 className="fw-bold text-primary mb-3">
                                Your Account is Under Verification
                            </h3>

                            {/* Description */}
                            <p className="text-muted mb-4">
                                Thank you for signing up! Our team is currently reviewing your account information. This process usually takes up to <strong>24 hours</strong>.
                                <br />
                                We'll notify you as soon as the verification is complete.
                            </p>

                            {/* Call to Action */}
                            <Button
                                variant="primary"
                                className="shadow-sm px-4"
                                onClick={handleSupportClick}
                            >
                                Contact Support
                            </Button>

                            {/* Additional Message */}
                            <p className="mt-4 text-muted">
                                If you have any questions or need assistance, feel free to reach out to us.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AccountUnderVerification;
