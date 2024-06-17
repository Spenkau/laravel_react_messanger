import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserData = ({ userId, onClose }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/user/show/${userId}`);
                setUser(response.data.data);
            } catch (error) {
                setError('Ошибка получения данных пользователя');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) {
        return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">Загрузка...</div>;
    }

    if (error) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
                    <p>{error}</p>
                    <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                        Закрыть
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">Информация о пользователе</h2>

                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full">
                        <span className="font-medium leading-none text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </span>
                    <div>
                        <p className="text-lg font-semibold">{user.name}</p>
                    </div>
                    <p><small>{user.last_seen_at.toLowerCase()}</small></p>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <p className="mt-4">Почта: {user.email}</p>
                    <p>Имя: {user.username}</p>

                    <div>
                        {user.is_friend &&
                            <p><small className={"py-2 px-3 border border-green-400 rounded"}>У вас в друзьях</small></p>}
                    </div>
                </div>

                <button onClick={onClose} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default UserData;
