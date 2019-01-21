import { Injectable } from '@angular/core';
import { Role } from './role.model';
import { ApiService } from '../../service/api.service';

interface RoleCache {
    [id: number]: Role;
}
@Injectable()
export class RoleService {
    private roleCache: RoleCache = {};

    constructor(private apiService: ApiService) {
        //
    }

    public getRoleById(id: number): Promise<Role> {
        if (this.roleCache[id]) {
            return Promise.resolve(this.roleCache[id]);
        }
        return new Promise<Role>((resolve) => {
            this.apiService.get('/roles/' + id, {}).subscribe((value) => {
                resolve(this.makeRole(value));
            });
        });
    }

    public makeRole(value): Role {
        const role = new Role();
        role.setId(value.id);
        role.setName(value.name);

        this.roleCache[role.getId()] = role;
        return role;
    }
}
