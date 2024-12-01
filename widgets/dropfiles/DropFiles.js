import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Alert, Button, Modal, Table } from 'react-bootstrap';
import { FaCloudUploadAlt, FaTrash, FaFileAlt } from 'react-icons/fa';
import { ExclamationTriangleFill, CheckCircleFill } from 'react-bootstrap-icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const DropFiles = ({ setModalShow }) => {
    const [files, setFiles] = useState([]);
    const [uploadAlert, setUploadAlert] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const router = useRouter()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        },
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                setUploadAlert(
                    <Alert variant="danger" className="text-center">
                        <ExclamationTriangleFill size={25} className="me-1" />
                        Some files were rejected. Please upload only CSV or Excel files.
                    </Alert>
                );
                return;
            }

            setFiles(acceptedFiles);
            setValidationErrors([]); // Reset validation errors
        },
    });

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

    const handleSubmit = async () => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('file', file);
        });

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

            const response = await axios.post('http://localhost:5000/api/products/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const { totalEntries, successfulEntries, failedEntries, errors } = response.data;

                if (failedEntries === 0) {
                    setUploadAlert(
                        <Alert variant="success" className="text-center">
                            <CheckCircleFill size={25} className="me-1" />
                            {`File uploaded successfully! ${successfulEntries} entries added out of ${totalEntries}.`}
                        </Alert>
                    );
                    setModalShow(false); // Close the modal on success
                    router.push("/pages/products/inventory")
                } else {
                    setValidationErrors(errors); // Set validation errors for the modal
                    setUploadAlert(
                        <Alert variant="warning" className="text-center">
                            <ExclamationTriangleFill size={25} className="me-1" />
                            {`File processed with errors! ${failedEntries} failed out of ${totalEntries}.`}
                        </Alert>
                    );
                }
            } else {
                throw new Error('Unexpected response status');
            }

            router.push("/pages/products/inventory")
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadAlert(
                <Alert variant="danger" className="text-center">
                    <ExclamationTriangleFill size={25} className="me-1" />
                    {`Failed to upload file. ${error.response?.data?.message || 'Please try again.'}`}
                </Alert>
            );
        }
    };

    const handleDeleteFile = () => {
        setFiles([]);
        setUploadAlert(null);
        setValidationErrors([]);
    };

    useEffect(() => {
        return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    const dropzoneStyle = {
        cursor: 'pointer',
        padding: '30px',
        border: '2px dashed #007bff',
        borderRadius: '10px',
        textAlign: 'center',
        backgroundColor: isDragActive ? '#e3f2fd' : '#f8f9fa',
        transition: 'background-color 0.3s ease',
        position: 'relative',
    };

    const fileCardStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#f8f9fa',
        padding: '10px 15px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '10px',
    };

    return (
        <section className="container p-3">
            <div {...getRootProps({ className: 'dropzone', style: dropzoneStyle })}>
                <input {...getInputProps()} />
                {files.length === 0 ? (
                    <>
                        <FaCloudUploadAlt style={{ fontSize: '48px', color: '#007bff', marginBottom: '10px' }} />
                        <p style={{ color: '#6c757d', fontSize: '18px', fontWeight: '500' }}>
                            {isDragActive ? 'Drop the files here...' : 'Drag and drop CSV or Excel files here, or click to select files'}
                        </p>
                    </>
                ) : (
                    <div>
                        {files.map((file, index) => (
                            <div key={index} style={fileCardStyle}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaFileAlt style={{ marginRight: '10px', color: '#007bff' }} />
                                    <span style={{ fontWeight: '500', color: '#343a40' }}>{file.name}</span>
                                </div>
                                <Button variant="link" onClick={handleDeleteFile} style={{ padding: 0 }}>
                                    <FaTrash color="red" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Alert */}
            {uploadAlert && <div className="mt-3">{uploadAlert}</div>}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
                <Modal show={validationErrors.length > 0} onHide={() => setValidationErrors([])} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Validation Errors</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Row Number</th>
                                    <th>Error Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {validationErrors.map((error, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {Object.entries(error.product).map(([key, value]) => (
                                                <div key={key}>
                                                    <strong>{key}:</strong> {value}
                                                </div>
                                            ))}
                                            <br />
                                            <strong>Errors:</strong> {error.errors.join(', ')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setValidationErrors([])}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            <div className="text-end mt-4">
                <Button onClick={handleSubmit} className="btn btn-primary btn-lg px-4">
                    Submit
                </Button>
            </div>
        </section>
    );
};
