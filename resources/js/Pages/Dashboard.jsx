import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import WallClock from '@/Components/WallClock';
import Reminder from '@/Components/Reminder';
import Yandex from "@/Components/Yandex.jsx";

export default function Dashboard({ auth }) {
    const { users } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-900 leading-tight">Главная</h2>}
        >
            <Head title="Главная" />

            <div className="py-12">
                <div className="max-w-screen-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-md rounded-lg p-8">
                        <div className="text-gray-900 mb-6 text-xl font-bold">
                            Добрый день, {auth.user.name}!
                        </div>
                        {users.data && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Недавние чаты</h3>
                                <ul className="space-y-3">
                                    {users.data.map(user => (
                                        <li key={user.uuid} className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm">
                                            <Link
                                                href={'/chat/' + user.uuid}
                                                className="text-lg text-blue-500 hover:text-blue-700 transition flex-1"
                                            >
                                                {user.name}
                                            </Link>
                                            <span className="text-sm text-gray-500">
                                                {user.last_seen_at}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="flex flex-col md:flex-row items-center justify-around space-y-6 md:space-y-0 bg-gray-50 p-8 rounded-lg shadow-md">
                            <WallClock />
                            <Reminder authUser={auth}/>
                            <Yandex />
                        </div>
                        <div className="mt-8 flex flex-col md:flex-row justify-around space-y-4 md:space-y-0">
                            <Link
                                href={'/profile'}
                                className="text-lg text-blue-500 hover:text-blue-700 transition"
                            >
                                Настройки и профиль
                            </Link>
                            <Link
                                href={'/about-us'}
                                className="text-lg text-blue-500 hover:text-blue-700 transition"
                            >
                                Информация о системе
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
