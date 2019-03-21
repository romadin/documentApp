export interface ErrorMessage {
    email?: string;
    phoneNumber?: string;
}

export function isErrorMessage (arg: any): arg is ErrorMessage {
    return arg.email !== undefined ||
        arg.phoneNumber !== undefined;
}
