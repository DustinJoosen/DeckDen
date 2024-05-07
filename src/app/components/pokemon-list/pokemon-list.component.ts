import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PokemonComponent} from "../pokemon/pokemon.component";
import {CommonModule} from "@angular/common";
import {Pokemon} from "../../services/data.service";

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonComponent, CommonModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})
export class PokemonListComponent {

  @Input({required: true})
  public pokemon!: Pokemon[];

  @Output()
  public onRefresh = new EventEmitter();

  refresh() {
    this.onRefresh.emit();
  }

}
