'use client';

// Import node module libraries
import { Row, Col, Card, Form, Button, Image, Alert, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import Link from 'next/link';
import axiosInstance from 'utils/axios'; // Axios instance
import { useRouter } from 'next/navigation'; // To handle redirection after form submission

const SignUp = () => {
  const [formData, setFormData] = useState({
    contactPersonName: '',
    contactPersonMobile: '',
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    registeredContactNumber: '',
    password: '',
    confirmPassword: '',
    plan: '', // Store selected plan
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const router = useRouter(); // Hook for redirection

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error for the field being updated
  };

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan === selectedPlan ? '' : plan); // Deselect if already selected
    setFormData({ ...formData, plan: plan === selectedPlan ? '' : plan });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    const { password, confirmPassword } = formData;

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Passwords do not match.',
      }));
      return;
    }

    try {
      // Use Axios instance for API call
      const response = await axiosInstance.post('/users/sign-up', formData);

      // Handle success
      setSuccess(response.data.message || 'User registered successfully!');
      
      // Redirect to "Under Verification" page
      router.push('/under-verification');
    } catch (error) {
      // Handle backend errors
      if (error.response && error.response.data) {
        const backendErrors = {};
        error.response.data.errors.forEach((err) => {
          backendErrors[err.param] = err.msg; // Map backend errors to form field errors
        });
        setErrors(backendErrors);
      } else {
        setErrors({ global: 'An error occurred. Please try again.' });
      }
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={6} lg={8} md={10} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link
                style={{
                  fontSize: '26px',
                  fontWeight: 600,
                  fontFamily: 'sans-serif',
                  textAlign: 'center',
                }}
                href="/"
              >
                Horo Collect
              </Link>
              <p className="mb-6">Please enter your user and company information.</p>
            </div>
            
            {/* Form */}
            <Form onSubmit={handleSubmit}>
              {errors.global && <Alert variant="danger">{errors.global}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {/* Contact Person Section */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="contactPersonName">
                    <Form.Label>Contact Person Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="contactPersonName"
                      placeholder="Enter contact person name"
                      value={formData.contactPersonName}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.contactPersonName}
                    />
                    <Form.Control.Feedback type="invalid">{errors.contactPersonName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="contactPersonMobile">
                    <Form.Label>Contact Person Mobile</Form.Label>
                    <Form.Control
                      type="text"
                      name="contactPersonMobile"
                      placeholder="Enter mobile number"
                      value={formData.contactPersonMobile}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.contactPersonMobile}
                    />
                    <Form.Control.Feedback type="invalid">{errors.contactPersonMobile}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Company Details Section */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="companyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.companyName}
                    />
                    <Form.Control.Feedback type="invalid">{errors.companyName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="companyAddress">
                    <Form.Label>Company Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyAddress"
                      placeholder="Enter company address"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.companyAddress}
                    />
                    <Form.Control.Feedback type="invalid">{errors.companyAddress}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="companyEmail">
                    <Form.Label>Company Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="companyEmail"
                      placeholder="Enter company email"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.companyEmail}
                    />
                    <Form.Control.Feedback type="invalid">{errors.companyEmail}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="registeredContactNumber">
                    <Form.Label>Registered Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="registeredContactNumber"
                      placeholder="Enter contact number"
                      value={formData.registeredContactNumber}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.registeredContactNumber}
                    />
                    <Form.Control.Feedback type="invalid">{errors.registeredContactNumber}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Login Info Section */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {/* Select Plan Section */}
              <Row className="mb-3">
                <Col md={4}>
                  <Card
                    className={`p-3 ${selectedPlan === 'basic' ? 'border-primary' : ''}`}
                    onClick={() => handlePlanSelect('basic')}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body>
                      <Card.Title>Basic Plan</Card.Title>
                      <Card.Text>Essential features</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card
                    className={`p-3 ${selectedPlan === 'premium' ? 'border-primary' : ''}`}
                    onClick={() => handlePlanSelect('premium')}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body>
                      <Card.Title>Premium Plan</Card.Title>
                      <Card.Text>Advanced features</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card
                    className={`p-3 ${selectedPlan === 'enterprise' ? 'border-primary' : ''}`}
                    onClick={() => handlePlanSelect('enterprise')}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body>
                      <Card.Title>Enterprise Plan</Card.Title>
                      <Card.Text>All features included</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Checkbox */}
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="termsCheckbox"
                  label={
                    <>
                      I agree to the <Link href="#">Terms of Service</Link> and{' '}
                      <Link href="#">Privacy Policy</Link>.
                    </>
                  }
                  required
                />
              </Form.Group>

              {/* Submit Button */}
              <div className="d-grid">
                <Button variant="primary" type="submit">
                  Create Free Account
                </Button>
              </div>

              {/* Already a member? */}
              <div className="d-md-flex justify-content-between mt-4">
                <div className="mb-2 mb-md-0">
                  <Link href="/authentication/sign-in" className="fs-5">
                    Already a member? Login
                  </Link>
                </div>
                <div>
                  <Link href="/authentication/forget-password" className="text-inherit fs-5">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignUp;
