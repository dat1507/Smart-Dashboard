import React from 'react';

const MachineStatus = ({ data }) => {
    // Colors based on user requirements
    const statusColor = data.Status === 'Running' ? '#39ff14' : data.Status === 'Warning' ? '#ffbf00' : '#cc0000';

    return (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-white/60 p-5 w-full flex flex-col justify-between h-full hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
            <h4 className="text-xl font-bold text-slate-800 mb-4">{data.Machine_ID}</h4>
            <div className="text-sm text-slate-600 space-y-3">
                <p className="flex justify-between items-center">
                    <span className="font-medium">Status</span>
                    <span style={{ color: statusColor, textShadow: '0 0 1px rgba(0,0,0,0.2)' }} className="font-bold px-2.5 py-1 bg-white/60 rounded-lg shadow-sm">
                        {data.Status}
                    </span>
                </p>
                <div className="h-px bg-slate-200/60 w-full"></div>
                <p className="flex justify-between items-center">
                    <span className="font-medium">Temp</span>
                    <span className="font-bold text-slate-800">{data.Temperature}°C</span>
                </p>
                <div className="h-px bg-slate-200/60 w-full"></div>
                <p className="flex justify-between items-center">
                    <span className="font-medium">Output</span>
                    <span className="font-bold text-slate-800">{data.Output}</span>
                </p>
            </div>
        </div>
    );
};

export default MachineStatus;