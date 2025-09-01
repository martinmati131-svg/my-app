
import React from 'react';
import { RaidLevel } from '../types';

interface RaidControllerProps {
    raidLevel: RaidLevel;
    diskCount: number;
    diskCapacity: number;
    onRaidLevelChange: (level: RaidLevel) => void;
    onDiskCountChange: (count: number) => void;
    onDiskCapacityChange: (capacity: number) => void;
    minDisks: number;
    maxDisks: number;
    step?: number;
}

const RaidController: React.FC<RaidControllerProps> = ({
    raidLevel,
    diskCount,
    diskCapacity,
    onRaidLevelChange,
    onDiskCountChange,
    onDiskCapacityChange,
    minDisks,
    maxDisks,
    step = 1,
}) => {
    return (
        <div className="bg-gray-800/60 p-6 rounded-lg shadow-xl border border-gray-700 space-y-6">
            <h2 className="text-xl font-bold text-cyan-300 border-b border-gray-600 pb-3">Configuration</h2>
            
            <div>
                <label htmlFor="raid-level" className="block text-sm font-medium text-gray-300 mb-2">
                    RAID Level
                </label>
                <select
                    id="raid-level"
                    value={raidLevel}
                    onChange={(e) => onRaidLevelChange(e.target.value as RaidLevel)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    title="Select the RAID configuration. Each level offers a different balance of performance, redundancy, and cost."
                >
                    {Object.values(RaidLevel).map((level) => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="disk-count" className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Disks: <span className="font-bold text-cyan-400">{diskCount}</span>
                </label>
                <input
                    id="disk-count"
                    type="range"
                    min={minDisks}
                    max={maxDisks}
                    step={step}
                    value={diskCount}
                    onChange={(e) => onDiskCountChange(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
                    title={`Adjust the total number of disks. This RAID level requires a minimum of ${minDisks} disks.`}
                />
                 <style>{`
                    .range-thumb::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 20px;
                        height: 20px;
                        background: #22d3ee;
                        border-radius: 50%;
                        cursor: pointer;
                        transition: background .2s ease-in-out;
                    }
                    .range-thumb::-moz-range-thumb {
                        width: 20px;
                        height: 20px;
                        background: #22d3ee;
                        border-radius: 50%;
                        cursor: pointer;
                        border: none;
                        transition: background .2s ease-in-out;
                    }
                    .range-thumb::-webkit-slider-thumb:hover, .range-thumb::-moz-range-thumb:hover {
                         background: #67e8f9;
                    }
                `}</style>
            </div>

            <div>
                <label htmlFor="disk-capacity" className="block text-sm font-medium text-gray-300 mb-2">
                    Capacity per Disk: <span className="font-bold text-cyan-400">{diskCapacity} GB</span>
                </label>
                <input
                    id="disk-capacity"
                    type="range"
                    min="256"
                    max="4096"
                    step="256"
                    value={diskCapacity}
                    onChange={(e) => onDiskCapacityChange(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
                    title="Set the storage capacity for each individual disk in the array (in GB)."
                />
            </div>
        </div>
    );
};

export default RaidController;
