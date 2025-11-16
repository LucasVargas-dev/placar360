import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar o estado de abertura de um picker,
 * garantindo que apenas um esteja aberto por vez via eventos customizados.
 * @param {string} id - Identificador único do picker (ex: 'time-name' ou 'date-name').
 * @returns {object} Objeto com estado e funções para abrir/fechar.
 */
export const usePicker = (id: string) => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		/**
		 * Fecha este picker se outro foi aberto.
		 * @param {CustomEvent<string>} event - O evento customizado.
		 */
		const handleOtherPickerOpened = (event: CustomEvent<string>) => {
			if (event.detail !== id) {
				setIsOpen(false);
			}
		};

		// Escuta eventos globais no window
		window.addEventListener(
			'pickerOpened',
			handleOtherPickerOpened as EventListener
		);

		return () => {
			window.removeEventListener(
				'pickerOpened',
				handleOtherPickerOpened as EventListener
			);
		};
	}, [id]);

	/**
	 * Abre este picker e notifica outros para fecharem.
	 */
	const open = () => {
		window.dispatchEvent(new CustomEvent('pickerOpened', { detail: id }));
		setIsOpen(true);
	};

	/**
	 * Fecha este picker.
	 */
	const close = () => {
		setIsOpen(false);
	};

	return { isOpen, open, close };
};
