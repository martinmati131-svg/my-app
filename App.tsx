
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RaidLevel, RaidMetrics, DataBlock, Explanation } from './types';
import { MIN_DISKS, MAX_DISKS, RAID_CONFIGS } from './utils/constants';
import { calculateRaidMetrics, generateDataDistribution } from './utils/raidCalculator';
import { getRaidExplanation } from './services/geminiService';
import RaidController from './components/RaidController';
import RaidVisualizer from './components/RaidVisualizer';
import MetricsDisplay from './components/MetricsDisplay';
import ExplanationCard from './components/ExplanationCard';

const App: React.FC = () => {
    const [raidLevel, setRaidLevel] = useState<RaidLevel>(RaidLevel.RAID5);
    const [diskCount, setDiskCount] = useState<number>(4);
    const [diskCapacity, setDiskCapacity] = useState<number>(1024); // in GB
    
    const [metrics, setMetrics] = useState<RaidMetrics | null>(null);
    const [dataDistribution, setDataDistribution] = useState<DataBlock[][][]>([]);
    
    const [explanation, setExplanation] = useState<Explanation | null>(null);
    const [isLoadingExplanation, setIsLoadingExplanation] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const currentRaidConfig = useMemo(() => RAID_CONFIGS[raidLevel], [raidLevel]);

    const handleRaidLevelChange = useCallback((newLevel: RaidLevel) => {
        setRaidLevel(newLevel);
        const config = RAID_CONFIGS[newLevel];
        // Adjust disk count if current count is invalid for the new RAID level
        if (diskCount < config.minDisks) {
            setDiskCount(config.minDisks);
        } else if (config.step && diskCount % config.step !== 0) {
            setDiskCount(Math.ceil(diskCount / config.step) * config.step);
        }
    }, [diskCount]);

    useEffect(() => {
        const fetchExplanation = async () => {
            setIsLoadingExplanation(true);
            setError(null);
            try {
                const fetchedExplanation = await getRaidExplanation(raidLevel);
                setExplanation(fetchedExplanation);
            } catch (e) {
                console.error("Failed to fetch explanation:", e);
                setError('Could not load explanation from Gemini.');
                setExplanation(null);
            } finally {
                setIsLoadingExplanation(false);
            }
        };

        fetchExplanation();
    }, [raidLevel]);

    useEffect(() => {
        const newMetrics = calculateRaidMetrics(raidLevel, diskCount, diskCapacity);
        const newDataDistribution = generateDataDistribution(raidLevel, diskCount);
        setMetrics(newMetrics);
        setDataDistribution(newDataDistribution);
    }, [raidLevel, diskCount, diskCapacity]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
            <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-3xl font-bold text-cyan-400 tracking-wider">
                        RAID Level Visualizer
                    </h1>
                    <p className="text-gray-400 mt-1">An interactive guide to disk storage models</p>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <RaidController
                        raidLevel={raidLevel}
                        diskCount={diskCount}
                        diskCapacity={diskCapacity}
                        onRaidLevelChange={handleRaidLevelChange}
                        onDiskCountChange={setDiskCount}
                        onDiskCapacityChange={setDiskCapacity}
                        minDisks={currentRaidConfig.minDisks}
                        maxDisks={MAX_DISKS}
                        step={currentRaidConfig.step}
                    />
                    {metrics && <MetricsDisplay metrics={metrics} />}
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <RaidVisualizer 
                        key={`${raidLevel}-${diskCount}`}
                        diskCount={diskCount} 
                        dataDistribution={dataDistribution} 
                    />
                    <ExplanationCard 
                        explanation={explanation} 
                        isLoading={isLoadingExplanation} 
                        error={error}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
