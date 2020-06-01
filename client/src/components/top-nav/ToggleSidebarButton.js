import React from 'react';
import { Button } from 'reactstrap';
import FA from 'react-fontawesome';

import { ChevronsLeft, ChevronsRight } from 'react-feather';
import { NeonButton } from '../neon-button';

export default function SidebarToggleButton({ isSidebarCollapsed, toggleSidebar }) {
	const chevronClassName = isSidebarCollapsed ? 'is-collapsed' : 'is-not-collapsed';
	const screenReaderLabel = isSidebarCollapsed ? 'Expand Sidebar Navigation' : 'Collapse Sidebar Navigation';
	return (
		<NeonButton toggleModal={toggleSidebar} aria-label={screenReaderLabel}>
			{(isSidebarCollapsed) ? (
				<ChevronsRight />
			) : (
				<ChevronsLeft />
			)}
		</NeonButton>
	);
}
