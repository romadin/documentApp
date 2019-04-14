export function objectIsEmpty(object: any): boolean {
    for (const key in object ) {
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}
