import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  accountsCache = new Map();

  constructor() { }


}
