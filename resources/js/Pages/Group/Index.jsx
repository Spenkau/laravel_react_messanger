import React from 'react';
import App from "@/Layouts/App.jsx";
import MessagesNotSelected from "@/Components/MessagesNotSelected.jsx";

export default function Index() {
    return (
        <MessagesNotSelected title="Мои группы"/>
    )
}

Index.layout = (page) => <App children={page}/>;
