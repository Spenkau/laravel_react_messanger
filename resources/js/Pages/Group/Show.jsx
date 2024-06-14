import React, {Fragment, useEffect, useRef, useState} from 'react';
import App from "@/Layouts/App.jsx";
import {Link, usePage} from "@inertiajs/react";
import GroupInputMessage from "@/Components/GroupInputMessage.jsx";
import {useSettings} from "@/context.jsx";
import HeaderGroupBox from "@/Components/HeaderGroupBox.jsx";
import GroupMessage from "@/Components/GroupMessage.jsx";

export default function Show() {
    const {auth, group_messages: messages, group} = usePage().props;
    const {settings} = useSettings();
    const scrollRef = useRef(null)
    const [reply, setReply] = useState(null)
    const [isTyping, setIsTyping] = useState(null)
    const [isEdit, setIsEdit] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current?.scrollHeight)
    }, [messages, reply])

    const replyHandleState = (message) => {
        setReply(message)
    }

    return (
        <div className="flex flex-col w-full lg:w-2/3">
            <HeaderGroupBox settings={settings} group={group}/>

            <div className="flex-1 h-screen px-2 pb-5 overflow-y-scroll lg:px-8" ref={scrollRef}>
                <div className="grid grid-cols-12">
                    <GroupMessage
                        settings={settings}
                        auth={auth}
                        messages={messages}
                        setIsEdit={setIsEdit}
                        setSelectedMessage={setSelectedMessage}
                    />
                </div>
            </div>
            <div className="flex px-6 py-1.5 border-t border-gray-700 z-50">
                <GroupInputMessage
                    reply={reply}
                    setReply={setReply}
                    setIsTyping={setIsTyping}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    selectedMessage={selectedMessage}
                    setSelectedMessage={setSelectedMessage}
                />
            </div>
        </div>
    );
}

Show.layout = (page) => <App children={page}/>;
