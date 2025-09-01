import { RaidLevel, RaidMetrics, DataBlock, BlockType } from '../types';

export const calculateRaidMetrics = (
    level: RaidLevel,
    diskCount: number,
    diskCapacity: number
): RaidMetrics => {
    let usableCapacity = 0;
    let faultTolerance = 0;
    let readSpeedMultiplier = "1x";
    let writeSpeedMultiplier = "1x";
    let description = "";

    const totalCapacity = diskCount * diskCapacity;

    switch (level) {
        case RaidLevel.RAID0:
            usableCapacity = totalCapacity;
            faultTolerance = 0;
            readSpeedMultiplier = `${diskCount}x`;
            writeSpeedMultiplier = `${diskCount}x`;
            description = "Striping without parity. High performance, no redundancy.";
            break;
        case RaidLevel.RAID1:
            usableCapacity = diskCapacity;
            faultTolerance = diskCount - 1;
            readSpeedMultiplier = `${diskCount}x`;
            writeSpeedMultiplier = "1x";
            description = "Mirroring. High redundancy, high cost.";
            break;
        case RaidLevel.RAID4:
            usableCapacity = (diskCount - 1) * diskCapacity;
            faultTolerance = 1;
            readSpeedMultiplier = `${diskCount - 1}x`;
            writeSpeedMultiplier = "1x (Parity Bottleneck)";
            description = "Block-level striping with a dedicated parity disk.";
            break;
        case RaidLevel.RAID5:
            usableCapacity = (diskCount - 1) * diskCapacity;
            faultTolerance = 1;
            readSpeedMultiplier = `${diskCount - 1}x`;
            writeSpeedMultiplier = `${diskCount - 1}x`;
            description = "Block-level striping with distributed parity.";
            break;
        case RaidLevel.RAID6:
            usableCapacity = (diskCount - 2) * diskCapacity;
            faultTolerance = 2;
            readSpeedMultiplier = `${diskCount - 2}x`;
            writeSpeedMultiplier = `${diskCount - 2}x`;
            description = "Block-level striping with double distributed parity.";
            break;
        case RaidLevel.RAID10:
            usableCapacity = totalCapacity / 2;
            faultTolerance = diskCount / 2;
            readSpeedMultiplier = `${diskCount}x`;
            writeSpeedMultiplier = `${diskCount / 2}x`;
            description = "A stripe of mirrors. High performance and redundancy.";
            break;
    }

    return {
        totalCapacity,
        usableCapacity,
        redundancyCapacity: totalCapacity - usableCapacity,
        efficiency: usableCapacity / totalCapacity,
        faultTolerance,
        readSpeedMultiplier,
        writeSpeedMultiplier,
        description,
    };
};

const STRIPE_COUNT = 5;

const createBlock = (type: BlockType, id: string, originalId?: string): DataBlock => ({ type, id, originalId });
const createEmptyStripe = (): DataBlock[][] => Array.from({ length: STRIPE_COUNT }, () => []);

export const generateDataDistribution = (level: RaidLevel, diskCount: number): DataBlock[][][] => {
    const distribution: DataBlock[][][] = Array.from({ length: diskCount }, () => createEmptyStripe());
    let dataId = 0;

    switch (level) {
        case RaidLevel.RAID0:
            for (let i = 0; i < STRIPE_COUNT; i++) {
                for (let d = 0; d < diskCount; d++) {
                    distribution[d][i].push(createBlock(BlockType.DATA, `${dataId++}`));
                }
            }
            break;

        case RaidLevel.RAID1:
            for (let i = 0; i < STRIPE_COUNT; i++) {
                const id = `${dataId++}`;
                for (let d = 0; d < diskCount; d++) {
                    distribution[d][i].push(createBlock(BlockType.MIRROR, `M${id}`, id));
                }
            }
            break;

        case RaidLevel.RAID4:
            for (let i = 0; i < STRIPE_COUNT; i++) {
                for (let d = 0; d < diskCount; d++) {
                    if (d === diskCount - 1) { // Dedicated parity disk
                        distribution[d][i].push(createBlock(BlockType.PARITY, `${i}`));
                    } else {
                        distribution[d][i].push(createBlock(BlockType.DATA, `${dataId++}`));
                    }
                }
            }
            break;

        case RaidLevel.RAID5:
            for (let i = 0; i < STRIPE_COUNT; i++) {
                const parityDisk = (diskCount - 1) - (i % diskCount);
                for (let d = 0; d < diskCount; d++) {
                    if (d === parityDisk) {
                        distribution[d][i].push(createBlock(BlockType.PARITY, `${i}`));
                    } else {
                        distribution[d][i].push(createBlock(BlockType.DATA, `${dataId++}`));
                    }
                }
            }
            break;

        case RaidLevel.RAID6:
            for (let i = 0; i < STRIPE_COUNT; i++) {
                const pDisk = (diskCount - 1) - (i % diskCount);
                // Q disk is one to the left of P, wrapping around
                const qDisk = (pDisk + diskCount - 1) % diskCount;
                
                for (let d = 0; d < diskCount; d++) {
                    if (d === pDisk) {
                        distribution[d][i].push(createBlock(BlockType.PARITY, `P${i}`));
                    } else if (d === qDisk) {
                        distribution[d][i].push(createBlock(BlockType.PARITY, `Q${i}`));
                    } else {
                        distribution[d][i].push(createBlock(BlockType.DATA, `${dataId++}`));
                    }
                }
            }
            break;

        case RaidLevel.RAID10:
             for (let i = 0; i < STRIPE_COUNT; i++) {
                for (let d = 0; d < diskCount; d += 2) {
                    const id = `${dataId++}`;
                    distribution[d][i].push(createBlock(BlockType.MIRROR, `M${id}`, id));
                    distribution[d+1][i].push(createBlock(BlockType.MIRROR, `M${id}`, id));
                }
            }
            break;
    }

    return distribution;
};