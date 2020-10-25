import { Project } from '../packages/project-package/project.model';
import { Organisation } from '../packages/organisation-package/organisation.model';
import { ActivatedRouteSnapshot } from '@angular/router';
import { WorkFunction } from '../packages/work-function-package/work-function.model';
import { Company } from '../packages/company-package/company.model';

export function editArray(mainArray: any[], subArray: any[], method: 'delete' | 'add' ) {
    let returnVar = null;
    mainArray.forEach((newWorkFunction: any, i: number) => {
        for (let index = 0; index < subArray.length; index++) {
            const oldProject = subArray[index];
            if (newWorkFunction.id === oldProject.id) {
                break;
            } else if (index + 1 === subArray.length) {
                method === 'add' ? returnVar = newWorkFunction : returnVar = i;
            }
        }
    });
    return returnVar;
}
type dataName = 'organisation' | 'parent' | 'project';

export function getDataFromRoute( propertyName: dataName, route: ActivatedRouteSnapshot ): Project | Organisation | WorkFunction | Company {
    let routeParent = route;
    let object: Project | Organisation | WorkFunction | Company;
    while (!object) {
        object = routeParent.data[propertyName];
        routeParent = routeParent.parent;
    }

    return object;
}
