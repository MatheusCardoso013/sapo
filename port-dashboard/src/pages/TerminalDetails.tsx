import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Ship,
  TrendingUp,
  Package,
  AlertCircle,
  Activity,
  Clock,
  Warehouse,
  BarChart3,
  Box,
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
  volume?: number;
  operationalCapacity?: number;
  marketShare?: number;
  volumeTeu?: number; // Volume em TEU
  // Novos campos
  totalArea?: number;
  storageCapacity?: number;
  annualCapacity?: number;
  avgAnnualThroughput?: number;
  avgBerthProductivity?: number;
  avgShipOperationTime?: number;
  capacityUtilizationRate?: number;
  avgDwellTime?: number;
  craneProductivity?: number;
  avgShipWaitTime?: number;
  yardOccupancyRate?: number;
}

const defaultTerminals: Terminal[] = [
  {
    id: 1,
    name: "Santos Brasil",
    type: "Contêineres",
    docks: 3,
    status: "Operando",
    capacity: "127%",
    efficiency: 92,
    throughput: 212,
    volume: 1473041,
    marketShare: 43,
    operationalCapacity: 2000000,
    volumeTeu: 2540000,
    totalArea: 596000,
    storageCapacity: 45000,
    annualCapacity: 2000000,
    avgAnnualThroughput: 1473041,
    avgBerthProductivity: 105,
    avgShipOperationTime: 18,
    capacityUtilizationRate: 0,
    avgDwellTime: 26.8,
    craneProductivity: 109,
    avgShipWaitTime: 4,
    yardOccupancyRate: 78,
  },
  {
    id: 2,
    name: "DP World Santos",
    type: "Contêineres",
    docks: 2,
    status: "Manutenção Parcial",
    capacity: "92%",
    efficiency: 78,
    throughput: 110,
    volume: 750223,
    marketShare: 22,
    operationalCapacity: 1400000,
    volumeTeu: 1290000,
    totalArea: 845000,
    storageCapacity: 35000,
    annualCapacity: 1400000,
    avgAnnualThroughput: 750223,
    avgBerthProductivity: 85,
    avgShipOperationTime: 22,
    capacityUtilizationRate: 54,
    avgDwellTime: 13.6,
    craneProductivity: 90,
    avgShipWaitTime: 6,
    yardOccupancyRate: 65,
  },
  {
    id: 3,
    name: "Brasil Terminal Portuário",
    type: "Contêineres",
    docks: 3,
    status: "Operando",
    capacity: "81%",
    efficiency: 88,
    throughput: 166,
    volume: 1178433,
    marketShare: 34.4,
    operationalCapacity: 2500000,
    volumeTeu: 2030000,
    totalArea: 490000,
    storageCapacity: 48000,
    annualCapacity: 2500000,
    avgAnnualThroughput: 1178433,
    avgBerthProductivity: 95,
    avgShipOperationTime: 20,
    capacityUtilizationRate: 59,
    avgDwellTime: 21.4,
    craneProductivity: 100,
    avgShipWaitTime: 5,
    yardOccupancyRate: 72,
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
    volume: 23980,
    marketShare: 0.7,
    operationalCapacity: 50000,
    volumeTeu: 40000,
    totalArea: 85000,
    storageCapacity: 8000,
    annualCapacity: 100000,
    avgAnnualThroughput: 23980,
    avgBerthProductivity: 0,
    avgShipOperationTime: 0,
    capacityUtilizationRate: 0,
    avgDwellTime: 0,
    craneProductivity: 0,
    avgShipWaitTime: 0,
    yardOccupancyRate: 0,
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
          volume: data.volume,
          operationalCapacity: data.operational_capacity,
          marketShare: data.market_share,
          volumeTeu: data.volume_teu,
          totalArea: data.total_area,
          storageCapacity: data.storage_capacity,
          annualCapacity: data.annual_capacity,
          avgAnnualThroughput: data.avg_annual_throughput,
          avgBerthProductivity: data.avg_berth_productivity,
          avgShipOperationTime: data.avg_ship_operation_time,
          capacityUtilizationRate: data.capacity_utilization_rate,
          avgDwellTime: data.avg_dwell_time,
          craneProductivity: data.crane_productivity,
          avgShipWaitTime: data.avg_ship_wait_time,
          yardOccupancyRate: data.yard_occupancy_rate,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar terminal:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return "N/A";
    return num.toLocaleString("pt-BR");
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
            {terminal.operationalCapacity && terminal.volumeTeu
              ? (
                  (terminal?.volumeTeu / terminal?.operationalCapacity) *
                  100
                ).toFixed(2)
              : 0}
            %
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${parseFloat(terminal.capacity) > 90 ? "bg-red-500" : parseFloat(terminal.capacity) > 75 ? "bg-yellow-500" : "bg-green-500"}`}
              style={{ width: `${Math.min(parseFloat(terminal.capacity), 100)}%` }}
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

      {/* Cards secundários de métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Warehouse className="text-blue-600" size={18} />
            <span className="text-xs font-medium text-blue-700">
              Área Total
            </span>
          </div>
          <div className="text-xl font-bold text-blue-900">
            {terminal.totalArea ? formatNumber(terminal.totalArea) : "N/A"}
          </div>
          <span className="text-xs text-blue-600">m²</span>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Box className="text-green-600" size={18} />
            <span className="text-xs font-medium text-green-700">
              Armazenagem
            </span>
          </div>
          <div className="text-xl font-bold text-green-900">
            {terminal.storageCapacity
              ? formatNumber(terminal.storageCapacity)
              : "N/A"}
          </div>
          <span className="text-xs text-green-600">TEU</span>
        </div>

        {terminal.volumeTeu && (
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-indigo-600" size={18} />
              <span className="text-xs font-medium text-indigo-700">
                Volume TEU
              </span>
            </div>
            <div className="text-xl font-bold text-indigo-900">
              {terminal.volumeTeu >= 1000
                ? `${(terminal.volumeTeu / 1000).toFixed(2)}M`
                : `${formatNumber(terminal.volumeTeu)}k`}
            </div>
            <span className="text-xs text-indigo-600">TEUs/ano</span>
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-purple-600" size={18} />
            <span className="text-xs font-medium text-purple-700">
              Market Share
            </span>
          </div>
          <div className="text-xl font-bold text-purple-900">
            {terminal.marketShare ? `${terminal.marketShare}%` : "N/A"}
          </div>
          <span className="text-xs text-purple-600">do porto</span>
        </div>
        </div>
      {/* Informações gerais e Métricas de Desempenho */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Ship className="text-blue-500" size={22} />
            Informações Gerais
          </h2>
          <div className="space-y-3">
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
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Número de Berços
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.docks} berços
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Área Total</span>
              <span className="text-gray-800 font-semibold">
                {terminal.totalArea
                  ? `${formatNumber(terminal.totalArea)} m²`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600 font-medium">Market Share</span>
              <span className="text-gray-800 font-semibold">
                {terminal.marketShare ? `${terminal.marketShare}%` : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-500" size={22} />
            Métricas de Desempenho
          </h2>
          <div className="space-y-3">
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

      {/* Capacidade e Armazenagem + Produtividade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Warehouse className="text-blue-500" size={22} />
            Capacidade e Armazenagem
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Total de Containers
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.storageCapacity
                  ? `${formatNumber(terminal.avgAnnualThroughput)} Containers`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Capacidade de Armazenagem no pátio
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.storageCapacity
                  ? `${formatNumber(terminal.storageCapacity)} TEU`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Estimativa em Containers (toneladas)
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.storageCapacity
                  ? `${formatNumber(terminal.avgDwellTime)} toneladas`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Movimento por hora
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.storageCapacity
                  ? `${formatNumber(terminal.craneProductivity)} MPH`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Capacidade Anual
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.annualCapacity
                  ? `${formatNumber(terminal.annualCapacity)} TEU`
                  : "N/A"}
              </span>
            </div>
            
            
            {terminal.volumeTeu && (
              <div className="flex justify-between py-3">
                <span className="text-gray-600 font-medium">
                  Volume TEU Anual
                </span>
                <span className="text-blue-600 font-bold text-lg">
                  {formatNumber(terminal.volumeTeu)} TEU
                </span>
              </div>
            )}
          </div>

          {/* Barra de visualização da ocupação do pátio */}
          {terminal.yardOccupancyRate !== undefined && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Ocupação do Pátio</span>
                <span className="font-semibold">
                  {terminal.yardOccupancyRate}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    terminal.yardOccupancyRate > 85
                      ? "bg-red-500"
                      : terminal.yardOccupancyRate > 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${terminal.yardOccupancyRate}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Gauge className="text-purple-500" size={22} />
            Produtividade
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Produtividade de Berço
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.avgBerthProductivity
                  ? `${terminal.avgBerthProductivity} mov/hora`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Produtividade de Guindastes
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.craneProductivity
                  ? `${terminal.craneProductivity} mov/hora`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">
                Tempo Médio de Operação
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.avgShipOperationTime
                  ? `${terminal.avgShipOperationTime} horas`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600 font-medium">
                Tempo Médio de Espera
              </span>
              <span className="text-gray-800 font-semibold">
                {terminal.avgShipWaitTime
                  ? `${terminal.avgShipWaitTime} horas`
                  : "N/A"}
              </span>
            </div>
          </div> */}

        {/* Indicador de produtividade */}
        {/* {terminal.avgBerthProductivity !== undefined && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    terminal.avgBerthProductivity >= 100
                      ? "bg-green-500"
                      : terminal.avgBerthProductivity >= 80
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {terminal.avgBerthProductivity >= 100
                    ? "Produtividade Excelente"
                    : terminal.avgBerthProductivity >= 80
                      ? "Produtividade Boa"
                      : "Produtividade Baixa"}
                </span>
              </div>
            </div>
          )}
        </div> */}
      </div>

      {/* Tempos Operacionais */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="text-orange-500" size={22} />
          Tempos Operacionais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Ship className="text-white" size={20} />
              </div>
              <span className="font-medium text-blue-800">
                Operação do Navio
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-1">
              {terminal.avgShipOperationTime
                ? terminal.avgShipOperationTime
                : "N/A"}
            </div>
            <span className="text-sm text-blue-600">
              horas (atracação a desatracação)
            </span>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Timer className="text-white" size={20} />
              </div>
              <span className="font-medium text-orange-800">
                Espera do Navio
              </span>
            </div>
            <div className="text-3xl font-bold text-orange-900 mb-1">
              {terminal.avgShipWaitTime ? terminal.avgShipWaitTime : "N/A"}
            </div>
            <span className="text-sm text-orange-600">
              horas (antes da atracação)
            </span>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-5 border border-cyan-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                <Box className="text-white" size={20} />
              </div>
              <span className="font-medium text-cyan-800">Dwell Time</span>
            </div>
            <div className="text-3xl font-bold text-cyan-900 mb-1">
              {terminal.avgDwellTime ? terminal.avgDwellTime : "N/A"}
            </div>
            <span className="text-sm text-cyan-600">
              dias (permanência do contêiner)
            </span>
          </div>
        </div>
      </div> */}

      {/* Análise de performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="text-indigo-500" size={22} />
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
                    Ocupação acima de 100%. Risco real.
                  </p>
                </div>
              </div>
            </div>
          )}

          {terminal.avgShipWaitTime !== undefined &&
            terminal.avgShipWaitTime > 8 && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Clock
                    className="text-rose-600 flex-shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h3 className="font-semibold text-rose-800 mb-1">
                      Tempo de Espera Alto
                    </h3>
                    <p className="text-sm text-rose-700">
                      Navios aguardando mais de 8 horas para atracar.
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
