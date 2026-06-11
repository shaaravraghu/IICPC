import type { ClerkPaginationRequest } from '@clerk/shared/types';
import type { PaginatedResourceResponse } from '../resources/Deserializer';
import type { Machine } from '../resources/Machine';
import type { MachineScope } from '../resources/MachineScope';
import type { MachineSecretKey } from '../resources/MachineSecretKey';
import { AbstractAPI } from './AbstractApi';
import type { WithSign } from './util-types';
type CreateMachineParams = {
    /**
     * The name of the machine.
     */
    name: string;
    /**
     * Array of machine IDs that this machine will have access to.
     */
    scopedMachines?: string[];
    /**
     * The default time-to-live (TTL) in seconds for tokens created by this machine.
     */
    defaultTokenTtl?: number;
};
type UpdateMachineParams = {
    /**
     * The ID of the machine to update.
     */
    machineId: string;
    /**
     * The name of the machine.
     */
    name?: string;
    /**
     * The default time-to-live (TTL) in seconds for tokens created by this machine.
     */
    defaultTokenTtl?: number;
};
type GetMachineListParams = ClerkPaginationRequest<{
    /**
     * Sorts machines by name or created_at.
     * By prepending one of those values with + or -, we can choose to sort in ascending (ASC) or descending (DESC) order.
     */
    orderBy?: WithSign<'name' | 'created_at'>;
    /**
     * Returns machines that have a ID or name that matches the given query.
     */
    query?: string;
}>;
type RotateMachineSecretKeyParams = {
    /**
     * The ID of the machine to rotate the secret key for.
     */
    machineId: string;
    /**
     * The time in seconds that the previous secret key will remain valid after rotation.
     */
    previousTokenTtl: number;
};
export declare class MachineApi extends AbstractAPI {
    get(machineId: string): Promise<Machine>;
    list(queryParams?: GetMachineListParams): Promise<PaginatedResourceResponse<Machine[]>>;
    create(bodyParams: CreateMachineParams): Promise<Machine>;
    update(params: UpdateMachineParams): Promise<Machine>;
    delete(machineId: string): Promise<Machine>;
    getSecretKey(machineId: string): Promise<MachineSecretKey>;
    rotateSecretKey(params: RotateMachineSecretKeyParams): Promise<MachineSecretKey>;
    /**
     * Creates a new machine scope, allowing the specified machine to access another machine.
     *
     * @param machineId - The ID of the machine that will have access to another machine.
     * @param toMachineId - The ID of the machine that will be scoped to the current machine.
     */
    createScope(machineId: string, toMachineId: string): Promise<MachineScope>;
    /**
     * Deletes a machine scope, removing access from one machine to another.
     *
     * @param machineId - The ID of the machine that has access to another machine.
     * @param otherMachineId - The ID of the machine that is being accessed.
     */
    deleteScope(machineId: string, otherMachineId: string): Promise<MachineScope>;
}
export {};
//# sourceMappingURL=MachineApi.d.ts.map