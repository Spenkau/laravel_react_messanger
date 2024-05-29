import React, { useState, useEffect, Fragment } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export default function GroupMenu({ settings }) {
    const { group } = usePage().props;
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [isSearchGroupOpen, setIsSearchGroupOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const { data, setData, post, reset } = useForm({
        name: '',
        description: '',
        image: null
    });

    const handleCreateGroup = (event) => {
        event.preventDefault();
        post('/group', {
            onSuccess: () => {
                setIsCreateGroupOpen(false);
                reset();
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    const handleSearchGroups = debounce(async (term) => {
        if (term) {
            try {
                const response = await axios.get(`/group?title=${term}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error(error);
            }
        } else {
            setSearchResults([]);
        }
    }, 300);

    useEffect(() => {
        handleSearchGroups(searchTerm);
    }, [searchTerm]);

    return (
        <>
            <div className="flex justify-between p-4">
                <button
                    onClick={() => setIsCreateGroupOpen(true)}
                    className="flex items-center justify-center px-4  text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    Создать группу
                </button>
                <button
                    onClick={() => setIsSearchGroupOpen(true)}
                    className="flex items-center justify-center px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={20} height={20} viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                    </svg>
                    Найти группу
                </button>
            </div>

            <Transition.Root show={isCreateGroupOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 p-4 overflow-y-auto sm:p-6 md:p-20" onClose={setIsCreateGroupOpen}>
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
                                            Создать группу
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <form onSubmit={handleCreateGroup}>
                                                <div className="mb-4">
                                                    <label htmlFor="group-name"
                                                           className="block text-sm font-medium text-gray-700">
                                                        Название группы
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="group-name"
                                                        name="name"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        placeholder="Введите название группы"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="group-description"
                                                           className="block text-sm font-medium text-gray-700">
                                                        Описание группы
                                                    </label>
                                                    <textarea
                                                        id="group-description"
                                                        name="description"
                                                        value={data.description}
                                                        onChange={(e) => setData('description', e.target.value)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        placeholder="Введите описание группы"
                                                    />
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                                                        onClick={() => setIsCreateGroupOpen(false)}
                                                    >
                                                        Отмена
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                    >
                                                        Создать
                                                    </button>
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

            <Transition.Root show={isSearchGroupOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 p-4 overflow-y-auto sm:p-6 md:p-20" onClose={setIsSearchGroupOpen}>
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
                                            Найти группу
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Введите название группы"
                                            />
                                            <ul className="mt-4">
                                                {searchResults.map((group) => (
                                                    <li key={group.id} className="mb-2">
                                                        <a href={`/groups/${group.id}`} className="text-blue-600 hover:underline">
                                                            {group.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button
                                                type="button"
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                                                onClick={() => setIsSearchGroupOpen(false)}
                                            >
                                                Закрыть
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition.Root>
        </>
    );
}
