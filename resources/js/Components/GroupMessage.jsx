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
                                    <button className="mr-1" onClick={() => replyHandleState(message)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 100 100"
                                            id="reply"
                                            fill="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                d="M13.6 39.4l28 28c1.3 1.3 3.4.4 3.4-1.4V51.8c.6 0 1.2-.1 1.7-.1 12.8 0 23.2 10.3 23.2 22.9 0 5.2-1.8 9.7-5.4 14-1.4 1.6.5 4.1 2.4 3.1C79.5 85.3 87 73.4 87 59.9c0-20.2-16.7-36.5-37.3-36.5-1.6 0-3.3.1-4.7.3V10c0-1.8-2.1-2.7-3.4-1.4l-28 28c-.8.8-.8 2 0 2.8zm4.2-1.4L41 14.8V26c0 1.2 1.1 2.2 2.4 2 1.6-.3 4-.7 6.4-.7C68.1 27.3 83 41.9 83 59.9c0 9.1-3.9 17.5-10.7 23.4 1-2.7 1.6-5.6 1.6-8.6 0-14.9-12.2-26.9-27.2-26.9-3.1 0-5.7 0-5.7 2.2v11.2L17.8 38z"/>
                                            <path d="M384-510v1684h-1784V-510H384m8-8h-1800v1700H392V-518z"/>
                                        </svg>
                                    </button>
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
