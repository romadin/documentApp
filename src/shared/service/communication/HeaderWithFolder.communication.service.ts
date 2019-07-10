import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface ButtonWrapper {
    show?: boolean;
    trigger?: boolean;
}

@Injectable()
export class HeaderWithFolderCommunicationService {

    private _triggerAddItem: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _triggerReadMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _addCompanyButton: BehaviorSubject<ButtonWrapper> = new BehaviorSubject<ButtonWrapper>(null);
    private _showAddUserButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _showDocumentToPdfButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _showReadModeButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _showAddItemButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _exportToPdfButton: Subject<boolean> = new Subject<boolean>();
    private _headerTitle: Subject<string> = new Subject<string>();

    get triggerAddItem(): BehaviorSubject<boolean> {
        return this._triggerAddItem;
    }

    get triggerReadMode(): BehaviorSubject<boolean> {
        return this._triggerReadMode;
    }

    get addCompanyButton(): BehaviorSubject<ButtonWrapper> {
        return this._addCompanyButton;
    }

    get showAddUserButton(): BehaviorSubject<boolean> {
        return this._showAddUserButton;
    }

    get showDocumentToPdfButton(): BehaviorSubject<boolean> {
        return this._showDocumentToPdfButton;
    }

    get exportToPdf(): Subject<boolean> {
        return this._exportToPdfButton;
    }

    get showReadModeButton(): BehaviorSubject<boolean> {
        return this._showReadModeButton;
    }

    get showAddItemButton(): BehaviorSubject<boolean> {
        return this._showAddItemButton;
    }

    get headerTitle(): Subject<string> {
        return this._headerTitle;
    }
}
