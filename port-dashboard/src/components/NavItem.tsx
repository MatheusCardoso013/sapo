import React from 'react';

export function NavItem({ icon, label, active, open, onClick }: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    open: boolean;
    onClick: () => void;
}) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap ${active ? 'bg-blue-800 text-white font-medium' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}>
            <span className="min-w-5">{icon}</span>
            {open && <span>{label}</span>}
        </button>
    );
}
