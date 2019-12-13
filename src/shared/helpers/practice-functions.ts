import { ActivatedRoute } from '@angular/router';

export function objectIsEmpty(object: any): boolean {
    for (const key in object ) {
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
export function getBreadcrumbNameProject(route: ActivatedRoute): string {
    return route.snapshot.data.project.name;
}
export function getBreadcrumbNameParent(route: ActivatedRoute): string {
    return route.snapshot.data.functionPackage.parent.name;
}
