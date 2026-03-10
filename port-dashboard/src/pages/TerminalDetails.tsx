import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Ship,
  TrendingUp,
  Package,
  AlertCircle,
  Activity,
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface Terminal {
  id: number;
  name: string;
  type: string;
  docks: number;
  status: "Operando" | "Manutenção Parcial" | "Fechado";
  capacity: string;
  efficiency: number;
  throughput: number;
  createdAt?: string;
}

const defaultTerminals: Terminal[] = [
  {
    id: 1,
    name: "Santos Brasil",
    type: "Contêineres",
    docks: 3,
    status: "Operando",
    capacity: "95%",
    efficiency: 92,
    throughput: 150,
  },
  {
    id: 2,
    name: "DP World Santos",
    type: "Contêineres",
    docks: 4,
    status: "Manutenção Parcial",
    capacity: "78%",
    efficiency: 78,
    throughput: 110,
  },
  {
    id: 3,
    name: "Brasil Terminal Portuário",
    type: "Contêineres",
    docks: 3,
    status: "Operando",
    capacity: "88%",
    efficiency: 88,
    throughput: 95,
  },
  {
    id: 4,
    name: "Ecoporto Santos",
    type: "Carga Geral",
    docks: 2,
    status: "Fechado",
    capacity: "0%",
    efficiency: 0,
    throughput: 0,
  },
];

export function TerminalDetailsContent({
  terminalId,
  onBack,
}: {
  terminalId: number;
  onBack: () => void;
}) {
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerminal();
  }, [terminalId]);

  const loadTerminal = async () => {
    setLoading(true);
    try {
      // Primeiro, verifica se é um terminal default
      const defaultTerminal = defaultTerminals.find((t) => t.id === terminalId);
      if (defaultTerminal) {
        setTerminal(defaultTerminal);
        setLoading(false);
        return;
      }

      // Se não for default, busca no banco
      const { data, error } = await supabase
        .from("terminals")
        .select("*")
        .eq("id", terminalId)
        .single();

      if (error) throw error;

      if (data) {
        setTerminal({
          id: data.id,
          name: data.name,
          type: data.type,
          docks: data.docks,
          status: data.status,
          capacity: `${data.capacity}%`,
          efficiency: data.efficiency,
          throughput: data.throughput,
          createdAt: data.created_at,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar terminal:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Carregando detalhes do terminal...</div>
      </div>
    );
  }

  if (!terminal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-gray-600 mb-4">Terminal não encontrado</div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Voltar para Terminais
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{terminal.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Detalhes operacionais completos
          </p>
        </div>
        <span
          className={`text-sm px-4 py-2 rounded-full font-medium ${terminal.status === "Operando" ? "bg-green-100 text-green-700" : terminal.status === "Fechado" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
        >
          {terminal.status}
        </span>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm font-medium">Ocupação</span>
            <Package className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {terminal.capacity}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${parseInt(terminal.capacity) > 90 ? "bg-red-500" : parseInt(terminal.capacity) > 75 ? "bg-yellow-500" : "bg-green-500"}`}
              style={{ width: terminal.capacity }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm font-medium">
              Eficiência
            </span>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <div
            className={`text-3xl font-bold mb-2 ${terminal.efficiency >= 85 ? "text-green-600" : terminal.efficiency >= 70 ? "text-yellow-600" : "text-red-600"}`}
          >
            {terminal.efficiency}%
          </div>
          <p className="text-xs text-gray-500">Taxa de aproveitamento</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm font-medium">
              Throughput
            </span>
            <Activity className="text-purple-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {terminal.throughput}k
          </div>
          <p className="text-xs text-gray-500">TEUs por mês</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm font-medium">Berços</span>
            <Ship className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {terminal.docks}
          </div>
          <p className="text-xs text-gray-500">Ativos no momento</p>
        </div>
      </div>

      {/* Informações gerais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Informações Gerais
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Nome do Terminal
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.name}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Tipo de Carga</span>
              <span className="text-gray-800 font-semibold">
                {terminal.type}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Status Operacional
              </span>
              <span
                className={`font-semibold ${terminal.status === "Operando" ? "text-green-600" : terminal.status === "Fechado" ? "text-red-600" : "text-yellow-600"}`}
              >
                {terminal.status}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600 font-medium">
                Número de Berços
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.docks} berços
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Métricas de Desempenho
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Ocupação Atual</span>
              <span className="text-gray-800 font-semibold">
                {terminal.capacity}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Eficiência Operacional
              </span>
              <span
                className={`font-semibold ${terminal.efficiency >= 85 ? "text-green-600" : terminal.efficiency >= 70 ? "text-yellow-600" : "text-red-600"}`}
              >
                {terminal.efficiency}%
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Throughput Mensal
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.throughput}k TEUs
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600 font-medium">
                Capacidade Estimada
              </span>
              <span className="text-gray-800 font-semibold">
                {Math.round(terminal.throughput / (terminal.efficiency / 100))}k
                TEUs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Análise de performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Análise de Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {terminal.efficiency >= 85 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp
                  className="text-green-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-green-800 mb-1">
                    Alta Eficiência
                  </h3>
                  <p className="text-sm text-green-700">
                    Terminal operando acima de 85% de eficiência. Desempenho
                    excelente.
                  </p>
                </div>
              </div>
            </div>
          )}
          {terminal.efficiency < 85 && terminal.efficiency >= 70 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-yellow-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">
                    Eficiência Moderada
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Terminal operando entre 70-85% de eficiência. Há espaço para
                    melhorias.
                  </p>
                </div>
              </div>
            </div>
          )}
          {terminal.efficiency < 70 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-red-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">
                    Baixa Eficiência
                  </h3>
                  <p className="text-sm text-red-700">
                    Terminal abaixo de 70% de eficiência. Necessita atenção
                    imediata.
                  </p>
                </div>
              </div>
            </div>
          )}

          {parseInt(terminal.capacity) > 90 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Package
                  className="text-orange-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-orange-800 mb-1">
                    Ocupação Crítica
                  </h3>
                  <p className="text-sm text-orange-700">
                    Ocupação acima de 90%. Risco de congestionamento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {terminal.status === "Operando" &&
            terminal.efficiency >= 85 &&
            parseInt(terminal.capacity) < 90 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Activity
                    className="text-blue-600 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">
                      Performance Ótima
                    </h3>
                    <p className="text-sm text-blue-700">
                      Terminal com excelente desempenho e ocupação balanceada.
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Botão de voltar no final */}
      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Voltar para Terminais
        </button>
      </div>
    </div>
  );
}
