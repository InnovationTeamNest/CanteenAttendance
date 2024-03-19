type Languages = {
	[key: string]: TranslationMap;
};

type TranslationMap = {
	[key: string]: string;
};

type Translator = (key: string) => string;

function createTranslator(language: string): Translator {
	// Load translations based on the language specifier
	const translations: TranslationMap = loadTranslations(language);

	// Return the translation function
	return function tr(key: string): string {
		// Check if the translation exists for the given key
		// eslint-disable-next-line no-prototype-builtins
		if (translations.hasOwnProperty(key)) {
			return translations[key];
		}

		// If no translation is found, return the key itself
		return key;
	};
}

function loadTranslations(language: string): TranslationMap {
	// Load translations based on the language specifier
	// For simplicity, we'll use a hardcoded translation map here
	const translations: Languages = {
		'it-IT': {
			'Current reservations': 'Prenotazioni attuali',
			'Event name': 'Nome evento',
			'Start time': 'Orario inizio',
			'End time': 'Orario fine',
			Add: 'Aggiungi',
			Close: 'Chiudi',
			'The start time must be before the end time!':
				"L'orario di inizio deve essere prima dell'orario di fine!",
			"You can't book the room for more than 4 hours!":
				'Non puoi prenotare la stanza per più di 4 ore!',
			"You can't book this far into the future!": 'Non puoi prenotare così lontano nel futuro!',
			"You can't book a spot in the past!": 'Non puoi prenotare nel passato!',
			'There is already a reservation at this time!': "C'è già una prenotazione a questo orario!",
			'Invalid event name: you may only use letters, numbers and the following symbols: _ ) ( ".':
				'Nome evento non valido: puoi utilizzare solo lettere, numeri e i seguenti simboli: _ ) ( ".',
			'Start time was sent in an incompatible format. This should not happen: contact an administrator.':
				"L'orario di inizio è stato inviato in un formato non compatibile. Questo non dovrebbe accadere: contatta un amministratore.",
			'End time was sent in an incompatible format. This should not happen: contact an administrator.':
				"L'orario di fine è stato inviato in un formato non compatibile. Questo non dovrebbe accadere: contatta un amministratore.",
			'Event date was sent in an incompatible format (accepted format is YYYY-MM-DD). This should not happen: contact an administrator.':
				"La data dell'evento è stata inviata in un formato non compatibile (il formato accettato è YYYY-MM-DD). Questo non dovrebbe accadere: contatta un amministratore.",
			'There was an error in validating the start time. Please contact an administrator.':
				'Si è verificato un errore nella convalida dell orario di inizio. Contatta un amministratore.',
			'There was an error in validating the end time. Please contact an administrator.':
				'Si è verificato un errore nella convalida dell orario di fine. Contatta un amministratore.'
		},
		it: { __alias: 'it-IT' },
		__default: { __alias: 'it-IT' }
	};

	if (translations[language] && translations[language].__alias) {
		return translations[translations[language].__alias];
	}

	if (!translations[language]) {
		// If the language is not found, default to English by taking the keys from
		// the default language
		const englishKeys = loadTranslations('__default');
		const languageKeys: TranslationMap = {};
		Object.keys(englishKeys).forEach((key) => {
			languageKeys[key] = key;
		});
		return languageKeys;
	}
	return translations[language];
}

export default createTranslator;
