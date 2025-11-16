import { HTMLAttributes } from 'react'
import logoImage from '../../assets/logotipo-1-placar360.png'

type LogoSize = 'small' | 'medium' | 'large'

type LogoProps = {
  size?: LogoSize
} & HTMLAttributes<HTMLImageElement>

const sizeClassMap: Record<LogoSize, string> = {
  small: 'h-8',
  medium: 'h-10',
  large: 'h-14',
}

export function Logo({ size = 'medium', className = '', ...props }: LogoProps) {
  const sizeClass = sizeClassMap[size] ?? sizeClassMap.medium
  const classes = ['object-contain', sizeClass, className].filter(Boolean).join(' ')

  return (
    <img
      src={logoImage}
      alt="Placar360"
      className={classes}
      {...props}
    />
  )
}


