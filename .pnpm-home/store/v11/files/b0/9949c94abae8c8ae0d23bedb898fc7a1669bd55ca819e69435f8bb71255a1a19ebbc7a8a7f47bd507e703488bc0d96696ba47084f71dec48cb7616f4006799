import type { MachineJSON } from './JSON';
/**
 * The Backend `Machine` object holds information about a machine.
 */
export declare class Machine {
    readonly id: string;
    readonly name: string;
    readonly instanceId: string;
    readonly createdAt: number;
    readonly updatedAt: number;
    readonly scopedMachines: Machine[];
    readonly defaultTokenTtl: number;
    readonly secretKey?: string | undefined;
    constructor(id: string, name: string, instanceId: string, createdAt: number, updatedAt: number, scopedMachines: Machine[], defaultTokenTtl: number, secretKey?: string | undefined);
    static fromJSON(data: MachineJSON): Machine;
}
//# sourceMappingURL=Machine.d.ts.map