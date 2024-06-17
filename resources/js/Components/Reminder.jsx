import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ru } from 'date-fns/locale';

registerLocale('ru', ru);

const Reminder = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [reminders, setReminders] = useState([]);
    const [reminderText, setReminderText] = useState('');

    useEffect(() => {
        const checkReminders = setInterval(() => {
            const now = new Date();
            setReminders((prevReminders) => {
                const dueReminders = prevReminders.filter(reminder => new Date(reminder.date) <= now);
                const remainingReminders = prevReminders.filter(reminder => new Date(reminder.date) > now);

                dueReminders.forEach(reminder => {
                    toast(reminder.text, {
                        autoClose: false,
                        onClose: () => setReminders(reminders => reminders.filter(r => r.date !== reminder.date))
                    });
                    new Audio('/sounds/notification.mp3').play()
                        .then(r => console.log(r))
                        .catch(e => console.log(e));
                });

                return remainingReminders;
            });
        }, 1000);

        return () => clearInterval(checkReminders);
    }, []);

    const handleDateChange = (date) => {
        setStartDate(date);
    };

    const addReminder = () => {
        if (!reminderText) {
            toast.error("Пожалуйста, введите текст напоминания!");
            return;
        }

        setReminders([...reminders, { date: startDate, text: reminderText }]);
        setReminderText('');
        toast.success("Напоминание установлено!");
    };

    return (
        <div>
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                locale="ru"
                className="form-control"
            />
            <input
                type="text"
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                placeholder="Введите текст напоминания"
                className="form-control mt-3"
            />
            <button onClick={addReminder} className="p-2 text-sm text-gray-500 ml-3 bg-violet-50 rounded-lg hover:bg-gray-400 hover:text-gray-700">
                Установить напоминание
            </button>
            <ToastContainer />
        </div>
    );
};

export default Reminder;
