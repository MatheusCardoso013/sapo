import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
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
  totalArea?: number; // Área total (m²)
  storageCapacity?: number; // Capacidade de armazenagem (TEU ou toneladas)
  annualCapacity?: number; // Capacidade anual (TEU ou toneladas)
  avgAnnualThroughput?: number; // Throughput médio anual
  avgBerthProductivity?: number; // Produtividade média de berço
  avgShipOperationTime?: number; // Tempo médio de operação do navio (horas)
  capacityUtilizationRate?: number; // Taxa de utilização da capacidade (%)
  avgDwellTime?: number; // Tempo médio de permanência do contêiner (dias)
  craneProductivity?: number; // Produtividade de guindastes (movimentos/hora)
  avgShipWaitTime?: number; // Tempo médio de espera do navio (horas)
  yardOccupancyRate?: number; // Taxa de ocupação do pátio (%)
}

const getTerminals = async (): Promise<Terminal[]> => {
  try {
    const { data, error } = await supabase
      .from("terminals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      type: t.type,
      docks: t.docks,
      status: t.status,
      capacity: `${t.capacity}%`,
      efficiency: t.efficiency,
      throughput: t.throughput,
      createdAt: t.created_at,
      volumeTeu: t.volume_teu,
      // Novos campos
      totalArea: t.total_area,
      storageCapacity: t.storage_capacity,
      annualCapacity: t.annual_capacity,
      avgAnnualThroughput: t.avg_annual_throughput,
      avgBerthProductivity: t.avg_berth_productivity,
      avgShipOperationTime: t.avg_ship_operation_time,
      capacityUtilizationRate: t.capacity_utilization_rate,
      avgDwellTime: t.avg_dwell_time,
      craneProductivity: t.crane_productivity,
      avgShipWaitTime: t.avg_ship_wait_time,
      yardOccupancyRate: t.yard_occupancy_rate,
    }));
  } catch (error) {
    console.error("Erro ao buscar terminais:", error);
    return [];
  }
};

const saveTerminal = async (terminal: Omit<Terminal, "id" | "createdAt">) => {
  try {
    const { data, error } = await supabase
      .from("terminals")
      .insert([
        {
          name: terminal.name,
          type: terminal.type,
          docks: terminal.docks,
          status: terminal.status,
          capacity: parseInt(terminal.capacity),
          efficiency: terminal.efficiency,
          throughput: terminal.throughput,
          created_at: new Date().toISOString(),
          volume_teu: terminal.volumeTeu,
          // Novos campos
          total_area: terminal.totalArea,
          storage_capacity: terminal.storageCapacity,
          annual_capacity: terminal.annualCapacity,
          avg_annual_throughput: terminal.avgAnnualThroughput,
          avg_berth_productivity: terminal.avgBerthProductivity,
          avg_ship_operation_time: terminal.avgShipOperationTime,
          capacity_utilization_rate: terminal.capacityUtilizationRate,
          avg_dwell_time: terminal.avgDwellTime,
          crane_productivity: terminal.craneProductivity,
          avg_ship_wait_time: terminal.avgShipWaitTime,
          yard_occupancy_rate: terminal.yardOccupancyRate,
        },
      ])
      .select();

    if (error) throw error;

    const newTerminal = data?.[0];
    return {
      id: newTerminal.id,
      name: newTerminal.name,
      type: newTerminal.type,
      docks: newTerminal.docks,
      status: newTerminal.status,
      capacity: `${newTerminal.capacity}%`,
      efficiency: newTerminal.efficiency,
      throughput: newTerminal.throughput,
      createdAt: newTerminal.created_at,
      volumeTeu: newTerminal.volume_teu,
      totalArea: newTerminal.total_area,
      storageCapacity: newTerminal.storage_capacity,
      annualCapacity: newTerminal.annual_capacity,
      avgAnnualThroughput: newTerminal.avg_annual_throughput,
      avgBerthProductivity: newTerminal.avg_berth_productivity,
      avgShipOperationTime: newTerminal.avg_ship_operation_time,
      capacityUtilizationRate: newTerminal.capacity_utilization_rate,
      avgDwellTime: newTerminal.avg_dwell_time,
      craneProductivity: newTerminal.crane_productivity,
      avgShipWaitTime: newTerminal.avg_ship_wait_time,
      yardOccupancyRate: newTerminal.yard_occupancy_rate,
    };
  } catch (error) {
    console.error("Erro ao salvar terminal:", error);
    throw error;
  }
};

const deleteTerminal = async (id: number) => {
  try {
    const { error } = await supabase.from("terminals").delete().eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Erro ao deletar terminal:", error);
    throw error;
  }
};

export function TerminalsContent({
  userEmail,
  onViewDetails,
}: {
  userEmail: string;
  onViewDetails: (terminalId: number) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [customTerminals, setCustomTerminals] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = userEmail === "admin@sapo.com";

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
      volume: 1473041,
      marketShare: 43,
      operationalCapacity: 2000000,
      volumeTeu: 2540, // 2.54 milhões TEU
      totalArea: 596000,
      storageCapacity: 58000,
      annualCapacity: 2400000,
      avgAnnualThroughput: 1473041,
      avgBerthProductivity: 105,
      avgShipOperationTime: 18,
      capacityUtilizationRate: 61,
      avgDwellTime: 5,
      craneProductivity: 35,
      avgShipWaitTime: 4,
      yardOccupancyRate: 78,
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
      volume: 750223,
      marketShare: 22,
      operationalCapacity: 1400000,
      volumeTeu: 1290, // 1.29 milhões TEU
      totalArea: 350000,
      storageCapacity: 35000,
      annualCapacity: 1400000,
      avgAnnualThroughput: 750223,
      avgBerthProductivity: 85,
      avgShipOperationTime: 22,
      capacityUtilizationRate: 54,
      avgDwellTime: 6,
      craneProductivity: 28,
      avgShipWaitTime: 6,
      yardOccupancyRate: 65,
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
      volume: 1178433,
      marketShare: 34.4,
      operationalCapacity: 2500000,
      volumeTeu: 2030, // 2.03 milhões TEU
      totalArea: 490000,
      storageCapacity: 48000,
      annualCapacity: 2000000,
      avgAnnualThroughput: 1178433,
      avgBerthProductivity: 95,
      avgShipOperationTime: 20,
      capacityUtilizationRate: 59,
      avgDwellTime: 5.5,
      craneProductivity: 32,
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
      volumeTeu: 40, // 40 mil TEU
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

  const terminals = [...defaultTerminals, ...customTerminals];

  useEffect(() => {
    loadTerminals();
  }, []);

  const loadTerminals = async () => {
    setLoading(true);
    try {
      const data = await getTerminals();
      setCustomTerminals(data);
    } catch (error) {
      console.error("Erro ao carregar terminais:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTerminal = async (
    terminal: Omit<Terminal, "id" | "createdAt">,
  ) => {
    try {
      const newTerminal = await saveTerminal(terminal);
      setCustomTerminals((prev) => [...prev, newTerminal]);
      setShowModal(false);
    } catch (error) {
      alert("Erro ao adicionar terminal. Tente novamente.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTerminal(id);
      setCustomTerminals((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      alert("Erro ao remover terminal. Tente novamente.");
    }
  };

  if (loading && customTerminals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Carregando terminais...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Terminais (Porto de Santos)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Visão geral da operação e eficiência de todos os terminais
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-port-accent hover:bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Cadastrar Terminal
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {terminals.map((terminal) => (
          <div
            key={terminal.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className={`h-2 ${terminal.status === "Operando" ? "bg-green-500" : terminal.status === "Fechado" ? "bg-red-500" : "bg-yellow-500"}`}
            ></div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-800 text-lg leading-tight pr-2">
                  {terminal.name}
                </h3>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${terminal.status === "Operando" ? "bg-green-100 text-green-700" : terminal.status === "Fechado" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {terminal.status}
                </span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tipo Carga</span>
                  <span className="font-medium text-gray-700">
                    {terminal.type}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Berços</span>
                  <span className="font-medium text-gray-700">
                    {terminal.docks} ativos
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ocupação</span>
                  <span className="font-medium text-gray-700">
                    {terminal.capacity}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Eficiência</span>
                  <span
                    className={`font-bold ${terminal.efficiency >= 85 ? "text-green-600" : terminal.efficiency >= 70 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {terminal.efficiency}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Throughput</span>
                  <span className="font-medium text-gray-700">
                    {terminal.throughput}k TEU
                  </span>
                </div>
                {terminal.volumeTeu && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Volume TEU</span>
                    <span className="font-bold text-blue-600">
                      {terminal.volumeTeu >= 1000
                        ? `${(terminal.volumeTeu / 1000).toFixed(2)}M`
                        : `${terminal.volumeTeu}k`}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${parseInt(terminal.capacity) > 90 ? "bg-red-500" : parseInt(terminal.capacity) > 75 ? "bg-yellow-500" : "bg-green-500"}`}
                  style={{ width: terminal.capacity }}
                ></div>
              </div>

              {isAdmin && terminal.createdAt && (
                <button
                  onClick={() => handleDelete(terminal.id)}
                  className="w-full py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 mb-2"
                >
                  Remover Terminal
                </button>
              )}

              <button
                onClick={() => onViewDetails(terminal.id)}
                className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
              >
                Ver detalhes operacionais
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <AddTerminalModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddTerminal}
        />
      )}
    </div>
  );
}

function AddTerminalModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (terminal: Omit<Terminal, "id" | "createdAt">) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    docks: 1,
    status: "Operando" as Terminal["status"],
    capacity: "0",
    efficiency: 0,
    throughput: 0,
    volumeTeu: 0,
    // Novos campos
    totalArea: 0,
    storageCapacity: 0,
    annualCapacity: 0,
    avgAnnualThroughput: 0,
    avgBerthProductivity: 0,
    avgShipOperationTime: 0,
    capacityUtilizationRate: 0,
    avgDwellTime: 0,
    craneProductivity: 0,
    avgShipWaitTime: 0,
    yardOccupancyRate: 0,
  });

  const [activeSection, setActiveSection] = useState<
    "basic" | "capacity" | "performance" | "time"
  >("basic");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      capacity: `${formData.capacity}%`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Cadastrar Novo Terminal
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Preencha os dados do terminal portuário
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs de navegação */}
        <div className="border-b border-gray-200 px-6 bg-gray-50">
          <nav className="flex gap-1 -mb-px">
            <button
              type="button"
              onClick={() => setActiveSection("basic")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "basic"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Dados Básicos
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("capacity")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "capacity"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Capacidade
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("performance")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "performance"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Desempenho
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("time")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === "time"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Tempos e Taxas
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Seção: Dados Básicos */}
            {activeSection === "basic" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Informações Básicas
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome do Terminal *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: Terminal Santos XYZ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Carga *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="">Selecione...</option>
                      <option value="Contêineres">Contêineres</option>
                      <option value="Carga Geral">Carga Geral</option>
                      <option value="Granel Sólido">Granel Sólido</option>
                      <option value="Granel Líquido">Granel Líquido</option>
                      <option value="Açúcar">Açúcar</option>
                      <option value="Açúcar e Grãos">Açúcar e Grãos</option>
                      <option value="Multiuso">Multiuso</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status Operacional *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as Terminal["status"],
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Operando">Operando</option>
                      <option value="Manutenção Parcial">
                        Manutenção Parcial
                      </option>
                      <option value="Fechado">Fechado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Berços *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="20"
                      value={formData.docks}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          docks: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Área Total do Terminal (m²)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.totalArea}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          totalArea: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 500000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Seção: Capacidade */}
            {activeSection === "capacity" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Capacidade e Armazenagem
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Capacidade de Armazenagem (TEU)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.storageCapacity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          storageCapacity: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 50000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Capacidade estática de armazenagem
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Capacidade Anual do Terminal (TEU)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.annualCapacity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          annualCapacity: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 2000000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Capacidade máxima de movimentação anual
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ocupação Atual (%) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          capacity: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 85"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Taxa de Utilização da Capacidade (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.capacityUtilizationRate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          capacityUtilizationRate:
                            parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 65"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Percentual da capacidade efetivamente utilizada
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Taxa de Ocupação do Pátio (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.yardOccupancyRate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          yardOccupancyRate: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 75"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nível de ocupação da área de pátio
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Seção: Desempenho */}
            {activeSection === "performance" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  Métricas de Desempenho
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Eficiência Operacional (%) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.efficiency}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          efficiency: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 92"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Taxa de aproveitamento da capacidade
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Throughput Mensal (mil TEUs) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.throughput}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          throughput: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 150"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Volume movimentado por mês
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Volume TEU Anual (mil TEUs) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.volumeTeu}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          volumeTeu: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 2540"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Volume total anual em TEU (em milhares)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Throughput Médio Anual (TEU)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.avgAnnualThroughput}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          avgAnnualThroughput: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 1500000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Volume médio movimentado por ano
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Produtividade Média de Berço (mov/hora)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.avgBerthProductivity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          avgBerthProductivity: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Movimentos por hora de berço ocupado
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Produtividade de Guindastes (mov/hora)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.craneProductivity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          craneProductivity: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 35"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Movimentos por hora por guindaste
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Seção: Tempos e Taxas */}
            {activeSection === "time" && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  Tempos Operacionais
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tempo Médio de Operação do Navio (horas)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.avgShipOperationTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          avgShipOperationTime: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 18"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tempo médio de atracação a desatracação
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tempo Médio de Espera do Navio (horas)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.avgShipWaitTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          avgShipWaitTime: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 4"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tempo de espera antes da atracação
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tempo Médio de Permanência do Contêiner - Dwell Time
                      (dias)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.avgDwellTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          avgDwellTime: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors"
                      placeholder="Ex: 5"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tempo médio que o contêiner permanece no terminal
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-sm text-orange-800">
                    <strong>💡 Dica:</strong> Tempos menores de operação e
                    espera geralmente indicam maior eficiência operacional. O
                    dwell time ideal varia conforme o tipo de terminal, mas
                    valores mais baixos reduzem custos de armazenagem.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Dica:</strong> Os dados de eficiência operacional ajudam
                a identificar gargalos e oportunidades de melhoria na gestão
                portuária.
              </p>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
              >
                Cadastrar Terminal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
