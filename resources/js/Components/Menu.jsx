import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline/index.js";
import clsx from "clsx";
import { Link } from "@inertiajs/react";
import axios from "axios";
import { debounce } from 'lodash';
import SettingsModal from "@/Components/SettingsModal.jsx";

export default function Menu({ settings, setSettings }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className='d-flex py-2 gap-2.5 justify-between'>
           <Link href={route('group.index')} style={{color: settings.sidebar_text_color}} className='bg-transparent text-gray-400 border-0 pl-11 focus:ring-0 sm:text-sm'>Группы</Link>
           <Link href={route('chat.index')} style={{color: settings.sidebar_text_color}} className=' bg-transparent text-gray-400 border-0 pl-11 focus:ring-0 sm:text-sm hover:border-b-amber-50'>Личные сообщения</Link>

            <button className="text-white" style={{color: settings.sidebar_text_color}} onClick={() => setIsSettingsOpen(true)}>Открыть кастомизацию</button>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                setSettings={setSettings}
            />
        </div>
    )
}
