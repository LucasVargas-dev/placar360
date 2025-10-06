import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { colors } from '../styles/colors';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('my-account');

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    console.log('Clicked item:', item);
    
    // Handle different menu items
    switch (item) {
      case 'logout':
        // Handle logout logic
        console.log('Logging out...');
        break;
      case 'my-account':
        // Navigate to account page
        console.log('Navigating to account...');
        break;
      case 'book-court':
        // Navigate to court booking
        console.log('Navigating to court booking...');
        break;
      default:
        console.log(`Navigating to ${item}...`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background.gradientFrom,
      display: 'flex'
    }}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        activeItem={activeItem}
        onItemClick={handleItemClick}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        backgroundColor: colors.background.gradientFrom,
        background: `linear-gradient(135deg, ${colors.background.gradientFrom} 0%, ${colors.background.gradientVia} 50%, ${colors.background.gradientTo} 100%)`
      }}>
        {/* Top Bar for Mobile */}
        <div style={{
          height: '60px',
          backgroundColor: colors.green.medium,
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.25rem',
          borderBottom: `1px solid ${colors.green.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 997
        }}>
          <button
            onClick={handleToggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: colors.white,
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
              marginRight: '1rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.green.dark + '40';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ☰
          </button>
          
          <div style={{
            color: colors.white,
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            PLACAR360
          </div>
        </div>

        {/* Page Content */}
        <div style={{
          padding: '2rem',
          minHeight: 'calc(100vh - 60px)'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
