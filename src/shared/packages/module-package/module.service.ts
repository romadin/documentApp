import { Injectable } from '@angular/core';
import { ModuleApiResponseInterface } from './module-api-response.interface';
import { Module } from './module.model';

@Injectable()
export class ModuleService {
    private moduleCache = {};

    makeModule(data: ModuleApiResponseInterface): Module {
        if (this.moduleCache[data.id]) {
            return this.moduleCache[data.id];
        }

        const module = new Module();
        module.id = data.id;
        module.name = data.name;
        module.on = data.on;
        module.restrictions = data.restrictions;

        this.moduleCache[module.id] = module;
        return module;
    }
}
