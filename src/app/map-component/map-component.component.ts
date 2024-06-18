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
  markers: any;

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

  private fitBoundsToMarkers(): void {
    if (this.markers.length === 0) return;

    const group = L.featureGroup(this.markers);
    this.map.fitBounds(group.getBounds());
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

    const weddingIcon = L.icon({
      iconUrl: 'assets/willa-color.png',
      iconSize: [50, 55],
      iconAnchor: [25, 55],
      popupAnchor: [0, -50]
    });

    const hotelIcon = L.icon({
      iconUrl: 'assets/hotel-color.png',
      iconSize: [50, 55],
      iconAnchor: [25, 55],
      popupAnchor: [0, -50]
    });

    const integrationIcon = L.icon({
      iconUrl: 'assets/integracja-color.png',
      iconSize: [50, 55],
      iconAnchor: [25, 55],
      popupAnchor: [0, -50]
    });

    

    const weddingMarker = L.marker([WEDDING_LATITUDE, WEDDING_LONGITUDE], { icon: weddingIcon }).addTo(this.map)
      .bindPopup('Willa weselna')
    const hotelMarker = L.marker([HOTEL_LATITUDE, HOTEL_LONGITUDE], { icon: hotelIcon }).addTo(this.map)
      .bindPopup('Hotel')
    const integrationMarker = L.marker([INTEGRATION_LATITUDE, INTEGRATION_LONGITUDE], { icon: integrationIcon }).addTo(this.map)
      .bindPopup('Integracja')

      this.markers = [weddingMarker, hotelMarker, integrationMarker]
      this.fitBoundsToMarkers()

  }
  ngOnInit(): void {
  }

}
