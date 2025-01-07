import React from 'react';

// react-bootstrap
import { Card } from 'react-bootstrap';

// ==============================|| ORDER CARD ||============================== //

const InvoiceCard = ({ params, onStatusClick }) => {
    let cardClass = ['order-card'];
    if (params.class) {
        cardClass = [...cardClass, params.class];
    }

    let iconClass = ['float-start'];
    if (params.icon) {
        iconClass = [...iconClass, params.icon];
    }

    return (
        <Card className={cardClass.join(' ')} style={{minHeight:'162px'}}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        {params.title}
                    </span>
                    <span
                        style={{
                            background: params.status === "active" ? "#4caf50" : "#f44336",
                            color: "white",
                            borderRadius: "10px",
                            padding: "5px 10px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            cursor: params.status === "Cancel" ? "pointer" : "default",
                        }}
                        onClick={params.status === "Cancel" ? onStatusClick : undefined}
                    >
                        {params.status}
                    </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-0">
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        Your next bill is
                    </span>
                    <span>
                    {params.nextBill}
                    </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    on
                    </span>
                    <span>
                    {params.nextBillDate}
                    </span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default InvoiceCard;
