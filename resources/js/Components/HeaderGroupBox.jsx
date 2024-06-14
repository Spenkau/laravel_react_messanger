import React, { Fragment, useState } from 'react';
import { Link } from "@inertiajs/react";
import { Dialog, Transition } from '@headlessui/react';
import ProfilePictureOnChat from "@/Components/ProfilePictureOnChat.jsx";
import {PlusCircleIcon} from "@heroicons/react/20/solid/index.js";
import AddUserToGroupModal from "@/Components/AddUserToGroupModal.jsx";

export default function HeaderGroupBox({ group, isTyping, settings }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [friends, setFriends] = useState([
        { id: 1, name: 'Друг 1' },
        { id: 2, name: 'Друг 2' },
        { id: 3, name: 'Друг 3' },
    ]);

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="flex items-center px-3 py-3 border-gray-700">
                <Link href={route('group.index')} className="flex lg:hidden items-center -ml-2 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-5 h-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"/>
                    </svg>
                </Link>
                <div className="relative inline-block">
                    <ProfilePictureOnChat entity={group.image_url ? [group.image_url, group.name] : group}/>
                </div>
                <div className="flex flex-col flex-1 min-w-0 ml-4">
                    <div
                        className="text-xs lg:text-sm font-medium text-gray-100 truncate cursor-pointer"
                        style={{color: settings.chat_text_color}}
                        onClick={() => setIsProfileOpen(true)}
                    >
                        {group.name}
                    </div>
                </div>
                <button onClick={() => setIsAddFriendOpen(true)}>
                    <PlusCircleIcon width={30} height={30} fill='gray'/>
                </button>
            </div>

            <Transition.Root show={isProfileOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 p-4 overflow-y-auto sm:p-6 md:p-20" onClose={setIsProfileOpen}>
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
                                            {group.name}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p>{group.description}</p>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                type="button"
                                                className="px-4 border-none py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                                onClick={() => setIsProfileOpen(false)}
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

            <AddUserToGroupModal
                isAddFriendOpen={isAddFriendOpen}
                setIsAddFriendOpen={setIsAddFriendOpen}
                friends={friends}
                setFriends={setFriends}
                filteredFriends={filteredFriends}
            />
        </>
    )
}
