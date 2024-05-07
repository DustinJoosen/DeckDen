import { Injectable } from '@angular/core';
import {lastValueFrom, map} from "rxjs";
import {HttpClient} from "@angular/common/http";
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

  private _apiUrl: string = 'https://pokeapi.co/api/v2/pokedex/1';
  private _baseUrl: string = 'http://localhost:3000/pokemon';
  private _key = 'deck_den_data'

  constructor(private http: HttpClient, private defaultData: DefaultDataService) {
    if (localStorage.getItem(this._key) == null) {
      let data = this.defaultData.getData();
      localStorage.setItem(this._key, JSON.stringify(data, null, 2));

      console.log('Set default data in localstorage');
    }
  }

  write(content: string) {
    localStorage.setItem(this._key, content);
  }

  async toggleObtained(dex: number) {
    // await lastValueFrom(this.http.delete<any>(this._baseUrl + '?dex=' + dex));
    let pokemon = await this.retrieve();

    let target = pokemon.find(p => p.dex === dex);
    if (target == null) {
      return;
    }

    target.obtained = !target.obtained;
    this.write(JSON.stringify(pokemon, null, 2));
  }

  async retrieve(): Promise<Pokemon[]> {
    // let json = await lastValueFrom(this.http.get<any>(this._baseUrl));
    let json = JSON.parse(localStorage.getItem(this._key) ?? '{}');
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

  // async createDefaultFile() {
  //   let allPokemon = await lastValueFrom(this.http.get<any>(this._apiUrl));
  //   allPokemon = allPokemon['pokemon_entries'].map((entry: any) => entry['pokemon_species']['name']);
  //
  //   let newPokemon: Pokemon[] = [];
  //
  //   for (let dex = 1; dex <= 1025; dex++) {
  //     let resp = await lastValueFrom(this.http.get<any>('https://pokeapi.co/api/v2/pokemon/' + dex));
  //
  //     let p = {
  //       dex: dex,
  //       name: allPokemon[dex - 1],
  //       types: resp['types'].map((t: any) => t['type']['name']),
  //       region: this.getRegion(dex),
  //       obtained: false,
  //     }
  //
  //     console.log(p);
  //     newPokemon.push(p)
  //   }
  //
  //   console.log(JSON.stringify(newPokemon, null, 2));
  // }
  // getRegion(dex: number) {
  //   if (dex <= 151) {
  //     return 'kanto';
  //   } else if (dex <= 251) {
  //     return 'johto';
  //   } else if (dex <= 386) {
  //     return 'hoenn';
  //   } else if (dex <= 493) {
  //     return 'sinnoh';
  //   } else if (dex <= 649) {
  //     return 'unova';
  //   } else if (dex <= 721) {
  //     return 'kalos';
  //   } else if (dex <= 809) {
  //     return 'alola';
  //   } else if (dex <= 898) {
  //     return 'galar';
  //   } else if (dex <= 905) {
  //     return 'hisui';
  //   } else {
  //     return 'paldea';
  //   }
  // }
}
