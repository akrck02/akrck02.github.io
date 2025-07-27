const DEFAULT_CONFIGURATION_ID = "gtd";

/**
 * The id of the configuration used in the LocalStorage API
 * NOTE: Change this value with your app name.
 */
let configurationId = "papiro-config";

/**
 * Load a JSON file as the configuration of the app
 * @param path The file path
 */
export async function loadConfiguration(path: string) {
	assertIdHasBeenChanged();
	const loadedConfiguration = await fetch(path).then((res) => res.json());

	if (null != localStorage[configurationId]) {
		const loaded = JSON.stringify(loadedConfiguration);
		for (const key in loadedConfiguration) {
			setConfiguration(key, loadedConfiguration[key]);
		}
	} else {
		localStorage[configurationId] = JSON.stringify(loadedConfiguration);
	}
}

/**
 * Set a configuration parameter
 * @param id The configuration parameter id
 * @param value The value to set
 */
export function setConfiguration(id: string, value: string) {
	assertIdHasBeenChanged();
	const configuration = JSON.parse(localStorage[configurationId] || "{}");
	configuration[id] = value;
	localStorage.setItem(configurationId, JSON.stringify(configuration));
}

/**
 * Get configuration value
 * @param id The parameter id
 * @returns The parameter value
 */
export function getConfiguration(id: string) {
	assertIdHasBeenChanged();
	const configuration = JSON.parse(localStorage[configurationId]);
	return configuration[id];
}

export function isConfigurationActive(id: string) {
	return getConfiguration(id) == true;
}

/**
 * Assert that the id has been changed
 */
function assertIdHasBeenChanged() {}

export function setConfigurationId(id: string) {
	configurationId = id;
}
