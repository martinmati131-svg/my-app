
import React from 'react';
import { DataBlock, BlockType } from '../types';

interface RaidVisualizerProps {
    diskCount: number;
    dataDistribution: DataBlock[][][];
}

const BLOCK_COLORS: { [key in BlockType]: string } = {
    [BlockType.DATA]: 'bg-blue-500 border-blue-400',
    [BlockType.PARITY]: 'bg-yellow-500 border-yellow-400',
    [BlockType.MIRROR]: 'bg-green-500 border-green-400',
    [BlockType.EMPTY]: 'bg-gray-700/50 border-gray-600',
};

const DataBlockComponent: React.FC<{ block: DataBlock }> = ({ block }) => (
    <div 
        className={`w-full h-6 rounded flex items-center justify-center text-xs font-mono border ${BLOCK_COLORS[block.type]}`}
        title={`${block.type.toUpperCase()}: ${block.id}`}
    >
        {block.type === BlockType.DATA && `D:${block.id}`}
        {block.type === BlockType.PARITY && `P:${block.id}`}
        {block.type === BlockType.MIRROR && `M:${block.originalId}`}
    </div>
);

const Disk: React.FC<{ diskNumber: number; stripes: DataBlock[][] }> = ({ diskNumber, stripes }) => (
    <div className="flex flex-col items-center space-y-2">
        <div className="text-sm font-semibold text-gray-400">Disk {diskNumber}</div>
        <div className="w-full bg-gray-800/50 p-2 rounded-lg border border-gray-700 space-y-1.5 min-h-[10rem]">
            {stripes.map((stripe, stripeIndex) => (
                <div key={stripeIndex} className="flex space-x-1">
                    {stripe.map((block, blockIndex) => (
                        <DataBlockComponent key={blockIndex} block={block} />
                    ))}
                </div>
            ))}
        </div>
    </div>
);


const RaidVisualizer: React.FC<RaidVisualizerProps> = ({ diskCount, dataDistribution }) => {
    return (
        <div className="bg-gray-800/60 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold text-cyan-300 border-b border-gray-600 pb-3 mb-6">Disk Array Visualization</h2>
            <div 
                className="grid gap-4 transition-all duration-500"
                style={{ gridTemplateColumns: `repeat(${diskCount}, minmax(0, 1fr))` }}
            >
                {Array.from({ length: diskCount }).map((_, i) => (
                    <Disk key={i} diskNumber={i} stripes={dataDistribution[i] || []} />
                ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded bg-blue-500"></div><span className="text-sm">Data Block</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded bg-yellow-500"></div><span className="text-sm">Parity Block</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded bg-green-500"></div><span className="text-sm">Mirrored Data</span></div>
            </div>
        </div>
    );
};

export default RaidVisualizer;
