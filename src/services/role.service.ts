/**
 * ProfileIQ — Target Role Service
 *
 * API-ready service layer for listing and fetching target career roles.
 */

import { TargetRole } from '../types';
import { MOCK_ROLES } from '../mocks/roles.mock';

export class RoleService {
  static async getTargetRoles(): Promise<TargetRole[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return MOCK_ROLES;
  }

  static async getRoleById(roleId: string): Promise<TargetRole | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const role = MOCK_ROLES.find((r) => r.id === roleId);
    return role || null;
  }
}
