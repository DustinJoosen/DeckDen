import {Component, HostListener, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PokemonComponent} from "./components/pokemon/pokemon.component";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {PokemonListComponent} from "./components/pokemon-list/pokemon-list.component";
import {DataService, Pokemon} from "./services/data.service";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

interface Filter {
  searchText?: string;
  hasObtained?: string;
  type?: string | null;
  region?: string | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PokemonComponent, CommonModule, FormsModule, PokemonListComponent, MatIcon, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  public pokemon: Pokemon[] = [];

  public totalAmount!: number;
  public totalObtained!: number;

  public searchOpened = false;
  public obtainedOpened = false;
  public typeOpened = false;
  public locationOpened = false;

  public filter: Filter = {
    // searchText: 'pipl'
    // region: 'kanto'
  }

  areThereAnyFilters(): boolean {
    return !!(
      this.filter.searchText ||
      this.filter.hasObtained ||
      this.filter.type ||
      this.filter.region
    );
  }

  @HostListener("window:keydown", ["$event"])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'F' || event.key === 'f') {
      if (this.searchOpened) {
        return;
      }
      event.preventDefault();
      this.toggleSearch();
    }
    if (event.key === 'Escape') {
      this.closeAll();
    }
  }

  constructor(private data: DataService) { }

  async ngOnInit() {
    console.log(this.areThereAnyFilters());
    await this.refresh();

  }

  async refresh() {
    this.pokemon = this.applyFilter(await this.data.retrieve());

    this.totalAmount = this.pokemon.length;
    this.totalObtained = this.pokemon.filter(p => p.obtained).length;
  }

  applyFilter(pokemon: Pokemon[]): Pokemon[] {
    // Filter the search text.
    if (this.filter.searchText != null) {
      pokemon = pokemon.filter(pok =>
        pok.name.toLowerCase().includes(this.filter.searchText?.toLowerCase() ?? '') ||
        pok.dex == parseInt(this.filter?.searchText ?? '-1')
      );
    }

    // Filter the obtained-unobtained.
    if (this.filter.hasObtained != null) {
      pokemon = pokemon.filter(pok => {
        if (this.filter.hasObtained == 'OBTAINED') {
          return pok.obtained;
        } else if (this.filter.hasObtained == 'UNOBTAINED') {
          return !pok.obtained;
        } else {
          return true;
        }
      })
    }

    // Filter the type.
    if (this.filter.type != null) {
      pokemon = pokemon.filter(pok => {
        return pok.types.includes(this.filter.type?.toLowerCase() ?? '-');
      })
    }

    // Filter the region.
    if (this.filter.region !+ null) {
      pokemon = pokemon.filter(pok => {
        return pok.region == this.filter.region;
      })
    }

    return pokemon;
  }

  closeAll() {
    this.obtainedOpened = false;
    this.locationOpened = false;
    this.typeOpened = false;
    this.searchOpened = false;
  }

  toggleSearch() {
    let searchOpened = this.searchOpened;
    this.closeAll();

    this.searchOpened = !searchOpened;
    this.focusSearch();
  }

  focusSearch() {
    if (this.searchOpened) {
      let inp = document.getElementById('search_bar_input');
      if (inp == null)
        return;

      inp.focus();
    }
  }

  toggleObtained() {
    let obtainedOpened = this.obtainedOpened;
    this.closeAll();
    this.obtainedOpened = !obtainedOpened;
  }

  toggleTypes() {
    let typeOpened = this.typeOpened;
    this.closeAll();
    this.typeOpened = !typeOpened;
  }

  toggleLocations() {
    let locationOpened = this.locationOpened;
    this.closeAll();
    this.locationOpened = !locationOpened;
  }

  async setObtainedFilter(type: string) {
    this.filter.hasObtained = type;
    this.obtainedOpened = false;
    await this.refresh();
  }

  async setType(type: string) {
    if (this.filter.type == type) {
      this.filter.type = null;
    } else {
      this.filter.type = type;
    }

    await this.refresh();
  }

  async setRegion(region: string) {
    if (this.filter.region == region) {
      this.filter.region = null;
    } else {
      this.filter.region = region;
    }

    await this.refresh();
  }

  async reset() {
    this.filter = {}
    this.closeAll();
    await this.refresh();
  }

}
