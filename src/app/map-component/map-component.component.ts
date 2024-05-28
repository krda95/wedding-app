import { Component, OnInit, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-component',
  standalone: true,
  imports: [],
  templateUrl: './map-component.component.html',
  styleUrl: './map-component.component.scss'
})
export class MapComponentComponent implements OnInit, AfterViewInit {

  @Input() selectedItem: any;
  private map: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedItem']) {
      this.updateMap(changes['selectedItem'].currentValue);
    }
  }

  updateMap(item: any) {
    if (item) {
      this.map.setView([item.lat, item.long], 13);
    }
  }

  ngAfterViewInit(): void {
    //lat: 37.50180, long: 22.73120
    const WEDDING_LATITUDE = 37.50180;
    const WEDDING_LONGITUDE = 22.73120;
    const HOTEL_LATITUDE = 37.56610;
    const HOTEL_LONGITUDE = 22.79490;
    const INTEGRATION_LATITUDE = 37.5695801;
    const INTEGRATION_LONGITUDE = 22.8037386;
    
    this.map = L.map('map').setView([WEDDING_LATITUDE, WEDDING_LONGITUDE], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    const weddingMarker = L.icon({
      iconUrl: '/assets/Willa.png',
      iconSize: [50, 55],
      iconAnchor: [25, 55],
      popupAnchor: [0, -50]
    });

    const hotelMarker = L.icon({
      iconUrl: '/assets/Hotel.png',
      iconSize: [50, 55],
      iconAnchor: [25, 55],
      popupAnchor: [0, -50]
    });

    const integrationMarker = L.icon({
      iconUrl: '/assets/Integracja.png',
      iconSize: [50, 55],
      iconAnchor: [25, 55],
      popupAnchor: [0, -50]
    });

    L.marker([WEDDING_LATITUDE, WEDDING_LONGITUDE], { icon: weddingMarker }).addTo(this.map)
      .bindPopup('Willa weselna')
    L.marker([HOTEL_LATITUDE, HOTEL_LONGITUDE], { icon: hotelMarker }).addTo(this.map)
      .bindPopup('Hotel')
    L.marker([INTEGRATION_LATITUDE, INTEGRATION_LONGITUDE], { icon: integrationMarker }).addTo(this.map)
      .bindPopup('Integracja')

  }
  ngOnInit(): void {
  }

}
