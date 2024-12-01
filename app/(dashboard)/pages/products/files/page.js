'use client';

import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import * as XLSX from 'xlsx';
import axiosInstance from 'utils/axios'; // Assuming axiosInstance is configured
import Cookies from 'js-cookie';

const UploadHistory = () => {
    const [uploadHistory, setUploadHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUploadHistory = async () => {
            try {
                setLoading(true);
                const token = Cookies.get('authToken'); // Get token from cookies

                if (!token) {
                    throw new Error('Authentication token is missing.');
                }

                const user = JSON.parse(localStorage.getItem("currentUser"))

                const response = await axiosInstance.post(
                    '/upload-history/by-user',
                    { user_id: user.id }, // Replace with actual user_id logic if needed
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data && response.data.history) {
                    setUploadHistory(response.data.history);
                } else {
                    setUploadHistory([]);
                }
            } catch (err) {
                console.error('Error fetching upload history:', err);
                setError('Failed to fetch upload history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUploadHistory();
    }, []);

    const downloadFile = async (entry) => {
        try {
            const response = await axiosInstance.get(`/products/download/${entry.id}`, {
                responseType: 'blob', // Ensure we receive a blob (binary data)
                headers: {
                    Authorization: `Bearer ${Cookies.get('authToken')}`,
                },
            });

            const contentDisposition = response.headers['content-disposition'];
            const fileName = contentDisposition
                ? contentDisposition.split('filename=')[1]
                : entry.fileName;

            downloadBlob(response.data, fileName, response.headers['content-type']);
        } catch (err) {
            console.error('Error downloading file:', err);
            alert('Failed to download the file. Please try again.');
        }
    };

    const downloadBlob = (content, filename, contentType) => {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Container fluid className="p-4">
            <h3 className="mt-4 mb-3">Upload History</h3>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger" className="text-center">
                    <ExclamationTriangleFill size={25} className="me-2" />
                    {error}
                </Alert>
            ) : uploadHistory.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Date</th>
                            <th>Total Entries</th>
                            <th>Successful Entries</th>
                            <th>Errored Entries</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploadHistory.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.fileName}</td>
                                <td>{new Date(entry.uploadDate).toLocaleString()}</td>
                                <td>{entry.totalEntries}</td>
                                <td>{entry.successfulEntries}</td>
                                <td>{entry.erroredEntries ?? 0}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        onClick={() => downloadFile(entry)}
                                        className="rounded-pill"
                                    >
                                        Download
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant="info" className="text-center">
                    <ExclamationTriangleFill size={25} className="me-2" />
                    No upload history available.
                </Alert>
            )}
        </Container>
    );
};

export default UploadHistory;
