import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {INITIAL_SETTINGS} from "@/constants.js";
import {Settings} from "@/settings.js";

const SettingsModal = ({ isOpen, onClose, settings, setSettings }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSettings({...settings, [name]: value})

        console.log(Settings.get())
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     localStorage.setItem('settings', JSON.stringify(settings));
    //     onClose();
    // };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 p-4 overflow-y-auto sm:p-6 md:p-20" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-25" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="relative bg-white rounded-lg shadow-xl transform transition-all max-w-lg w-full mx-auto">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Настройки
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <form>
                                            <div className="mb-4">
                                                <label htmlFor="background" className="block text-sm font-medium text-gray-700">
                                                    Цвет фона
                                                </label>
                                                <input
                                                    type="color"
                                                    id="background"
                                                    name="background"
                                                    value={settings.background}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="sidebar_text_color" className="block text-sm font-medium text-gray-700">
                                                    Цвет текста в боковой панели
                                                </label>
                                                <input
                                                    type="color"
                                                    id="sidebar_text_color"
                                                    name="sidebar_text_color"
                                                    value={settings.sidebar_text_color}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="sidebar_text_size" className="block text-sm font-medium text-gray-700">
                                                    Размер текста в боковой панели
                                                </label>
                                                <input
                                                    type="text"
                                                    id="sidebar_text_size"
                                                    name="sidebar_text_size"
                                                    value={settings.sidebar_text_size}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="chat_text_color" className="block text-sm font-medium text-gray-700">
                                                    Цвет текста в чате
                                                </label>
                                                <input
                                                    type="color"
                                                    id="chat_text_color"
                                                    name="chat_text_color"
                                                    value={settings.chat_text_color}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="chat_text_size" className="block text-sm font-medium text-gray-700">
                                                    Размер текста в чате
                                                </label>
                                                <input
                                                    type="text"
                                                    id="chat_text_size"
                                                    name="chat_text_size"
                                                    value={settings.chat_text_size}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                                                    onClick={onClose}
                                                >
                                                    Отмена
                                                </button>
                                                    {/*<button*/}
                                                    {/*    type="submit"*/}
                                                    {/*    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"*/}
                                                    {/*>*/}
                                                    {/*    Сохранить*/}
                                                    {/*</button>*/}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition.Root>
    );
};

export default SettingsModal;
