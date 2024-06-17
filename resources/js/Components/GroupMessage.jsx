import React, {useState, useEffect, Fragment} from 'react';
import {Link, useForm, usePage} from '@inertiajs/react';
import {Dialog, Transition} from '@headlessui/react';
import axios from 'axios';
import DateChatIndicator from "@/Components/DateChatIndicator.jsx";
import {PencilSquareIcon} from "@heroicons/react/20/solid/index.js";

export default function GroupMessage({messages, settings, auth, setIsEdit, setSelectedMessage}) {

    const formatDate = (date) => {
        const today = new Date();
        const messageDate = new Date(date);

        if (messageDate.toDateString() === today.toDateString()) {
            return 'Сегодня';
        } else if (messageDate.getDate() === today.getDate() - 1) {
            return 'Вчера';
        } else {
            return messageDate.toLocaleDateString();
        }
    };

    const sortedMessages = messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const groupedMessages = sortedMessages.reduce((acc, message) => {
        const date = formatDate(message.created_at);

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push(message);

        return acc;
    }, {});

    const handleChangeMessage = (message) => {
        setIsEdit(true);
        setSelectedMessage(message)
    }

    return (
        <>
            {Object.keys(groupedMessages).map((date, index) => (
                <React.Fragment key={index}>
                    <DateChatIndicator date={date} settings={settings}/>
                    {groupedMessages[date].map((message, index) => (
                        <div
                            key={index}
                            className={`col-span-12 ${message.user_id === auth.user.id ? 'text-right' : 'text-left'}`}
                        >
                            <div
                                className={`inline-block my-2 p-2 text-gray-400 rounded-lg relative group ${message.user_id === auth.user.id ? 'self-end' : 'self-start'}`}
                            >
                                {!message.deleted_at ? (
                                    <div className="break-all whitespace-pre-wrap">
                                        <p className="text-left text-[9px] lg:text-[10px] text-gray-400/70"
                                           style={{color: settings.chat_text_color}}>{!(message.user_name === auth.user.name) ? message.user_name : 'Вы'}</p>
                                        <p className="text-justify mb-2 max-w-xl whitespace-normal"
                                           style={{color: settings.chat_text_color}}>{message.message}</p>
                                        <div className="text-[9px] lg:text-[10px] text-gray-400/70 mt-1"
                                             style={{color: settings.chat_text_color}}>
                                            {message.created_at.match(/\d{2}:\d{2}:\d{2}/)}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center justify-center mr-1 text-xs italic text-center select-none"
                                        style={{color: settings.chat_text_color}}>
                                        Сообщение удалено
                                    </div>
                                )}
                                <div
                                    className={`absolute top-0 bottom-0 ${message.user_id === auth.user.id ? 'left-0 -ml-14' : 'right-0 -mr-14'} flex flex-row items-center justify-center text-xs text-gray-700 opacity-0 group-hover:opacity-100`}
                                >
                                    {
                                        message.user_id === auth.user.id
                                        &&
                                        <>
                                            <button onClick={() => handleChangeMessage(message)}>
                                                <PencilSquareIcon width={16} height={16}/>
                                            </button>
                                            <Link as="button" method="delete"
                                                  href={route('group.message.destroy', {message: message.id})}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-4 h-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                    />
                                                </svg>
                                            </Link>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </React.Fragment>
            ))}
        </>
    );
}
