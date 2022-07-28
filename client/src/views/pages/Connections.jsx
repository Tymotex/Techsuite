import React from 'react';
import { ConnectionsList } from '../../components/connections-list';
import ContentContainer from '../../components/container/ContentContainer';

class Connections extends React.Component {
  render() {
    return (
      <ContentContainer>
        <ConnectionsList />
      </ContentContainer>
    );
  }
}

export default Connections;
