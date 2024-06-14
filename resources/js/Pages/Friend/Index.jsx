import React, { useState, Fragment } from 'react';
import {Head, Link, usePage} from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Index({ auth }) {
    const { props } = usePage();
    const [friends, setFriends] = useState(props.friends)
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
    const [isRemoveFriendOpen, setIsRemoveFriendOpen] = useState(false);
    const [isFriendRequestsOpen, setIsFriendRequestsOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [newFriendName, setNewFriendName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);

    const handleAddFriend = async (id) => {
        try {
            await axios.post('/friend', { friend_id: id })
                .then(() => alert('Запрос отправлен!'));
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    const handleRemoveFriend = async () => {
        try {
            const response = await axios.delete(`/friend/${selectedFriend.id}`);

            setSelectedFriend(null);
            setFriends(friends.filter(friend => friend.id !== selectedFriend.id))

            alert(response.data.message)

            setIsRemoveFriendOpen(false);
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSearching(true);
        try {
            const response = await axios.get(`/friend/${newFriendName}`);
            setSearchResults(response.data.data);
        } catch (error) {
            console.error('Error searching for friends:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleFriendRequests = async () => {
        try {
            const response = await axios.get('/friend/bid');
            setFriendRequests(response.data.data);
            setIsFriendRequestsOpen(true);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const handleAcceptRequest = async (id) => {
        try {
            await axios.post('/friend/accept', { id });
            setFriendRequests(friendRequests.filter(request => request.id !== id));
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const handleRejectRequest = async (id) => {
        try {
            await axios.post('/friend/reject', { id });
            setFriendRequests(friendRequests.filter(request => request.id !== id));
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Ваши друзья</h2>
                    <button
                        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={handleFriendRequests}
                    >
                        Заявки
                    </button>
                </div>
            }
        >
            <Head title="Друзья"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <button
                                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={() => setIsAddFriendOpen(true)}
                            >
                                Добавить нового друга
                            </button>
                            <ul>
                                {friends.map(friend => (
                                    <li key={friend.id} className="mb-4 flex justify-between items-center">
                                        <span>{friend.name}</span>
                                        <div className={'flex gap-2'}>
                                            <Link href={`/chat/${friend.uuid}`}>
                                                <button
                                                    className="px-4 py-2 bg-blue-600 text-white rounded"

                                                >
                                                    Перейти в чат
                                                </button>
                                            </Link>
                                            <button
                                                className="px-4 py-2 bg-red-600 text-white rounded"
                                                onClick={() => {
                                                    setSelectedFriend(friend);
                                                    setIsRemoveFriendOpen(true);
                                                }}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Transition.Root show={isAddFriendOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setIsAddFriendOpen}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <div className="flex items-center justify-between">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Добавить друга
                                            </Dialog.Title>
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                onClick={() => setIsAddFriendOpen(false)}
                                            >
                                                x
                                            </button>
                                        </div>

                                        <div className="mt-2">
                                            <form onSubmit={handleSubmit}>
                                                <input
                                                    type="text"
                                                    placeholder="Имя друга"
                                                    value={newFriendName}
                                                    onChange={(e) => setNewFriendName(e.target.value)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                                <button
                                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                                                    onClick={handleSubmit}
                                                    disabled={isSearching}
                                                >
                                                    {isSearching ? 'Поиск...' : 'Поиск'}
                                                </button>
                                            </form>
                                            {searchResults.length === 0 && !isSearching && (
                                                <div className="mt-4 text-gray-600">Пользователи не найдены!</div>
                                            )}
                                            <ul className="mt-4">
                                                {searchResults.map(friend => (
                                                    <li
                                                        key={friend.id}
                                                        className="mb-4 flex justify-between items-center cursor-pointer"
                                                    >
                                                        <span>{friend.name}</span>
                                                        <button
                                                            onClick={() => handleAddFriend(friend.id)}
                                                            className="p-3 border-gray-700"
                                                        >
                                                            +
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <Transition.Root show={isRemoveFriendOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setIsRemoveFriendOpen}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Удалить друга
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p>Вы уверены, что хотите удалить этого друга?</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={handleRemoveFriend}
                                    >
                                        Удалить
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => setIsRemoveFriendOpen(false)}
                                    >
                                        Отмена
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <Transition.Root show={isFriendRequestsOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setIsFriendRequestsOpen}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Заявки на дружбу
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            {friendRequests.length === 0 ? (
                                                <p className="text-gray-600">Нет заявок на дружбу.</p>
                                            ) : (
                                                <ul>
                                                    {friendRequests.map(request => (
                                                        <li key={request.id} className="mb-4 flex justify-between items-center">
                                                            <span>{request.name}</span>
                                                            <div>
                                                                <button
                                                                    className="mr-2 px-4 py-2 bg-green-600 text-white rounded"
                                                                    onClick={() => handleAcceptRequest(request.id)}
                                                                >
                                                                    Принять
                                                                </button>
                                                                <button
                                                                    className="px-4 py-2 bg-red-600 text-white rounded"
                                                                    onClick={() => handleRejectRequest(request.id)}
                                                                >
                                                                    Отклонить
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => setIsFriendRequestsOpen(false)}
                                    >
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </AuthenticatedLayout>
    );
}

