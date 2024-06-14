import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function AboutUs({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Информация о приложении</h2>}
        >
            <Head title="О приложении"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">О нашем приложении</h3>
                            <p className="mt-4 text-gray-600">
                                Наше приложение предназначено для облегчения общения и взаимодействия сотрудников в
                                реальном времени.
                                Платформа позволяет объединяться в группы, отправлять личные сообщения и делиться важной
                                информацией.
                            </p>
                            <p className="mt-4 text-gray-600">
                                Приложение разработано с использованием современных технологий, таких как Laravel,
                                InertiaJS и ReactJS.
                                Это обеспечивает высокую производительность и удобство использования.
                            </p>
                            <p className="mt-4 text-gray-600">
                                Основные функции приложения включают в себя:
                            </p>
                            <ul className="list-disc list-inside mt-4 text-gray-600">
                                <li>Создание и участие в групповых чатах для командной работы.</li>
                                <li>Отправка и получение личных сообщений для приватного общения.</li>
                                <li>Возможность добавления сотрудников в друзья для быстрого доступа к контактам.</li>
                                <li>Уведомления в реальном времени о новых сообщениях и обновлениях.</li>
                                <li>Поддержка обмена файлами и вложениями в сообщениях.</li>
                                <li>Интуитивно понятный интерфейс и адаптивный дизайн для удобного использования на
                                    любых устройствах.
                                </li>
                            </ul>
                            <p className="mt-4 text-gray-600">
                                Приложение разработано с акцентом на безопасность и защиту данных пользователей.
                                Используются современные методы шифрования и аутентификации.
                            </p>
                            <p className="mt-4 text-gray-600">
                                Мы постоянно работаем над улучшением нашего приложения, добавляя новые функции и
                                оптимизируя существующие, чтобы сделать ваше общение еще более удобным и эффективным.
                            </p>
                            <p className="mt-4 text-gray-600">
                                Версия Laravel: 10.10
                            </p>
                            <p className="mt-4 text-gray-600">
                                Версия PHP: 8.2
                            </p>
                            <p className="mt-4 text-gray-600">
                                Версия React: 18.2.0
                            </p>
                            <p className="mt-4 text-gray-600">
                                Благодарим вас за использование нашего приложения и всегда рады вашим отзывам и
                                предложениям.
                            </p>
                            <p className="mt-4 text-gray-600">
                                Для обратной связи, пожалуйста, свяжитесь с нами по электронной почте:
                                <ul className="list-inside mt-4 text-gray-600 list-none gap-3">
                                    <li>
                                        <p>
                                            Максим:&nbsp;
                                            <a href="mailto:badboy1337@gmail.com">badboy1337@gmail.com</a>
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            Александр:&nbsp;
                                            <a href="mailto:kholyaskij123@gmail.com">kholyaskij123@gmail.com</a>
                                        </p>
                                    </li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
