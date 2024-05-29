import {INITIAL_SETTINGS} from "@/constants.js";
import {useState} from "react";

class Settings {
    static get() {
        return JSON.parse(localStorage.getItem('settings')) ?? INITIAL_SETTINGS;
    }

    static set(object) {
        return localStorage.setItem('settings', JSON.stringify(object));
    }

    static getProperty(propertyName) {
        const settings = this.get();

        return settings ? settings[propertyName] : INITIAL_SETTINGS[propertyName]
    }
}

const useSettings = () => {
    const [settings, setSettings] = useState(() => {
        return Settings.get();
    });

    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        Settings.set(newSettings);
    };

    return [settings, updateSettings];
};

export { useSettings, Settings};
