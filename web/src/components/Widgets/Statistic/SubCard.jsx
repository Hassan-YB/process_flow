import React from 'react';

// react-bootstrap
import { Card } from 'react-bootstrap';

// ==============================|| ORDER CARD ||============================== //

const SubCard = ({ params }) => {
    let cardClass = ['order-card'];
    if (params.class) {
        cardClass = [...cardClass, params.class];
    }

    let iconClass = ['float-start'];
    if (params.icon) {
        iconClass = [...iconClass, params.icon];
    }

    return (
        <Card className={cardClass.join(' ')} style={{ minHeight: '172px' }}>
            <Card.Body>
                <div className='d-flex flex-column justify-content-between'>
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        {params.title}
                    </span>
                    <span
                        style={{
                            color: params.status === "active" ? "#7aff7a" : "#f44336",
                            borderRadius: "10px",
                            padding: "5px 10px",
                            fontSize: "18px",
                            fontWeight: "bold",
                        }}
                    >
                        {params.status}
                    </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-0">
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        {params.planName}
                    </span>
                    {params.validUntil && (
                        <span>
                            Valid until
                        </span>
                    )}
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        {params.planAmount}
                    </span>
                    <span>
                        {params.validUntil}
                    </span>
                </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default SubCard;
