import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline/index.js";
import clsx from "clsx";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { debounce } from 'lodash';
import SettingsModal from "@/Components/SettingsModal.jsx";
import {AdjustmentsHorizontalIcon} from "@heroicons/react/20/solid/index.js";

export default function Menu({ settings, setSettings }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className='d-flex py-2 gap-2.5 justify-between'>
           <Link href={route('group.index')} style={{color: settings.sidebar_text_color}} className='bg-transparent text-gray-400 border-0 pl-11 focus:ring-0 sm:text-sm'>Группы</Link>
           <Link href={route('chat.index')} style={{color: settings.sidebar_text_color}} className=' bg-transparent text-gray-400 border-0 pl-11 focus:ring-0 sm:text-sm hover:border-b-amber-50'>Личные сообщения</Link>

            <button className="text-white float-right"
                    style={{color: settings.sidebar_text_color}}
                    onClick={() => setIsSettingsOpen(true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={25} height={25} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"/></svg>
            </button>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                setSettings={setSettings}
            />
        </div>
    )
}
