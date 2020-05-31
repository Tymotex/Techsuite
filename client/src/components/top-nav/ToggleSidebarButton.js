import React from 'react';
import { Button } from 'reactstrap';
import FA from 'react-fontawesome';

export default function SidebarToggleButton({ isSidebarCollapsed, toggleSidebar }) {
  const chevronClassName = isSidebarCollapsed ? 'is-collapsed' : 'is-not-collapsed';
  const screenReaderLabel = isSidebarCollapsed ? 'Expand Sidebar Navigation' : 'Collapse Sidebar Navigation';
  const chevronDirection = isSidebarCollapsed ? 'right' : 'left';
  return (
    <Button onClick={toggleSidebar} className={`m-r sidebar-toggle ${chevronClassName}`} color="primary" aria-label={screenReaderLabel}>
      <FA name={`chevron-${chevronDirection}`} />
    </Button>
  );
}
