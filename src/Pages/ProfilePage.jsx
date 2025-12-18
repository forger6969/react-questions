import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
    const [studentData, setStudentData] = useState(null);
    const [stats, setStats] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [leaderboardPosition, setLeaderboardPosition] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Получаем ID студента из localStorage (после логина)
    const student = JSON.parse(localStorage.getItem('currentUser'))
    const studentId = student.id
    console.log(student, studentId);


    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Параллельные запросы для быстрой загрузки
            const [userRes, statsRes, achievementsRes, assignmentsRes, leaderboardRes, notificationsRes] = await Promise.all([
                fetch(`https://json-questions-3.onrender.com/users/${studentId}`),
                fetch(`https://json-questions-3.onrender.com/stats/student/${studentId}`),
                fetch(`https://json-questions-3.onrender.com/achievements/student/${studentId}`),
                fetch(`https://json-questions-3.onrender.com/assignments/student/${studentId}`),
                fetch(`https://json-questions-3.onrender.com/leaderboard/position/${studentId}`),
                fetch(`https://json-questions-3.onrender.com/notifications/student/${studentId}/unread`)
            ]);

            const userData = await userRes.json();
            const statsData = await statsRes.json();
            const achievementsData = await achievementsRes.json();
            const assignmentsData = await assignmentsRes.json();
            const leaderboardData = await leaderboardRes.json();
            const notificationsData = await notificationsRes.json();

            setStudentData(userData);
            setStats(statsData);
            setAchievements(achievementsData);
            setAssignments(assignmentsData);
            setLeaderboardPosition(leaderboardData);
            setNotifications(notificationsData);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setLoading(false);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            await fetch(`https://json-questions-3.onrender.com/notifications/${notificationId}/read`, {
                method: 'PATCH'
            });
            setNotifications(notifications.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 mt-20 p-4 md:p-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto">
                {/* Profile Header Card */}
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-32 h-32">
                                    <span className="text-5xl">
                                        {studentData?.firstName?.charAt(0)}{studentData?.lastName?.charAt(0)}
                                    </span>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-4xl font-bold">
                                    {studentData?.firstName} {studentData?.lastName}
                                </h1>
                                <p className="text-lg text-base-content/70">@{studentData?.login}</p>

                                {/* Stats Badges */}
                                <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                                    <div className="badge badge-lg badge-primary gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                        {studentData?.totalScore} баллов
                                    </div>
                                    <div className="badge badge-lg badge-secondary gap-2">
                                        📊 {studentData?.successRate}% успеха
                                    </div>
                                    <div className="badge badge-lg badge-accent gap-2">
                                        🏆 #{leaderboardPosition?.position} место
                                    </div>
                                    <div className="badge badge-lg badge-info gap-2">
                                        🎯 {achievements.length} достижений
                                    </div>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-circle btn-ghost">
                                    <div className="indicator">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {notifications.length > 0 && (
                                            <span className="badge badge-sm badge-error indicator-item">{notifications.length}</span>
                                        )}
                                    </div>
                                </label>
                                <div tabIndex={0} className="dropdown-content z-[1] card card-compact w-80 p-2 shadow bg-base-100 mt-3">
                                    <div className="card-body">
                                        <h3 className="font-bold text-lg">Уведомления</h3>
                                        {notifications.length === 0 ? (
                                            <p className="text-base-content/60">Нет новых уведомлений</p>
                                        ) : (
                                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                                {notifications.map(notif => (
                                                    <div key={notif.id} className="alert alert-sm">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold">{notif.title}</h4>
                                                            <p className="text-xs">{notif.message}</p>
                                                        </div>
                                                        <button
                                                            className="btn btn-xs btn-ghost"
                                                            onClick={() => markNotificationAsRead(notif.id)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="tabs tabs-boxed bg-base-100 shadow-lg mb-6 p-2">
                    <a
                        className={`tab tab-lg ${activeTab === 'overview' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Обзор
                    </a>
                    <a
                        className={`tab tab-lg ${activeTab === 'assignments' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('assignments')}
                    >
                        📝 Задания ({assignments.length})
                    </a>
                    <a
                        className={`tab tab-lg ${activeTab === 'achievements' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('achievements')}
                    >
                        🏆 Достижения
                    </a>
                    <a
                        className={`tab tab-lg ${activeTab === 'stats' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        📈 Статистика
                    </a>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Summary Stats */}
                        <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Тесты пройдено</h2>
                                <p className="text-5xl font-bold">{stats?.testsCompleted || 0}</p>
                                <div className="card-actions">
                                    <div className="badge badge-outline">Всего тестов</div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-secondary to-secondary-focus text-secondary-content shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Средний процент</h2>
                                <p className="text-5xl font-bold">{stats?.averagePercentage || 0}%</p>
                                <div className="card-actions">
                                    <div className="badge badge-outline">Успеваемость</div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-accent to-accent-focus text-accent-content shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Общий балл</h2>
                                <p className="text-5xl font-bold">{studentData?.totalScore || 0}</p>
                                <div className="card-actions">
                                    <div className="badge badge-outline">Рейтинг</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Results */}
                        <div className="card bg-base-100 shadow-xl md:col-span-2">
                            <div className="card-body">
                                <h2 className="card-title">Последние результаты</h2>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        <thead>
                                            <tr>
                                                <th>Тест</th>
                                                <th>Балл</th>
                                                <th>Процент</th>
                                                <th>Дата</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats?.results?.slice(0, 5).map((result, index) => (
                                                <tr key={index}>
                                                    <td>{result.test_name}</td>
                                                    <td>{result.score}/{result.max_score}</td>
                                                    <td>
                                                        <div className="badge badge-success">{result.percentage}%</div>
                                                    </td>
                                                    <td>{new Date(result.date).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Position */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">Ваша позиция</h2>
                                <div className="radial-progress text-primary" style={{ "--value": leaderboardPosition?.percentile || 0 }} role="progressbar">
                                    {leaderboardPosition?.percentile || 0}%
                                </div>
                                <p className="text-sm text-base-content/70">
                                    Место {leaderboardPosition?.position} из {leaderboardPosition?.totalStudents}
                                </p>
                                <div className="badge badge-primary badge-lg">
                                    ТОП {100 - (leaderboardPosition?.percentile || 0)}%
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="space-y-4">
                        {assignments.length === 0 ? (
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body items-center text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="text-2xl font-bold">Нет активных заданий</h3>
                                    <p className="text-base-content/70">Новые задания появятся здесь</p>
                                </div>
                            </div>
                        ) : (
                            assignments.map(assignment => (
                                <div key={assignment.id} className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h2 className="card-title">{assignment.test_name}</h2>
                                                <p className="text-base-content/70">{assignment.test_description}</p>
                                                <div className="flex gap-2 mt-3 flex-wrap">
                                                    <div className="badge badge-outline">
                                                        👤 {assignment.mentor_name}
                                                    </div>
                                                    <div className="badge badge-outline">
                                                        ⏱️ {assignment.test_time / 60000} мин
                                                    </div>
                                                    <div className="badge badge-outline">
                                                        📊 {assignment.test_max_score} баллов
                                                    </div>
                                                    <div className={`badge ${assignment.status === 'completed' ? 'badge-success' :
                                                        assignment.status === 'overdue' ? 'badge-error' :
                                                            'badge-warning'
                                                        }`}>
                                                        {assignment.status === 'completed' ? '✅ Выполнено' :
                                                            assignment.status === 'overdue' ? '⚠️ Просрочено' :
                                                                '⏳ В процессе'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-base-content/70">Дедлайн:</div>
                                                <div className="font-bold">
                                                    {new Date(assignment.deadline).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-base-content/60">
                                                    {new Date(assignment.deadline).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                        {assignment.status === 'pending' && (
                                            <div className="card-actions justify-end mt-4">
                                                <button className="btn btn-primary">
                                                    Начать тест
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {achievements.length === 0 ? (
                            <div className="col-span-full card bg-base-100 shadow-xl">
                                <div className="card-body items-center text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <h3 className="text-2xl font-bold">Пока нет достижений</h3>
                                    <p className="text-base-content/70">Проходите тесты, чтобы получить достижения!</p>
                                </div>
                            </div>
                        ) : (
                            achievements.map(achievement => (
                                <div key={achievement.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                                    <div className="card-body items-center text-center">
                                        <div className="text-6xl mb-2">{achievement.icon}</div>
                                        <h2 className="card-title">{achievement.name}</h2>
                                        <p className="text-base-content/70">{achievement.description}</p>
                                        <div className="badge badge-primary badge-lg mt-2">
                                            +{achievement.points} баллов
                                        </div>
                                        <div className="text-xs text-base-content/60 mt-2">
                                            Получено: {new Date(achievement.earned_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        {/* Progress Chart */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Прогресс по тестам</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(stats?.testStats || {}).map(([testName, testStat]) => (
                                        <div key={testName} className="border border-base-300 rounded-lg p-4">
                                            <h3 className="font-bold mb-2">{testName}</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Попыток:</span>
                                                    <span className="font-bold">{testStat.attempts}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Лучший результат:</span>
                                                    <span className="font-bold text-success">{testStat.bestScore}%</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Средний:</span>
                                                    <span className="font-bold">{testStat.averagePercentage}%</span>
                                                </div>
                                                <progress
                                                    className="progress progress-success"
                                                    value={testStat.averagePercentage}
                                                    max="100"
                                                ></progress>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Assignment Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="stat bg-base-100 shadow rounded-box">
                                <div className="stat-figure text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                </div>
                                <div className="stat-title">Всего заданий</div>
                                <div className="stat-value text-primary">
                                    {assignments.length}
                                </div>
                            </div>

                            <div className="stat bg-base-100 shadow rounded-box">
                                <div className="stat-figure text-success">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <div className="stat-title">Выполнено</div>
                                <div className="stat-value text-success">
                                    {assignments.filter(a => a.status === 'completed').length}
                                </div>
                            </div>

                            <div className="stat bg-base-100 shadow rounded-box">
                                <div className="stat-figure text-warning">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div className="stat-title">В процессе</div>
                                <div className="stat-value text-warning">
                                    {assignments.filter(a => a.status === 'pending').length}
                                </div>
                            </div>

                            <div className="stat bg-base-100 shadow rounded-box">
                                <div className="stat-figure text-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                                <div className="stat-title">Просрочено</div>
                                <div className="stat-value text-error">
                                    {assignments.filter(a => a.status === 'overdue').length}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Test Results */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Детальная история тестов</h2>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Название теста</th>
                                                <th>Балл</th>
                                                <th>Максимум</th>
                                                <th>Процент</th>
                                                <th>Дата</th>
                                                <th>Статус</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats?.results?.map((result, index) => (
                                                <tr key={index}>
                                                    <th>{index + 1}</th>
                                                    <td>{result.test_name}</td>
                                                    <td className="font-bold">{result.score}</td>
                                                    <td>{result.max_score}</td>
                                                    <td>
                                                        <div className={`badge ${result.percentage >= 90 ? 'badge-success' :
                                                            result.percentage >= 70 ? 'badge-warning' :
                                                                'badge-error'
                                                            }`}>
                                                            {result.percentage}%
                                                        </div>
                                                    </td>
                                                    <td>{new Date(result.date).toLocaleString()}</td>
                                                    <td>
                                                        {result.percentage >= 70 ?
                                                            <span className="text-success">✅ Сдано</span> :
                                                            <span className="text-error">❌ Не сдано</span>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Performance Indicators */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Показатели эффективности</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">Процент успеха</span>
                                            <span className="text-sm font-bold">{studentData?.successRate}%</span>
                                        </div>
                                        <progress
                                            className="progress progress-primary w-full"
                                            value={studentData?.successRate}
                                            max="100"
                                        ></progress>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">Завершенность заданий</span>
                                            <span className="text-sm font-bold">
                                                {assignments.length > 0
                                                    ? Math.round((assignments.filter(a => a.status === 'completed').length / assignments.length) * 100)
                                                    : 0}%
                                            </span>
                                        </div>
                                        <progress
                                            className="progress progress-success w-full"
                                            value={assignments.length > 0 ? (assignments.filter(a => a.status === 'completed').length / assignments.length) * 100 : 0}
                                            max="100"
                                        ></progress>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">Активность (тесты/неделя)</span>
                                            <span className="text-sm font-bold">
                                                {stats?.testsCompleted ? Math.round(stats.testsCompleted / 4) : 0}
                                            </span>
                                        </div>
                                        <progress
                                            className="progress progress-accent w-full"
                                            value={stats?.testsCompleted ? Math.min((stats.testsCompleted / 4) * 10, 100) : 0}
                                            max="100"
                                        ></progress>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;