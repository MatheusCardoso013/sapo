import React from 'react';

export type Role = 'superadmin' | 'cliente';

interface AuthResult {
    view: 'app';
    role: Role;
    userName: string;
}

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
        const match = CREDENTIALS.find(c => c.email === email.trim().toLowerCase() && c.password === password);
        if (!match) {
            setError('E-mail ou senha incorretos.');
            return;
        }
        onLogin({ view: 'app', role: match.role, userName: match.name });
    };

    return (
        <div className="min-h-screen w-screen h-screen bg-port-gray dark:bg-black flex items-center justify-center font-sans relative">
            <div className="flex w-full h-full overflow-hidden">
                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-slate-800 shadow-md z-50 text-gray-800 dark:text-yellow-400 hover:scale-110 transition-transform"
                    title="Alternar Tema"
                >
                    {darkMode ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
                {/* Left Panel - Port-themed Branding */}
                <div className="hidden md:flex flex-col justify-center items-center p-12 w-full md:w-[60%] bg-sky-700 dark:bg-sky-500 text-white transition-colors duration-500">
                    <h1 className="text-5xl font-extrabold mb-4">Porto de Santos</h1>
                    <p className="text-xl text-center leading-relaxed">
                        Sua plataforma completa para gestão no <span className="font-bold text-sky-300 italic">Porto de Santos</span>.
                        Conectando o porto ao mundo com eficiência e segurança.
                    </p>
                    {/* Ship Image Branding */}
                    <img src="/ship.png" alt="Navio Porto de Santos" className="w-80 h-auto mt-12 opacity-100 drop-shadow-xl" />
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full md:w-[40%] bg-white dark:bg-black p-8 flex items-center justify-center border-l border-gray-100 dark:border-zinc-900 transition-colors duration-500">
                    <div className="w-full max-w-md">
                        <div className="flex justify-center mb-6 md:hidden"><span className="text-3xl font-bold text-sky-600">Porto de Santos</span></div>
                        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">Bem-vindo</h2>
                        <p className="text-center text-gray-500 dark:text-zinc-400 mb-10">Faça login para acessar o painel do Porto</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-zinc-900 dark:text-white"
                                    placeholder="seu@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-zinc-900 dark:text-white"
                                    placeholder="••••••••" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded text-sky-500 focus:ring-sky-500 dark:bg-zinc-900 dark:border-zinc-800" />
                                    <span className="text-gray-600 dark:text-gray-400">Lembrar-me</span>
                                </label>
                                <a href="#" className="text-sky-600 dark:text-sky-400 hover:underline font-medium">Esqueceu a senha?</a>
                            </div>
                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                            )}
                            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 rounded-lg transition-colors mt-2 shadow-lg shadow-sky-200 dark:shadow-none">
                                Entrar
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
                            Não tem uma conta? <button onClick={() => onNavigate('register')} className="text-sky-600 dark:text-sky-400 hover:underline font-bold">Cadastre-se</button>
                        </p>
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
    const [name, setName] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin({ view: 'app', role: 'cliente', userName: name });
    };

    return (
        <div className="min-h-screen w-screen h-screen bg-port-gray dark:bg-black flex items-center justify-center font-sans">
            <div className="flex w-full h-full overflow-hidden">
                {/* Left Panel - Port-themed Branding */}
                <div className="hidden md:flex flex-col justify-center items-center p-12 w-full md:w-[60%] bg-sky-700 dark:bg-sky-500 text-white transition-colors duration-500">
                    <h1 className="text-5xl font-extrabold mb-4">Porto de Santos</h1>
                    <p className="text-xl text-center leading-relaxed">
                        Sua plataforma completa para gestão no <span className="font-bold text-sky-300 italic">Porto de Santos</span>.
                        Conectando o porto ao mundo com eficiência e segurança.
                    </p>
                    {/* Ship Image Branding */}
                    <img src="/ship.png" alt="Navio Porto de Santos" className="w-80 h-auto mt-12 opacity-100 drop-shadow-xl" />
                </div>

                {/* Right Panel - Register Form */}
                <div className="w-full md:w-[40%] bg-white dark:bg-black p-8 flex items-center justify-center border-l border-gray-100 dark:border-zinc-900 transition-colors duration-500">
                    <div className="w-full max-w-md">
                        <div className="flex justify-center mb-6 md:hidden"><span className="text-3xl font-bold text-sky-600">Porto de Santos</span></div>
                        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">Criar Conta</h2>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-10">Junte-se ao Porto de Santos hoje mesmo</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-zinc-900 dark:text-white" placeholder="João da Silva" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email</label>
                                <input type="email" required className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-zinc-900 dark:text-white" placeholder="seu@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Área que trabalha no porto</label>
                                <input type="text" required className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-zinc-900 dark:text-white" placeholder="Ex: Logística, Operações..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Senha</label>
                                <input type="password" required className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-zinc-900 dark:text-white" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Confirmar Senha</label>
                                <input type="password" required className="w-full px-4 py-2.5 border border-gray-300 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-zinc-900 dark:text-white" placeholder="••••••••" />
                            </div>
                            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 rounded-lg transition-colors mt-2">
                                Cadastrar
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-600 dark:text-zinc-400 mt-8">
                            Já tem uma conta? <button onClick={() => onNavigate('login')} className="text-sky-600 dark:text-sky-400 hover:underline font-bold">Fazer login</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
