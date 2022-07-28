import React from 'react';
import { EmptyFiller } from '../../components/empty-filler';

const Empty = ({ children }) => {
	return (
		<EmptyFiller>
			{children}
		</EmptyFiller>
	);
}

export default Empty;