import { Injectable } from '@angular/core';

@Injectable()
export class DocumentIconService {

    public getIconByName(documentName: string): string {
        switch ( documentName ) {
            case 'Projectgegevens':
                return 'folder';
            case 'Doelstelling':
                return 'star_border';
            case 'Proces':
                return 'trending_up';
            case 'Normen':
                return 'check_box';
            case 'Voorwaarden':
                return 'book';
            case 'BIM toepassing':
                return 'assessment';
            case 'Modeloverzicht':
                return 'remove_red_eye';
        }
    }
}
