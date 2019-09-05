import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Chapter } from '../packages/chapter-package/chapter.model';
import { WorkFunction } from '../packages/work-function-package/work-function.model';

import { ApiService } from './api.service';

export type CacheItemBaseName = 'cacheChaptersWorkFunction' | 'cacheChapter';

export interface CacheItem {
    id: number;
    hash: string;
    items?: any[];
}

interface CacheParent {
    [id: number]: CacheItem;
}
interface CacheContainer {
    [name: string]: CacheItem | CacheParent;
}

export interface CacheGetParam {
    name?: string;
    url?: string;
    options?: any;
    hash?: string;
    parent?: Chapter | WorkFunction;
}

@Injectable()
export class CacheService {
    cacheContainer: CacheContainer = {};
    private path = '/cache';

    constructor(private apiService: ApiService) {  }

    get(cacheItemName: string, path: string, param: any, parent?: number): Observable<any> {
        let cacheItem;
        if (parent && this.cacheContainer[cacheItemName]) {
            cacheItem = this.cacheContainer[cacheItemName][parent];
        } else {
            cacheItem = this.cacheContainer[cacheItemName];
        }

        if (cacheItem) {
            return this.checkCacheHash(cacheItem).pipe(
                mergeMap( (hasSameHash) => {
                    return hasSameHash ? of(cacheItem.items) : this.apiService.get(path, param);
                })
            );
        }

        const getParam: CacheGetParam = {
            name: cacheItemName,
            url: path,
        };
        return this.getCacheItem(getParam).pipe(
            mergeMap((cachedItem: CacheItem) =>  {
                if (!this.cacheContainer) {
                    this.cacheContainer = {};
                }
                if (parent) {
                    if (!this.cacheContainer[cacheItemName]) {
                        this.cacheContainer[cacheItemName] = {};
                    }
                    this.cacheContainer[cacheItemName][parent] = cachedItem;
                } else {
                    this.cacheContainer[cacheItemName] = cachedItem;
                }
                return this.apiService.get(path, param);
            }),
        );
    }

    post(path: string, body: any, params: any, cacheItem: CacheItem | CacheGetParam): Observable<any> {
        if (cacheItem.hasOwnProperty('id')) {
            return this.updateCacheHash((<CacheItem>cacheItem).id).pipe(
                mergeMap(v => this.apiService.post(path, body, params))
            );
        }
        return this.getCacheItem(<CacheGetParam>cacheItem).pipe(
            mergeMap((cachedItem: CacheItem) =>  {
                cacheItem = <CacheGetParam>cacheItem;
                if (!this.cacheContainer) {
                    this.cacheContainer = {};
                }
                if (cacheItem.parent) {
                    if (!this.cacheContainer[cacheItem.name]) {
                        this.cacheContainer[cacheItem.name] = {};
                    }
                    this.cacheContainer[cacheItem.name][cacheItem.parent.id] = cachedItem;

                } else {
                    this.cacheContainer[cacheItem.name] = cachedItem;
                }
                return this.apiService.post(path, body, params);
            }),
        );
    }

    delete(path: string, params: any): Observable<any> {
        return this.apiService.delete(path, params);
    }

    getCacheItem(body: CacheGetParam): Observable<CacheItem> {
        return this.apiService.get(this.path, body).pipe(
            map(result => {
                return <CacheItem>{
                    id: result.id,
                    hash: result.hash,
                };
            })
        );
    }

    private checkCacheHash(cacheItem: CacheItem): Observable<boolean> {
        const param: CacheGetParam = { hash: cacheItem.hash };
        return this.apiService.get(this.path + '/' + cacheItem.id, param).pipe(
            map(result => result.sameHash )
        );
    }



    private updateCacheHash(cacheId: number) {
        return this.apiService.post(this.path + '/' + cacheId, {}).pipe(
            map(result => {
                return <CacheItem>{
                    id: result.id,
                    hash: result.hash,
                };
            })
        );
    }
}
