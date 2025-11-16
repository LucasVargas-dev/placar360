import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
	pt: {
		translation: {
			form: {
				typeToSearch: 'Digite para buscar',
				search: 'Buscar',
			},
			select: 'Selecione',
			loadingMore: 'Carregando...',
			noResultsFound: 'Nenhum resultado encontrado',
		},
	},
};

void i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: 'pt',
		fallbackLng: 'pt',
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;


