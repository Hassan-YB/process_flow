import React from 'react';

// react-bootstrap
import { Card } from 'react-bootstrap';

import Visa from "../../../assets/img/visa.svg"
import Master from "../../../assets/img/master.svg"

// ==============================|| ORDER CARD ||============================== //

const PaymentCard = ({ params }) => {
    let cardClass = ['order-card'];
    if (params.class) {
        cardClass = [...cardClass, params.class];
    }

    let iconClass = ['float-start'];
    if (params.icon) {
        iconClass = [...iconClass, params.icon];
    }

    const cardImage = params.cardType === "visa" ? Visa : params.cardType === "master" ? Master : null;

    return (
        <Card className={cardClass.join(' ')} style={{minHeight:'172px'}}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        {params.title}
                    </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    **** **** **** {params.cardLastDigits}
                    </span>
                    <span>
                    {cardImage && <img src={cardImage} alt={params.cardType} style={{ width: "40px" }} />}
                    </span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PaymentCard;
