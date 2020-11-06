import React from 'react';
import { Row, Col } from 'reactstrap';
import fieldStyles from './BioField.module.scss';

const BioField = ({ field, value }) => {
    return (
        <Row>
            <Col xs={4} className={fieldStyles.leftContainer}>
                <div className={`h5 text-muted ${fieldStyles.leftField}`}>{field}:</div>
            </Col>
            <Col xs={8} className={fieldStyles.rightContainer}>
                <div className={`h5 text-muted ${fieldStyles.rightField}`}>{value}</div>
            </Col>
        </Row>
    );
}

export default BioField;