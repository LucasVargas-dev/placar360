import { PropsWithChildren } from 'react'
import { Header } from '../../navigation/Header'

type LayoutVariant = 'default' | 'scrollable'

type LayoutProps = PropsWithChildren<{
  withHeader?: boolean
  className?: string
  pageVariant?: LayoutVariant
}>

export function Layout({
  children,
  withHeader = true,
  className,
  pageVariant = 'default',
}: LayoutProps) {
  const mainClassName = [
    'flex-1',
    pageVariant === 'scrollable' ? 'overflow-auto' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {withHeader ? <Header /> : null}
      <main className={mainClassName}>{children}</main>
    </div>
  )
}
