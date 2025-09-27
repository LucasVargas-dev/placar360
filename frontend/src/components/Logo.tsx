import React from 'react'
import logotipo from '../assets/logotipo-1-placar360.png'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function Logo({ size = 'medium', className = '' }: LogoProps) {
  const sizeStyles = {
    small: { width: '96px', height: '96px' },
    medium: { width: '128px', height: '128px' },
    large: { width: '192px', height: '192px' }
  }

  return (
    <img
      src={logotipo}
      alt="Placar360"
      style={{
        ...sizeStyles[size],
        objectFit: 'contain'
      }}
      className={className}
    />
  )
}
