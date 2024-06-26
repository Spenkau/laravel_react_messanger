import React, { Fragment, useState } from 'react';
import { Head, Link } from "@inertiajs/react";
import { Dialog, Transition } from '@headlessui/react';
import ProfilePictureOnChat from "@/Components/ProfilePictureOnChat.jsx";
import { PlusCircleIcon } from "@heroicons/react/20/solid/index.js";
import AddUserToGroupModal from "@/Components/AddUserToGroupModal.jsx";

export default function HeaderGroupBox({ group, isTyping, settings, role_id, groupUser, auth }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

    const checkGrants = () => {
        return groupUser.pivot.role_id === 3 || groupUser.pivot.role_id === 2
    }

    const handleRemoveUser = async (user) => {
        try {
            await axios.delete(`/group/${group.id}/user/${user.id}`);

            alert(`Пользователь ${user.name} удален из группы`);
        } catch (error) {
            console.error('Ошибка при удалении пользователя из группы:', error);
        }
    };

    const handleChangeRole = async (roleId, user) => {
        if (!checkGrants()) {
            alert('У вас недостаточно прав!')
            return;
        }

        try {
            await axios.put(`/group/${group.id}/user/${user.id}/role`, { role_id: roleId });
            console.log(`Роль пользователя ${user.name} изменена на ${roleId}`);
        } catch (error) {
            console.error('Ошибка при изменении роли пользователя:', error);
        }
    };

    const handleRoleChange = (e, user) => {
        const roleId = parseInt(e.target.value, 10);
        handleChangeRole(roleId, user);
    };

    const destroyGroup = async () => {
        const res = await axios.delete(`/group/${group.id}`)

        alert(res.data.message)

        window.location.href = '/group'
    }

    return (
        <>
            <Head title={'Группы'} />

            <div className="flex items-center px-3 py-3 border-gray-700">
                <Link href={route('group.index')} className="flex lg:hidden items-center -ml-2 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-5 h-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                    </svg>
                </Link>
                <div className="relative inline-block">
                    <ProfilePictureOnChat entity={group.image_url ? [group.image_url, group.name] : group} />
                </div>
                <div className="flex flex-col flex-1 min-w-0 ml-4">
                    <div
                        className="text-xs lg:text-sm font-medium text-gray-100 truncate cursor-pointer"
                        style={{ color: settings.chat_text_color }}
                        onClick={() => setIsProfileOpen(true)}
                    >
                        {group.name}
                    </div>
                </div>
                {
                    (groupUser.pivot.role_id === 3 || groupUser.pivot.role_id === 2) &&
                    <button onClick={() => setIsAddFriendOpen(true)}>
                        <PlusCircleIcon width={30} height={30} fill='gray'/>
                    </button>
                }

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
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            {group.name}
                                        </Dialog.Title>
                                        <div className="mt-2 flex justify-between">
                                            <p>{group.description}</p>
                                            {
                                                (groupUser.pivot.role_id === 3 || groupUser.pivot.role_id === 2) &&
                                                <button onClick={destroyGroup} className={"inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"}>
                                                    Удалить группу
                                                </button>
                                            }
                                        </div>
                                        <p className={'mt-2'}>Пользователи: </p>
                                        <hr/>
                                        <ul className={'w-full mt-2 flex flex-col gap-3'}>
                                            {group.users.map(user => (
                                                <li key={user.id} className={"flex justify-between w-full"}>
                                                    <p><strong>{user.name}</strong></p>
                                                    <div className={'flex gap-3'}>
                                                        {
                                                            (groupUser.pivot.role_id === 3 || groupUser.pivot.role_id === 2)
                                                            && (auth.user.id !== user.id)
                                                            ? <div className={'flex gap-3'}>
                                                                    <button onClick={() => handleRemoveUser(user)}>Удалить</button>
                                                                    <select value={user.pivot.role_id}
                                                                            onChange={() => handleRoleChange(event, user)}>
                                                                        <option value={0}>Пользователь</option>
                                                                        <option value={2}>Модератор</option>
                                                                        <option value={3}>Администратор</option>
                                                                    </select>
                                                                </div>
                                                            :
                                                                <p>{user.pivot.role_id === 0 ? 'Пользователь' : user.pivot.role_id === 1 ? 'Модератор' : user.pivot.role_id === 3 ? 'Администратор' : 'Пользователь'}</p>

                                                        }
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
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
                groupId={group.id}
            />
        </>
    )
}

