import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { Avatar } from '../../UI';

export default function Avatars() {
  return (
    <React.Fragment>
      <Card>
        <CardHeader>Initials</CardHeader>
        <CardBody>
          <Avatar initials="JS" color="primary" size="lg" /> <Avatar initials="TD" color="secondary" size="lg" />{' '}
          <Avatar initials="AP" color="warning" size="md" /> <Avatar initials="PT" color="danger" size="md" />{' '}
          <Avatar initials="JS" color="primary" /> <Avatar initials="TD" color="secondary" />{' '}
          <Avatar initials="AP" color="warning" size="sm" /> <Avatar initials="PT" color="danger" size="sm" />{' '}
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Images</CardHeader>
        <CardBody>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
