import React from 'react';
import { Head } from "@inertiajs/react";

export default function MessagesNotSelected({ title }) {
    return (
        <>
            <Head title={title} />

            <div className="flex-col hidden lg:flex lg:w-2/3">
                <div className="flex items-center justify-center h-screen">
                   <div className="font-semibold tracking-tight text-gray-300">
                       Выберите чат в меню слева
                   </div>
                </div>
            </div>
        </>
    )
}

