import React from 'react';
import { Head } from "@inertiajs/react";
import App from "@/Layouts/App.jsx";
import MessagesNotSelected from "@/Components/MessagesNotSelected.jsx";
import {UserIcon} from "@heroicons/react/20/solid/index.js";

export default function Index() {
    return (
        <MessagesNotSelected title="Мои группы"/>
    )
}

Index.layout = (page) => <App children={page}/>;
