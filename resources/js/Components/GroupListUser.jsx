import React, {useEffect, useState} from 'react';
import {Link, usePage} from "@inertiajs/react";
import ProfilePictureOnChat from "@/Components/ProfilePictureOnChat.jsx";
import clsx from "clsx";
import {UserCircleIcon} from "@heroicons/react/24/outline/index.js";

export default function GroupListUser() {
    const { props } = usePage();
    const {data: groups} = props.groups;
    // let {group: currentGroup, auth} = props;


    // const {data: users} = props.users;
    // const [selectedGroup, setSelectedGroup] = useState(null);
    console.log(groups)
    return (
        <>
            <div className="flex-1 mt-3 overflow-y-auto" scroll-region="true">
                {groups.map((group) => (
                    <Link preserveScroll key={group.id} href={route('group.show', group.id)} className='flex w-full items-center hover:bg-gray-800/60 px-2.5 py-3 rounded-md'>
                          {/*// className={clsx(currentGroup.id === group?.id ? 'bg-gray-800' : 'bg-transparent', 'flex w-full items-center hover:bg-gray-800/60 px-2.5 py-3 rounded-md')}>*/}
                        <div className="items-center mr-3 flex-2">
                            <ProfilePictureOnChat entity={[group.image_url, group.name] ?? group}/>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 pr-2">
                            <div className="flex items-center justify-between">
                                <div className="text-gray-100 text-sm font-medium truncate mb-1.5">
                                    {group.name}
                                </div>
                                <div className="text-white flex gap-0.5 items-center">
                                    <UserCircleIcon height={20} width={20} />
                                    { group.users.length }
                                </div>
                                {
                                    group.last_message_id
                                        &&
                                    <div className="text-[10px] text-gray-400 mb-1">
                                        {group.last_message_id}
                                    </div>
                                }
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-400">
                                    {/*<div>*/}
                                    {/*    {selectedChat?.sender_id === auth.user.id && !selectedChat?.message_deleted_at && (*/}
                                    {/*        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"*/}
                                    {/*             fill="currentColor" viewBox="0 0 24 24" id="double-check"*/}
                                    {/*             className={clsx(selectedChat?.seen_at ? 'text-cyan-500' : 'text-gray-400/80', "w-4 h-4 mr-1")}>*/}
                                    {/*            <path fillRule="evenodd"*/}
                                    {/*                  d="M16.5303 6.46967C16.8232 6.76256 16.8232 7.23744 16.5303 7.53033L6.53033 17.5303C6.38968 17.671 6.19891 17.75 6 17.75 5.80109 17.75 5.61032 17.671 5.46967 17.5303L1.46967 13.5303C1.17678 13.2374 1.17678 12.7626 1.46967 12.4697 1.76256 12.1768 2.23744 12.1768 2.53033 12.4697L6 15.9393 15.4697 6.46967C15.7626 6.17678 16.2374 6.17678 16.5303 6.46967zM22.5303 6.46966C22.8232 6.76254 22.8232 7.23742 22.5303 7.53032L12.5308 17.5303C12.2379 17.8232 11.7631 17.8232 11.4702 17.5304L9.96975 16.0304C9.67681 15.7376 9.67674 15.2627 9.96959 14.9697 10.2624 14.6768 10.7373 14.6767 11.0303 14.9696L12.0004 15.9394 21.4697 6.46968C21.7625 6.17678 22.2374 6.17677 22.5303 6.46966z"*/}
                                    {/*                  clipRule="evenodd"></path>*/}
                                    {/*        </svg>*/}
                                    {/*    )}*/}
                                    {/*</div>*/}
                                    {/*{selectedChat?.message_deleted_at*/}
                                    {/*    ? <span className="mr-2 italic text-gray-500">{selectedChat?.message}</span>*/}
                                    {/*    : <div className="overflow-hidden break-all" style={{*/}
                                    {/*        display: "-webkit-box",*/}
                                    {/*        WebkitLineClamp: 1,*/}
                                    {/*        WebkitBoxOrient: "vertical"*/}
                                    {/*    }}>{selectedChat?.message}</div>*/}
                                    {/*}*/}
                                </div>
                                {/*{user.messages_count > 0 && (*/}
                                {/*    <div*/}
                                {/*        className="inline-flex items-center px-1.5 rounded-full text-[10px] bg-purple-500 text-white">*/}
                                {/*        {user.messages_count}*/}
                                {/*    </div>*/}
                                {/*)}*/}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}

