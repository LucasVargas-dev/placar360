import { CSSProperties } from 'react';
import { Prism } from 'react-syntax-highlighter';
import {
	coldarkDark as darkSyntax,
	oneLight as lightSyntax,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

export type SyntaxHighlighterProps = {
	jsonStr: string;
	language?: string;
	theme?: string;
	style?: Record<string, CSSProperties>;
};

/**
 * SyntaxHighlighter component to display JSON strings with syntax highlighting.
 * @param {string} root0
 * @param {string} root0.language
 * @param {string} root0.theme
 * @param {string} root0.jsonStr
 * @param {string} root0.style
 *
 * @returns {JSX.Element} - A Prism component with highlighted JSON.
 */
export function SyntaxHighlighter({
	language = 'json',
	theme = 'light',
	jsonStr,
	style,
}: SyntaxHighlighterProps) {
	return (
		<Prism
			language={language}
			style={style ? style : theme == 'light' ? lightSyntax : darkSyntax}
		>
			{JSON.stringify(JSON.parse(jsonStr), null, 2)}
		</Prism>
	);
}
