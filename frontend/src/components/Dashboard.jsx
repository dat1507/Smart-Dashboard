import React, { useState, useEffect, useCallback } from 'react';
import { Activity, AlertTriangle, Cpu, Factory } from 'lucide-react';
import { getProductionData, getKPIs } from '../services/api';
import MachineStatus from './MachineStatus';
import ProductionChart from './ProductionChart';
import GestureControl from './GestureControl';

const Dashboard = () => {
    const [allData, setAllData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [kpi, setKpi] = useState({ production_rate: 0, defect_rate: '0%', oee: '0%' });
    const [selectedLine, setSelectedLine] = useState('Line_01');
    const [gestureAlert, setGestureAlert] = useState(null);

    const fetchData = async () => {
        try {
            const [prodRes, kpiRes] = await Promise.all([
                getProductionData(),
                getKPIs()
            ]);
            
            setAllData(prodRes.data.data);
            setKpi(kpiRes.data.kpi);
            
            const filtered = prodRes.data.data.filter(item => item.Machine_ID === selectedLine);
            setDisplayData(filtered.slice(-15)); 
        } catch (error) {
            console.error("Lỗi cập nhật Dashboard:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const timer = setInterval(fetchData, 5000);
        return () => clearInterval(timer);
    }, [selectedLine]);

    const handleGesture = useCallback((gesture) => {
        console.log("Gesture detected:", gesture);
        
        setSelectedLine(prevLine => {
            const lines = ['Line_01', 'Line_02', 'Line_03'];
            const currentIndex = lines.indexOf(prevLine);
            const totalLines = lines.length;
            
            if (gesture === "Swipe Right" || gesture === "Swipe_Right") {
                if (currentIndex === totalLines - 1) {
                    return lines[0]; 
                }
                return lines[currentIndex + 1];

            } else if (gesture === "Swipe Left" || gesture === "Swipe_Left") {
                if (currentIndex === 0) {
                    return lines[totalLines - 1];
                }
                return lines[currentIndex - 1];
            }
            return prevLine;
        });
    }, []);

    return (
        <div className="min-h-screen bg-[#f4f7f6] text-slate-800 p-6 md:p-8 lg:p-10 font-sans relative overflow-x-hidden selection:bg-blue-200">
            {gestureAlert && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-full shadow-[0_8px_30px_rgba(20,184,166,0.3)] font-bold z-50 animate-bounce flex items-center gap-3">
                    <Activity size={20} />
                    {gestureAlert}
                </div>
            )}

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                        <Factory className="text-[#0056b3]" size={36} />
                        Smart Monitoring
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium text-sm lg:text-base">Industrial Analytics & Control Dashboard</p>
                </div>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4 flex-1 md:flex-auto min-w-[160px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Activity size={24} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">OEE Score</div>
                            <div className="text-2xl font-black text-slate-800">{kpi.oee}</div>
                        </div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4 flex-1 md:flex-auto min-w-[160px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Defect Rate</div>
                            <div className="text-2xl font-black text-slate-800">{kpi.defect_rate}</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {['Line_01', 'Line_02', 'Line_03'].map(lineId => {
                    const lastRecord = [...allData].reverse().find(d => d.Machine_ID === lineId);
                    const isActive = selectedLine === lineId;
                    return lastRecord ? (
                        <div 
                            key={lineId} 
                            onClick={() => setSelectedLine(lineId)}
                            className={`cursor-pointer transition-all duration-500 ${isActive ? 'scale-[1.03] opacity-100 z-10' : 'scale-100 opacity-60 hover:opacity-85 hover:scale-[1.01]'}`}
                        >
                            <div className={`h-full rounded-[1.35rem] p-[2px] ${isActive ? 'bg-gradient-to-br from-[#0056b3] to-indigo-500 shadow-[0_10px_40px_rgba(0,86,179,0.25)]' : 'bg-transparent'}`}>
                                <MachineStatus data={lastRecord} />
                            </div>
                        </div>
                    ) : null;
                })}
            </div>

            <div className="relative bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <div className="flex items-center gap-3 mb-2">
                    <Cpu className="text-indigo-500" size={24} />
                    <h2 className="text-xl font-bold text-slate-800">
                        Viewing details of: <span className="text-indigo-600 ml-1">{selectedLine}</span>
                    </h2>
                </div>
                <ProductionChart chartData={displayData} />
            </div>

            <GestureControl onGestureDetected={handleGesture} />
        </div>
    );
};

export default Dashboard;