import React, {useEffect, useState} from 'react';
import MineProfileChat from "@/Components/MineProfileChat.jsx";
import SearchChatBar from "@/Components/SearchChatBar.jsx";
import ChatListUser from "@/Components/ChatListUser.jsx";
import {router, usePage} from "@inertiajs/react";
import {debounce} from "lodash";
import Menu from "@/Components/Menu.jsx";
import GroupListUser from "@/Components/GroupListUser.jsx";
import GroupMenu from "@/Components/GroupMenu.jsx";
import {useSettings} from "@/settings.js";
import {INITIAL_SETTINGS} from "@/constants.js";
import {SettingsProvider} from "@/context.jsx";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function App({children}) {
    const props = usePage().props;
    const {auth} = props;
    const [settings, setSettings] = useSettings();

    useEffect(() => {
        if (!settings) {
            setSettings(INITIAL_SETTINGS);
        }

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

    const   renderSidebarScreen = () => {
        const currentPath = route().current();
        let className = "px-5 py-2 pb-5 lg:w-1/3 lg:border-r lg:border-t rounded lg:border-gray-700 "

        if (currentPath === 'chat.index') className += "flex flex-col w-full"
        else className += "hidden flex-col lg:flex"

        return className;
    }

    const renderChatList = () => {
        if (route().current().includes('chat')) {
            return (
                <>
                    <SearchChatBar settings={settings}/>
                    <ChatListUser settings={settings}/>
                </>
            )
        } else if (route().current().includes('group')) {
            return (
                <>
                    <GroupMenu settings={settings}/>
                    <GroupListUser settings={settings}/>
                </>
            )
        }
    }
    console.log(route().current())
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Общение</h2>}
        >
            <SettingsProvider>
                <div className="relative min-h-screen selection:bg-red-500 selection:text-white"
                     style={{"backgroundColor": settings.background}}>
                    <div className="px-6 mx-auto max-w-screen-2xl xl:px-0">
                        <div className="py-6 bg-violet-50 h-full border border-gray-700 rounded-lg shadow">
                            <div className="flex">
                                <div className={renderSidebarScreen()} style={{color: settings.sidebar_text_color}}>
                                    <MineProfileChat auth={auth} settings={settings} setSettings={setSettings}/>
                                    <Menu settings={settings} setSettings={setSettings}/>
                                    {/*<ChatListUser />*/}
                                    {renderChatList()}
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsProvider>
        </AuthenticatedLayout>
    )
}

App.layout = (page) => <AuthenticatedLayout children={page}/>;

