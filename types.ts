
export enum RaidLevel {
    RAID0 = 'RAID 0',
    RAID1 = 'RAID 1',
    RAID4 = 'RAID 4',
    RAID5 = 'RAID 5',
    RAID6 = 'RAID 6',
    RAID10 = 'RAID 1+0',
}

export interface RaidMetrics {
    totalCapacity: number;
    usableCapacity: number;
    redundancyCapacity: number;
    efficiency: number;
    faultTolerance: number;
    readSpeedMultiplier: string;
    writeSpeedMultiplier: string;
    description: string;
}

export enum BlockType {
    DATA = 'data',
    PARITY = 'parity',
    MIRROR = 'mirror',
    EMPTY = 'empty',
}

export interface DataBlock {
    type: BlockType;
    id: string;
    originalId?: string; // For mirrored data
}

export interface Explanation {
    title: string;
    description: string;
    pros_cons: string[];
}
