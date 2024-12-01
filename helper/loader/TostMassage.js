'use client';

import { useSelector } from "react-redux";

const Toasts = () => {

    const loading = useSelector((state) => state.loader.toast);

    if (!loading) return null;

    return (
        <Fragment>
            <Row>
                <Col md={6} className="mb-2">
                    <Button onClick={toggleShowA} className="mb-2">
                        Toggle Toast <strong>with</strong> Animation
                    </Button>
                    <Toast className="mb-4" show={showA} onClose={toggleShowA}>
                        <Toast.Header>
                            <Image src="https://fakeimg.pl/20x20/754FFE/754FFE/" className="rounded me-2" alt="" />
                            <strong className="me-auto">Bootstrap</strong>
                            <small>just now</small>
                        </Toast.Header>
                        <Toast.Body>See? Just like this.</Toast.Body>
                    </Toast>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Toasts