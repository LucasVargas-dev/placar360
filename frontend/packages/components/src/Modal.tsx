import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export type ModalSize = 'sm' | 'md' | 'md-lg' | 'semi-lg' | 'lg' | 'xl';

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	titleElement?: ReactNode;
	size?: ModalSize;
	children: ReactNode;
	footerButtons?: ReactNode;
	className?: string;
} & ComponentPropsWithoutRef<'div'>;

const sizeStyles = {
	sm: 'max-w-[24rem]',
	md: 'max-w-[32rem]',
	'md-lg': 'max-w-[36rem]',
	'semi-lg': 'max-w-[40rem]',
	lg: 'max-w-[48rem]',
	xl: 'max-w-[64rem]',
};

/**
 * Modal component
 * @param {object} root0
 * @param {boolean} root0.isOpen
 * @param {Function} root0.onClose
 * @param {string} root0.title
 * @param {ReactNode} root0.titleElement
 * @param {string} root0.size
 * @param {ReactNode} root0.children
 * @param {string} root0.className
 * @param {ReactNode} root0.footerButtons
 *
 * @returns {any}
 */
export function Modal({
	isOpen,
	onClose,
	title,
	titleElement,
	size = 'md',
	children,
	footerButtons,
	className = '',
	...rest
}: ModalProps) {
	if (!isOpen) return null;

	/**
	 * Render title element
	 * @returns {ReactNode}
	 */
	const renderTitle = () => {
		if (titleElement) {
			return titleElement;
		}

		if (title) {
			return <h2 className='text-xl font-semibold mb-4 pr-8'>{title}</h2>;
		}

		return null;
	};

	const modalContent = (
		<div className='fixed inset-0 flex items-center justify-center bg-black backdrop-blur-[2px] bg-opacity-20 z-50'>
			<div
				className={`relative text-secondary-900 p-6 rounded-2xl shadow-2xl w-full ${sizeStyles[size]} ${className}`}
				{...rest}
			>
				<div className='pb-0 space-y-4'>
					{renderTitle()}
					<button
						onClick={onClose}
						className='absolute top-6 right-6 text-secondary-900 hover:text-secondary-900 dark:text-white dark:hover:text-secondary-500 text-2xl leading-none'
						aria-label='Fechar'
					>
						<X />
					</button>
				</div>

				<div className='space-y-4'>{children}</div>

				{footerButtons && (
					<div className='flex justify-end items-center border-t border-secondary-300 dark:border-primary-300 pt-4 mt-6 gap-2'>
						{footerButtons}
					</div>
				)}
			</div>
		</div>
	);
	return createPortal(modalContent, document.body);
}

export default Modal;
