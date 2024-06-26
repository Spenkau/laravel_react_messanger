import React, {useEffect, useState} from 'react';
import { useForm, usePage } from "@inertiajs/react";
import {CheckCircleIcon} from "@heroicons/react/20/solid/index.js";

export default function GroupInputMessage(props) {
    const { group } = usePage().props;
    const [messageAttachments, setMessageAttachments] = useState(null);
    const { data, setData, reset, put, post, processing } = useForm({
        id: props.selectedMessage?.id || null,
        group_id: group.id,
        message: '',
        reply_id: props.reply?.id,
        message_attachments: messageAttachments
    });

    useEffect(() => {
        setData('reply_id', props.reply?.id);
    }, [props.reply]);

    useEffect(() => {
        if (props.isEdit && props.selectedMessage) {
            setData('id', props.selectedMessage.id);
            setData('message', props.selectedMessage.message);
        } else {
            setData('id', null);
            setData('message', '');
        }
    }, [props.isEdit, props.selectedMessage]);

    const handleInputChange = (e) => {
        setData('message', e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const customKeyEvent = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!processing && data.message) {
                submitHandler(e);
            }
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (props.isEdit) {
            put(route('group.message.update', props.selectedMessage.id), {
                data: {
                    id: props.selectedMessage.id,
                    group_id: data.group_id,
                    message: data.message,
                },
                onSuccess: (page) => {
                    props.setMessages(page.props.group_messages);
                    reset();
                    props.setIsEdit(false);
                    props.setSelectedMessage(null);
                },
                onError: () => {
                    props.setIsEdit(false);
                    props.setSelectedMessage(null);
                },
                preserveScroll: true,
            });
        } else {
            post(route('group.message.store'), {
                data: {
                    group_id: data.group_id,
                    message: data.message,
                    reply_id: data.reply_id,
                    message_attachments: data.message_attachments,
                },
                onSuccess: (page) => {
                    props.setMessages(page.props.group_messages);
                    reset();
                    e.target.style.height = 'auto';
                    props.setReply(null);
                    props.setIsTyping(false);
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <form className="flex items-center flex-1" onSubmit={submitHandler}>
            <textarea
                name="message"
                id="message"
                autoComplete="off"
                className="flex-1 py-1.5 text-xs lg:text-sm bg-transparent border-0 rounded-md focus:ring-0"
                placeholder="Type a message"
                value={data.message}
                rows={1}
                onChange={handleInputChange}
                onKeyDown={customKeyEvent}
                style={{ maxHeight: '100px', resize: 'none', overflowY: data.message ? 'auto' : 'hidden' }}
            />

            {
                props.isEdit
                    ? <button type="submit" disabled={processing}>
                        <CheckCircleIcon width={30} height={30} color={'darkblue'} />
                    </button>
                    : <button type="submit" disabled={processing}
                              className="flex items-center justify-center w-8 h-8 -mt-1 text-gray-500 transition duration-150 rotate-45 rounded-full lg:w-10 lg:h-10 hover:text-gray-400 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-4 h-4 lg:w-5 lg:h-5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
            }
        </form>
    );
}
