import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JsonPipe, NgIf, NgOptimizedImage, TitleCasePipe} from "@angular/common";
import {DataService, Pokemon} from "../../services/data.service";

@Component({
  selector: 'app-pokemon',
  standalone: true,
    imports: [
        TitleCasePipe,
        NgOptimizedImage,
        NgIf,
        JsonPipe
    ],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})
export class PokemonComponent {

  @Input({required: true})
  public data!: Pokemon;

  @Output()
  public onRefresh = new EventEmitter();

  constructor(private dataService: DataService) { }

  async toggleObtained() {
    await this.dataService.toggleObtained(this.data.dex);
    await this.onRefresh.emit()
  }

  get imageUrl() {
    return '../../../assets/images/pokemon/' + this.data.dex + '.png';
    // return '../../../assets/images/pokemon/393.png';
  }

}
