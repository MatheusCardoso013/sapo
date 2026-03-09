import React from 'react';

export type Role = 'superadmin' | 'cliente';

interface AuthResult {
    view: 'app';
    role: Role;
    userName: string;
    userEmail: string;
}

interface User {
    email: string;
    password: string;
    name: string;
    area: string;
    role: Role;
}

const getUsers = (): User[] => {
    const users = localStorage.getItem('sapo_users');
    return users ? JSON.parse(users) : [];
};

const saveUser = (user: User) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('sapo_users', JSON.stringify(users));
};

export function LoginScreen({ onLogin, onNavigate }: {
    onLogin: (result: AuthResult) => void;
    onNavigate: (view: 'register') => void;
}) {
    const [darkMode, setDarkMode] = React.useState(() => document.documentElement.classList.contains('dark'));

    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const CREDENTIALS = [
        { email: 'admin@sapo.com', password: '@123123', role: 'superadmin' as Role, name: 'Admin Silva' },
        { email: 'cliente@sapo.com', password: '@123123', role: 'cliente' as Role, name: 'Cliente' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const defaultMatch = CREDENTIALS.find(c => c.email === email.trim().toLowerCase() && c.password === password);
        if (defaultMatch) {
            onLogin({ view: 'app', role: defaultMatch.role, userName: defaultMatch.name, userEmail: defaultMatch.email });
            return;
        }

        const users = getUsers();
        const userMatch = users.find(u => u.email === email.trim().toLowerCase() && u.password === password);
        
        if (!userMatch) {
            setError('E-mail ou senha incorretos.');
            return;
        }
        
        onLogin({ view: 'app', role: userMatch.role, userName: userMatch.name, userEmail: userMatch.email });
    };

    return (
        <div className="min-h-screen w-screen h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 flex items-center justify-center font-sans relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="flex w-full h-full overflow-hidden relative z-10">
                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="absolute top-6 right-6 p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg z-50 text-gray-700 dark:text-yellow-400 hover:scale-105 transition-all hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50"
                    title="Alternar Tema"
                >
                    {darkMode ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>

                <div className="hidden lg:flex flex-col justify-center items-center p-12 w-full lg:w-[55%] bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800 dark:from-sky-500 dark:via-sky-600 dark:to-blue-700 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="relative z-10 max-w-xl">
                        <div className="mb-6 inline-block">
                            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                                Sistema de Gestão Portuária
                            </div>
                        </div>
                        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
                            Porto de<br/>
                            <span className="text-cyan-200">Santos</span>
                        </h1>
                        <p className="text-xl text-sky-100 leading-relaxed mb-8">
                            Plataforma integrada para gestão de eficiência operacional do Porto de Santos. 
                            <span className="font-semibold text-white"> Conectando o Brasil ao mundo</span> com eficiência, segurança e tecnologia.
                        </p>
                        
                    </div>
                    
                    {/* <img src="/ship.png" alt="Navio Porto de Santos" className="absolute bottom-8 right-8 w-72 h-auto opacity-20 drop-shadow-2xl" /> */}
                </div>

                <div className="w-full lg:w-[45%] p-8 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="flex justify-center mb-8 lg:hidden">
                            <span className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Porto de Santos</span>
                        </div>

                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Bem-vindo de volta!</h2>
                                <p className="text-gray-500 dark:text-gray-400">Entre com suas credenciais para acessar o sistema</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">E-mail</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="email" 
                                            required 
                                            value={email} 
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-white transition-colors"
                                            placeholder="seu@email.com" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Senha</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="password" 
                                            required 
                                            value={password} 
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-white transition-colors"
                                            placeholder="••••••••" 
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 dark:bg-slate-700 dark:border-slate-600" />
                                        <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">Lembrar-me</span>
                                    </label>
                                    <a href="#" className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold transition-colors">Esqueceu a senha?</a>
                                </div>

                                {error && (
                                    <div className="flex items-start gap-3 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl px-4 py-3">
                                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5"
                                >
                                    Entrar no Sistema
                                </button>
                            </form>

                            {/* <div className="mt-6 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-200 dark:border-sky-800/50">
                                <p className="text-xs font-semibold text-sky-900 dark:text-sky-300 mb-2">🔐 Credenciais de Teste:</p>
                                <div className="text-xs text-sky-700 dark:text-sky-400 space-y-1">
                                    <p><span className="font-mono bg-white/50 dark:bg-slate-800/50 px-2 py-0.5 rounded">admin@sapo.com</span> - Admin</p>
                                    <p><span className="font-mono bg-white/50 dark:bg-slate-800/50 px-2 py-0.5 rounded">cliente@sapo.com</span> - Cliente</p>
                                    <p className="text-[10px] text-sky-600 dark:text-sky-500 mt-1">Senha para ambos: <span className="font-mono">@123123</span></p>
                                </div>
                            </div> */}

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Ainda não tem uma conta? <button onClick={() => onNavigate('register')} className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-bold transition-colors">Cadastre-se gratuitamente</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function RegisterScreen({ onLogin, onNavigate }: {
    onLogin: (result: AuthResult) => void;
    onNavigate: (view: 'login') => void;
}) {
    const [darkMode, setDarkMode] = React.useState(() => document.documentElement.classList.contains('dark'));

    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [area, setArea] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        const emailLower = email.trim().toLowerCase();

        const defaultEmails = ['admin@sapo.com', 'cliente@sapo.com'];
        if (defaultEmails.includes(emailLower)) {
            setError('Este e-mail já está em uso.');
            return;
        }

        const users = getUsers();
        if (users.some(u => u.email === emailLower)) {
            setError('Este e-mail já está cadastrado.');
            return;
        }

        const newUser: User = {
            email: emailLower,
            password,
            name: name.trim(),
            area: area.trim(),
            role: 'cliente'
        };

        saveUser(newUser);
        setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
        
        setTimeout(() => {
            onNavigate('login');
        }, 1500);
    };

    return (
        <div className="min-h-screen w-screen h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 flex items-center justify-center font-sans relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="flex w-full h-full overflow-hidden relative z-10">
                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="absolute top-6 right-6 p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg z-50 text-gray-700 dark:text-yellow-400 hover:scale-105 transition-all hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50"
                    title="Alternar Tema"
                >
                    {darkMode ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>

                <div className="hidden lg:flex flex-col justify-center items-center p-12 w-full lg:w-[55%] bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800 dark:from-sky-500 dark:via-sky-600 dark:to-blue-700 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
                    </div>
                    
                    <div className="relative z-10 max-w-xl">
                        <div className="mb-6 inline-block">
                            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                                Sistema de Gestão Portuária
                            </div>
                        </div>
                        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
                            Porto de<br/>
                            <span className="text-cyan-200">Santos</span>
                        </h1>
                        <p className="text-xl text-sky-100 leading-relaxed mb-8">
                            Junte-se à nossa plataforma e faça parte da transformação digital do maior porto da América Latina.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                <span>Gratuito</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                <span>Rápido</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                                <span>Seguro</span>
                            </div>
                        </div>
                    </div>
                    
                    <img src="/ship.png" alt="Navio Porto de Santos" className="absolute bottom-8 right-8 w-72 h-auto opacity-20 drop-shadow-2xl" />
                </div>

                <div className="w-full lg:w-[45%] p-8 flex items-center justify-center overflow-y-auto">
                    <div className="w-full max-w-md py-8">
                        <div className="flex justify-center mb-8 lg:hidden">
                            <span className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Porto de Santos</span>
                        </div>

                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8">
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Criar sua conta</h2>
                                <p className="text-gray-500 dark:text-gray-400">Preencha os dados para começar</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nome Completo</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            required 
                                            value={name} 
                                            onChange={e => setName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-white transition-colors"
                                            placeholder="João da Silva" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">E-mail</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="email" 
                                            required 
                                            value={email} 
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-white transition-colors"
                                            placeholder="seu@email.com" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Área que trabalha no porto</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            required 
                                            value={area} 
                                            onChange={e => setArea(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-white transition-colors"
                                            placeholder="Ex: Logística, Operações..." 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Senha</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="password" 
                                            required 
                                            value={password} 
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-white transition-colors"
                                            placeholder="Mínimo 6 caracteres" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirmar Senha</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="password" 
                                            required 
                                            value={confirmPassword} 
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-500 bg-white dark:bg-slate-800 dark:text-white transition-colors"
                                            placeholder="Digite a senha novamente" 
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-start gap-3 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl px-4 py-3">
                                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="flex items-start gap-3 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl px-4 py-3">
                                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>{success}</span>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5"
                                >
                                    Criar Conta
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Já tem uma conta? <button onClick={() => onNavigate('login')} className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-bold transition-colors">Fazer login</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
