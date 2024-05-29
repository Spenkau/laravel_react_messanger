import React, { useState } from 'react';
import { Link } from "@inertiajs/react";
import ProfilePictureOnChat from "@/Components/ProfilePictureOnChat.jsx";

export default function HeaderGroupBox({ group, isTyping, settings }) {
    return (
        <>
            <div className="flex items-center px-3 py-3 border-gray-700">
                <Link href={route('group.index')} className="flex lg:hidden items-center -ml-2 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                    </svg>
                </Link>
                <div className="relative inline-block">
                        <ProfilePictureOnChat entity={group.image_url ? [group.image_url, group.name] : group} />
                </div>
                <div className="flex flex-col flex-1 min-w-0 ml-4">
                    <div className="text-xs lg:text-sm font-medium text-gray-100 truncate" style={{ color: settings.chat_text_color }}>
                        {group.name}
                    </div>
                    <div className="text-gray-400 text-[10px] lg:text-xs truncate mt-0.5 tracking-tight">
                        {/*{*/}
                        {/*    isTyping ? `${user.name} is typing...` : (*/}
                        {/*        isOnline ? 'Online' : `${user.last_seen_at}`*/}
                        {/*    )*/}
                        {/*}*/}
                    </div>
                </div>
            </div>
        </>
    )
}
