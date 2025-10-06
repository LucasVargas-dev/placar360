import React, { useState } from 'react';
import { colors } from '../styles/colors';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeItem?: string;
  onItemClick: (item: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  section?: string;
}

const menuItems: MenuItem[] = [
  // Página Inicial
  { id: 'home', label: 'Página Inicial', icon: '🏠' },
  
  // CLUBES Section
  { id: 'book-court', label: 'Reservar Quadra', icon: '📅', section: 'CLUBES' },
  { id: 'bookings', label: 'Reservas/Partidas', icon: '✅', section: 'CLUBES' },
  { id: 'game-invites', label: 'Convites de Jogos', icon: '👥', section: 'CLUBES' },
  { id: 'orders', label: 'Comandas', icon: '🧾', section: 'CLUBES' },
  
  // TORNEIOS Section
  { id: 'my-registrations', label: 'Minhas Inscrições', icon: '📋', section: 'TORNEIOS' },
  { id: 'previous-tournaments', label: 'Torneios Anteriores', icon: '🏆', section: 'TORNEIOS' },
  
  // USUÁRIO Section
  { id: 'friends', label: 'Amigos', icon: '👫', section: 'USUÁRIO' },
  { id: 'my-account', label: 'Minha Conta', icon: '👤', section: 'USUÁRIO' },
  { id: 'validate-qr', label: 'Validar QR Code', icon: '📱', section: 'USUÁRIO' },
  
  // GRUPO Section
  { id: 'terms', label: 'Termos e Condições', icon: '📄', section: 'GRUPO' },
  { id: 'privacy', label: 'Políticas de Privacidade', icon: '🏛️', section: 'GRUPO' },
  { id: 'contact', label: 'Fale Conosco', icon: '✉️', section: 'GRUPO' },
  
  // Logout
  { id: 'logout', label: 'Sair', icon: '🚪' },
];

export function Sidebar({ isOpen, onToggle, activeItem = 'my-account', onItemClick }: SidebarProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('Português');

  const handleItemClick = (itemId: string) => {
    onItemClick(itemId);
  };

  const renderMenuItems = () => {
    const sections: { [key: string]: MenuItem[] } = {};
    const standaloneItems: MenuItem[] = [];

    menuItems.forEach(item => {
      if (item.section) {
        if (!sections[item.section]) {
          sections[item.section] = [];
        }
        sections[item.section].push(item);
      } else {
        standaloneItems.push(item);
      }
    });

    return (
      <>
        {/* Standalone items (Página Inicial) */}
        {standaloneItems.map(item => (
          <div key={item.id}>
            <button
              onClick={() => handleItemClick(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0.875rem 1.25rem',
                marginBottom: '0.5rem',
                backgroundColor: activeItem === item.id ? colors.orange.base : 'transparent',
                color: activeItem === item.id ? colors.white : colors.text.primary,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.95rem',
                fontWeight: '500',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (activeItem !== item.id) {
                  e.currentTarget.style.backgroundColor = colors.green.medium + '20';
                  e.currentTarget.style.color = colors.text.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (activeItem !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.text.primary;
                }
              }}
            >
              <span style={{ fontSize: '1.25rem', marginRight: '0.75rem' }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          </div>
        ))}

        {/* Sectioned items */}
        {Object.entries(sections).map(([sectionName, items]) => (
          <div key={sectionName} style={{ marginTop: '1.5rem' }}>
            {/* Section Header */}
            <div style={{
              padding: '0.5rem 1.25rem 0.75rem',
              color: colors.text.secondary,
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {sectionName}
            </div>

            {/* Section Items */}
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.875rem 1.25rem',
                  marginBottom: '0.5rem',
                  backgroundColor: activeItem === item.id ? colors.orange.base : 'transparent',
                  color: activeItem === item.id ? colors.white : colors.text.primary,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.backgroundColor = colors.green.medium + '20';
                    e.currentTarget.style.color = colors.text.secondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeItem !== item.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.text.primary;
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem', marginRight: '0.75rem' }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            display: 'block'
          }}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: isOpen ? '280px' : '0',
          backgroundColor: colors.green.dark,
          zIndex: 999,
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          boxShadow: isOpen ? '4px 0 20px rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        {/* Top Bar */}
        <div style={{
          height: '60px',
          backgroundColor: colors.green.medium,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          borderBottom: `1px solid ${colors.green.border}`
        }}>
          {/* Hamburger Menu */}
          <button
            onClick={onToggle}
            style={{
              background: 'none',
              border: 'none',
              color: colors.white,
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease'
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

          {/* Logo/Title */}
          <div style={{
            color: colors.white,
            fontSize: '1.1rem',
            fontWeight: '600',
            flex: 1,
            textAlign: 'center',
            marginLeft: '-2rem' // Offset for hamburger button
          }}>
            PLACAR360
          </div>
        </div>

        {/* Menu Content */}
        <div style={{
          height: 'calc(100vh - 60px)',
          overflowY: 'auto',
          padding: '1rem 0'
        }}>
          {renderMenuItems()}

          {/* Language Selector */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1.25rem',
            right: '1.25rem'
          }}>
            <div style={{
              color: colors.text.secondary,
              fontSize: '0.8rem',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              Idioma:
            </div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: colors.green.medium,
                color: colors.white,
                border: `1px solid ${colors.green.border}`,
                borderRadius: '6px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="Português">Português</option>
              <option value="English">English</option>
              <option value="Español">Español</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
