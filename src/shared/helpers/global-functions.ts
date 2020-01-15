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
