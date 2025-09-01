import React from 'react';
import { RaidMetrics } from '../types';
import { SpeedometerIcon, CheckCircleIcon, ExclamationTriangleIcon } from './icons';

interface MetricItemProps {
    label: string;
    value: string | number;
    unit?: string;
    children?: React.ReactNode;
    valueClassName?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value, unit, children, valueClassName }) => (
    <div className="flex justify-between items-center text-sm p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-gray-700/60 cursor-default">
        <span className="text-gray-400 flex items-center">{children}{label}</span>
        <span className={`font-semibold ${valueClassName || 'text-gray-100'}`}>
            {value} <span className="text-gray-400">{unit}</span>
        </span>
    </div>
);

const MetricsDisplay: React.FC<{ metrics: RaidMetrics }> = ({ metrics }) => {
    const efficiencyPercentage = (metrics.efficiency * 100).toFixed(0);

    return (
        <div className="bg-gray-800/60 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold text-cyan-300 border-b border-gray-600 pb-3 mb-4">Performance & Metrics</h2>
            
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                <div 
                    className="bg-cyan-500 h-2.5 rounded-full" 
                    style={{ width: `${efficiencyPercentage}%` }}
                    title={`Storage Efficiency: ${efficiencyPercentage}%`}
                ></div>
            </div>

            <div className="space-y-2">
                <MetricItem label="Usable Capacity" value={metrics.usableCapacity} unit="GB" />
                <MetricItem label="Total Raw Capacity" value={metrics.totalCapacity} unit="GB" />
                <MetricItem label="Redundancy Cost" value={metrics.redundancyCapacity} unit="GB" />
                <MetricItem label="Storage Efficiency" value={`${efficiencyPercentage}%`} />
                
                <MetricItem
                    label="Fault Tolerance"
                    value={`${metrics.faultTolerance} disk${metrics.faultTolerance !== 1 ? 's' : ''}`}
                    valueClassName={metrics.faultTolerance > 0 ? 'text-green-400' : 'text-red-400'}
                >
                    {metrics.faultTolerance > 0 ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-400 mr-2" />
                    )}
                </MetricItem>
                
                <MetricItem label="Read Performance" value={metrics.readSpeedMultiplier}>
                    <SpeedometerIcon className="w-4 h-4 text-blue-400 mr-2" />
                </MetricItem>
                
                <MetricItem label="Write Performance" value={metrics.writeSpeedMultiplier}>
                    <SpeedometerIcon className="w-4 h-4 text-yellow-400 mr-2" />
                </MetricItem>
            </div>
        </div>
    );
};

export default MetricsDisplay;