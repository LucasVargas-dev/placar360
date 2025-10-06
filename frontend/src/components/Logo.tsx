import logotipo from '../assets/logo-placar360.jpeg'

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
