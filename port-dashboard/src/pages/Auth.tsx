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
        <div className="min-h-screen bg-port-gray flex items-center justify-center font-sans p-4">
            <div className="flex w-full max-w-4xl rounded-2xl shadow-lg overflow-hidden">
                {/* Left Panel - Port-themed Branding */}
                <div className="hidden md:flex flex-col justify-center items-center p-8 w-1/2 bg-teal-600 text-white">
                    <h1 className="text-5xl font-extrabold mb-4">SAPO</h1>
                    <p className="text-xl text-center leading-relaxed">
                        Sua plataforma completa para gestão portuária.
                        Conectando o porto ao mundo com eficiência e segurança.
                    </p>
                    {/* Placeholder for a port-themed icon/image */}
                    <svg className="w-32 h-32 mt-10 text-teal-200" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 12c0-1.103-.897-2-2-2h-2V7c0-1.103-.897-2-2-2H8c-1.103 0-2 .897-2 2v3H4c-1.103 0-2 .897-2 2v8h20v-8zm-18 0h2v2H2v-2zm4 0h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM8 7h8v3H8V7z"></path>
                    </svg>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full md:w-1/2 bg-white p-8 border border-gray-100">
                    <div className="flex justify-center mb-6 md:hidden"><span className="text-3xl font-bold text-blue-600">SAPO</span></div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Bem-vindo ao Sapo</h2>
                    <p className="text-center text-gray-500 mb-8">Faça login para acessar o painel</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="seu@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="••••••••" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-600" />
                                <span className="text-gray-600">Lembrar-me</span>
                            </label>
                            <a href="#" className="text-blue-600 hover:underline font-medium">Esqueceu a senha?</a>
                        </div>
                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                        )}
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                            Admin: <strong>admin@sapo.com</strong> / <strong>@123123</strong> &nbsp;|&nbsp; Cliente: <strong>cliente@sapo.com</strong> / <strong>@123123</strong>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2">
                            Entrar
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-8">
                        Não tem uma conta? <button onClick={() => onNavigate('register')} className="text-blue-600 hover:underline font-medium">Cadastre-se</button>
                    </p>
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
        <div className="min-h-screen bg-port-gray flex items-center justify-center font-sans p-4">
            <div className="flex w-full max-w-4xl rounded-2xl shadow-lg overflow-hidden">
                {/* Left Panel - Port-themed Branding */}
                <div className="hidden md:flex flex-col justify-center items-center p-8 w-1/2 bg-teal-600 text-white">
                    <h1 className="text-5xl font-extrabold mb-4">SAPO</h1>
                    <p className="text-xl text-center leading-relaxed">
                        Sua plataforma completa para gestão portuária.
                        Conectando o porto ao mundo com eficiência e segurança.
                    </p>
                    {/* Placeholder for a port-themed icon/image */}
                    <svg className="w-32 h-32 mt-10 text-teal-200" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 12c0-1.103-.897-2-2-2h-2V7c0-1.103-.897-2-2-2H8c-1.103 0-2 .897-2 2v3H4c-1.103 0-2 .897-2 2v8h20v-8zm-18 0h2v2H2v-2zm4 0h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM8 7h8v3H8V7z"></path>
                    </svg>
                </div>

                {/* Right Panel - Register Form */}
                <div className="w-full md:w-1/2 bg-white p-8 border border-gray-100">
                    <div className="flex justify-center mb-6 md:hidden"><span className="text-3xl font-bold text-blue-600">SAPO</span></div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Criar Conta</h2>
                    <p className="text-center text-gray-500 mb-8">Junte-se ao Sapo hoje mesmo</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="João da Silva" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="seu@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Área que trabalha no porto</label>
                            <select required defaultValue="" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 text-gray-700 bg-white">
                                <option value="" disabled>Selecione sua área</option>
                                <option value="operacoes">Operações</option>
                                <option value="logistica">Logística</option>
                                <option value="manutencao">Manutenção</option>
                                <option value="administrativo">Administrativo</option>
                                <option value="seguranca">Segurança</option>
                                <option value="outros">Outros</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <input type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="••••••••" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                            <input type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="••••••••" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2">
                            Cadastrar
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-8">
                        Já tem uma conta? <button onClick={() => onNavigate('login')} className="text-blue-600 hover:underline font-medium">Fazer login</button>
                    </p>
                </div>
            </div>
        </div>
    );
}
