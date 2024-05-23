import React, {useEffect} from 'react';
import MineProfileChat from "@/Components/MineProfileChat.jsx";
import SearchChatBar from "@/Components/SearchChatBar.jsx";
import ChatListUser from "@/Components/ChatListUser.jsx";
import {router, usePage} from "@inertiajs/react";
import {debounce} from "lodash";
import Menu from "@/Components/Menu.jsx";
import Index from "@/Pages/Group/Index.jsx";
import GroupListUser from "@/Components/GroupListUser.jsx";

export default function ({children}) {
    const {auth} = usePage().props;

    useEffect(() => {
        const debouncedReload = debounce(() => {
            router.reload({
                preserveScroll: true,
                only: ['messages', 'users'],
            });
        }, 350);

        Echo.private('message.' + auth.user.uuid)
            .listen('ReadMessageEvent', () => {
                debouncedReload();
            })
            .listen('NewMessageEvent', () => {
                debouncedReload();
            });

        return () => {
            Echo.private('message.' + auth.user.uuid)
                .stopListening('ReadMessageEvent', () => {
                    debouncedReload();
                })
                .stopListening('NewMessageEvent');
        };
    }, []);

    const renderSidebarScreen = () => {
        const currentPath = route().current();
        let className = "px-5 py-2 pb-5 lg:w-1/3 lg:border-r lg:border-gray-700 "

        if (currentPath === 'chat.index') className += "flex flex-col w-full"
        else className += "hidden flex-col lg:flex"

        return className;
    }

    return (
        <>
            <div className="relative min-h-screen bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="px-6 mx-auto max-w-screen-2xl xl:px-0">
                    <div className="h-screen py-6">
                        <div className="flex h-full overflow-hidden border border-gray-700 rounded-lg shadow">
                            <div className={renderSidebarScreen()}>
                                <MineProfileChat auth={auth}/>
                                <Menu/>
                                <SearchChatBar/>
                                {route().current() === 'chat.index' && <ChatListUser/>}
                                {route().current() === 'group.index' && <GroupListUser />}
                            </div>

                            {children}

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
