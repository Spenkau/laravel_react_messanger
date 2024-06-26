import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";

export default function AddUserToGroupModal({ isAddFriendOpen, setIsAddFriendOpen, groupId }) {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const getFriends = async (retry = true) => {
        try {
            const response = await axios.get(`/friendsInJson`);
            console.log("FRS",response.data)
            setFriends(response.data.data);
        } catch (error) {
            console.error('Ошибка получения списка друзей:', error);
            retry && await getFriends(false);
        }
    };

    const handleAddFriend = async (friendId) => {
        try {
            await axios.post('/group/add-friend', {
                group_id: groupId,
                friend_id: friendId,
            });
            setIsAddFriendOpen(false);
        } catch (error) {
            console.error('Ошибка добавления друга в группу:', error);
        }
    };

    useEffect(() => {
        getFriends();
    }, []);

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Transition.Root show={isAddFriendOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 p-4 overflow-y-auto sm:p-6 md:p-20" onClose={setIsAddFriendOpen}>
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
                                        Добавить друга в группу
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Поиск друзей"
                                        />
                                        <ul className="mt-4 max-h-40 overflow-y-auto">
                                            {filteredFriends.map(friend => (
                                                <li key={friend.id} className="py-2 flex justify-between items-center">
                                                    {friend.name}
                                                    <button
                                                        type="button"
                                                        className="ml-2 px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                                        onClick={() => handleAddFriend(friend.id)}
                                                    >
                                                        Добавить
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                            onClick={() => setIsAddFriendOpen(false)}
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
    );
}
