import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ContextMenuService } from '../../shared/packages/context-menu/context-menu.service';

@Component({
    selector: 'cim-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {
    @ViewChild('contextMenu') contextMenu: ElementRef;

    constructor(private contextMenuService: ContextMenuService) {

    }
    @HostListener('document:click', ['$event'])
    documentClick(event: Event): void {
        this.contextMenuService.toggleMenu.next(false);
    }

    @HostListener('document:contextmenu', ['$event'])
    documentRClick(event: Event): void {
        this.contextMenuService.toggleMenu.next(false);
    }

    ngOnInit() {
        this.contextMenuService.toggleMenu.subscribe(toggle => {
            if (this.contextMenu) {
                const position = this.contextMenuService.position;
                if (position) {
                    this.contextMenu.nativeElement.style.top = `${position.top}px`;
                    this.contextMenu.nativeElement.style.left = `${position.left}px`;
                }
                this.contextMenu.nativeElement.style.display = toggle ? 'block' : 'none';
            }
        });
    }

    onDelete(e: MouseEvent) {
        e.stopPropagation();
        this.contextMenuService.delete.next(true);
        this.contextMenuService.toggleMenu.next(false);
    }
}
