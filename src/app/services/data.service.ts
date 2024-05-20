import { Injectable } from '@angular/core';
import {lastValueFrom, map} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DefaultDataService} from "./default-data.service";

export interface Pokemon {
  dex: number,
  name: string,
  obtained: boolean,
  types: string[],
  region: string,
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _baseUrl: string = 'https://quickserve-syter6.azurewebsites.net';
  private _appUuid: string = '7c8613b8-3fa7-42d4-964a-bd7097779e71';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private defaultData: DefaultDataService) {
  }

  async write(content: string) {
    let uri = this._baseUrl + '/data/' + this._appUuid;
    await lastValueFrom(this.http.put(uri, JSON.stringify(content), this.httpOptions));
  }

  async toggleObtained(dex: number) {
    let pokemon = await this.retrieve();

    let target = pokemon.find(p => p.dex === dex);
    if (target == null) {
      return;
    }

    target.obtained = !target.obtained;
    await this.write(JSON.stringify(pokemon, null, 2));
  }

  async retrieve(): Promise<Pokemon[]> {
    let uri = this._baseUrl + '/data/' + this._appUuid

    let json;
    try {
      let content = JSON.stringify(await lastValueFrom(this.http.get(uri)));
      json = JSON.parse(content);
    } catch {
      await this.write(JSON.stringify(this.defaultData.getData()));
      return this.retrieve();
    }

    return json.map((item: any) => {
      return {
        dex: item.dex,
        name: item.name,
        obtained: item.obtained,
        types: item.types,
        region: item.region,
      } as Pokemon
    });
  }

}
