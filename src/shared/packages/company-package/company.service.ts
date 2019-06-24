import { Injectable } from '@angular/core';
import { CompanyApiResponseInterface } from './company-api-response.interface';
import { Company } from './company.model';

@Injectable()
export class CompanyService {

    static makeCompany(data: CompanyApiResponseInterface): Company {
        const company = new Company();
        company.id = data.id;
        company.name = data.name;

        return company;
    }
}
