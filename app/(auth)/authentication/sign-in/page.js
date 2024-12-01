'use client';

// Import required libraries
import { useState } from 'react';
import { Row, Col, Card, Form, Button, Image, Alert } from 'react-bootstrap';
import Link from 'next/link';
import axiosInstance from 'utils/axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';


const SignIn = () => {
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [otp, setOtp] = useState('');
  const [otpIdentifier, setOtpIdentifier] = useState(null); // To store userId for OTP verification
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // Step 1: Sign-In, Step 2: OTP Verification
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // Handle input change for form fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear errors for the specific field
  };

  // Handle OTP input
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length <= 6) setOtp(value);
  };

  // Resend OTP
  const resendCode = async () => {
    if (isResendDisabled) return;

    try {
      setIsResendDisabled(true);
      setResendTimer(60);
      await handleSignIn(); // Reuse Sign-In to resend OTP

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setErrors({ global: 'Failed to resend OTP. Please try again.' });
    }
  };

  // Handle Sign-In form submission
  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    setErrors({});
    setSuccess('');

    try {
      const response = await axiosInstance.post('/users/sign-in', formData);
      setSuccess(response.data.message || 'OTP sent to your email.');
      toast.success('OTP sent to your email. Please verify.');
      setOtpIdentifier(response.data.userId); // Store userId for OTP verification
      setStep(2); // Move to OTP verification
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid credentials.';
      setErrors({ global: message });
      toast.error(message);
    }
  };

  // Handle OTP Verification
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    if (!otpIdentifier || otp.length !== 6) {
      setErrors({ global: 'Please provide a valid OTP.' });
      toast.error("Please provide a valid OTP.")
      return;
    }

    try {
      const response = await axiosInstance.post('/users/verify-otp', {
        userId: otpIdentifier,
        otp,
      });

      // Store user data and token
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      Cookies.set('authToken', response.data.token, { path: '/', expires: 7 });
      toast.success("Sing-in Successfully")
      router.push('/'); // Redirect to dashboard
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid or expired OTP.';
      toast.error(message)
      setErrors({ global: message });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4 text-center">
              <Link style={{
                fontSize: "26px",
                fontWeight: 600,
                fontFamily: "sans-serif",
                textAlign: "center",
              }} href="/" >
                Horo Collect
              </Link>
              <p className="mb-6">
                {step === 1
                  ? 'Please enter user information.'
                  : 'Verify the OTP sent to your email.'}
              </p>
            </div>

            {/* Alerts */}
            {/* {errors.global && <Alert variant="danger">{errors.global}</Alert>}
            {success && <Alert variant="success">{success}</Alert>} */}

            {/* Step 1: Sign-In */}
            {step === 1 && (
              <Form onSubmit={handleSignIn}>
                <Form.Group className="mb-3">
                  <Form.Label>Email or Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="emailOrPhone"
                    placeholder="Enter email or Phone number"
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="********"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pr-5"
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        zIndex: 10,
                        color: '#6c757d',
                      }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="primary">
                    Sign In
                  </Button>
                </div>
              </Form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <Form onSubmit={handleOTPVerification}>
                <div className="mb-4">
                  <h4 className="text-center">Verify Account</h4>
                  <p className="text-muted text-center">
                    Enter the 6-digit code sent to your email.
                  </p>
                </div>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter OTP"
                    required
                    className="text-center"
                    style={{ fontSize: '24px', letterSpacing: '8px' }}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="primary">
                    Verify OTP
                  </Button>
                </div>

                <p className="mt-3 text-center">
                  Didn’t receive a code?{' '}
                  {isResendDisabled ? (
                    <span className="text-muted">Resend in {resendTimer}s</span>
                  ) : (
                    <Button
                      variant="link"
                      className="p-0 text-decoration-underline"
                      onClick={resendCode}
                    >
                      Resend Code
                    </Button>
                  )}
                </p>
              </Form>
            )}

            <div className="d-md-flex justify-content-between mt-4">
              <Link href="/authentication/sign-up" className="fs-5">
                New User?
              </Link>
              <Link href="/authentication/forget-password" className="fs-5">
              Forgot Password?
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
