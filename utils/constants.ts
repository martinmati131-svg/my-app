
import { RaidLevel } from '../types';

export const MIN_DISKS = 2;
export const MAX_DISKS = 16;

export const RAID_CONFIGS: { [key in RaidLevel]: { minDisks: number; step?: number } } = {
    [RaidLevel.RAID0]: { minDisks: 2 },
    [RaidLevel.RAID1]: { minDisks: 2, step: 2 },
    [RaidLevel.RAID4]: { minDisks: 3 },
    [RaidLevel.RAID5]: { minDisks: 3 },
    [RaidLevel.RAID6]: { minDisks: 4 },
    [RaidLevel.RAID10]: { minDisks: 4, step: 2 },
};
