import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PickerContextType {
	currentOpenPicker: string | null;
	setCurrentOpenPicker: (pickerId: string | null) => void;
}

const PickerContext = createContext<PickerContextType | undefined>(undefined);

interface PickerProviderProps {
	children: ReactNode;
}

/**
 * Context provider to manage the state of open pickers (DatePicker, TimePicker).
 * @param {object} root0
 * @param {ReactNode} root0.children
 * @returns {JSX.Element}
 */
export const PickerProvider: React.FC<PickerProviderProps> = ({ children }) => {
	const [currentOpenPicker, setCurrentOpenPicker] = useState<string | null>(
		null
	);

	return (
		<PickerContext.Provider value={{ currentOpenPicker, setCurrentOpenPicker }}>
			{children}
		</PickerContext.Provider>
	);
};

/**
 * Custom hook to use the PickerContext.
 * @returns {PickerContextType}
 * @throws Will throw an error if used outside of a PickerProvider.
 */
export const usePickerContext = () => {
	const context = useContext(PickerContext);
	if (!context) {
		throw new Error('usePickerContext must be used within a PickerProvider');
	}
	return context;
};
