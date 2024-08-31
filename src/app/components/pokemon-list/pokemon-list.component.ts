import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PokemonComponent} from "../pokemon/pokemon.component";
import {CommonModule} from "@angular/common";
import {Pokemon} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";

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
  public onAfterTogglingMon = new EventEmitter();

  @Output()
  public onResetFilter = new EventEmitter();

  @Output()
  public onRefresh = new EventEmitter();

  refresh() {
    this.onRefresh.emit();
  }

  afterToggle() {
    this.onAfterTogglingMon.emit();
  }


  jumpHere() {
    let dex = this.pokemon[0].dex;
    this.onResetFilter.emit();

    setTimeout(() => {
      let element = document.getElementById(dex.toString());
      if (!element)
        return;

      window.scrollTo({
        top: element.offsetTop,
      });
    }, 1000);
  }
}
