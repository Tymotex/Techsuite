import React from 'react';
import { ConnectionsList } from '../../components/connections-list';

class Connections extends React.Component {
    render() {
        return (
            <div>
                {/* Add new connection form: */}
                <ConnectionsList />
            </div>
        )
    }
}

export default Connections;
