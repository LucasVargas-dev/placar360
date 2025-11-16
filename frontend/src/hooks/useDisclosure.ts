import { useCallback, useState } from 'react';

type UseDisclosureReturn = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	onToggle: () => void;
	setIsOpen: (state: boolean) => void;
};

/**
 * Simple disclosure helper to centralize modal visibility logic.
 */
export function useDisclosure(initialState = false): UseDisclosureReturn {
	const [isOpen, setIsOpen] = useState(initialState);

	const onOpen = useCallback(() => setIsOpen(true), []);
	const onClose = useCallback(() => setIsOpen(false), []);
	const onToggle = useCallback(() => setIsOpen(previous => !previous), []);

	return {
		isOpen,
		onOpen,
		onClose,
		onToggle,
		setIsOpen,
	};
}


