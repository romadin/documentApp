import { Component, OnInit } from '@angular/core';
import { FolderService } from '../../../shared/packages/folder-package/folder.service';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';

@Component({
  selector: 'cim-corporate-identity',
  templateUrl: './corporate-identity.component.html',
  styleUrls: ['./corporate-identity.component.css']
})
export class CorporateIdentityComponent implements OnInit {

  constructor(private foldersService: FolderService, private workFunctionService: WorkFunctionService) { }

  ngOnInit() {
      this.foldersService.getFoldersByWorkFunctionId(11).subscribe(value => {
          console.log(value);
      });
  }

}
