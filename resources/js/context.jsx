// SettingsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {Settings} from "@/settings.js";

const SettingsContext = createContext();

export const useSettings = () => {
    return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(Settings.get());

    useEffect(() => {
        Settings.set(settings);
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
