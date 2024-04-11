import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-component',
  standalone: true,
  imports: [],
  templateUrl: './map-component.component.html',
  styleUrl: './map-component.component.scss'
})
export class MapComponentComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    const WEDDING_LATITUDE = 37.595678;
    const WEDDING_LONGITUDE = 22.7618501;
    const HOTEL_LATITUDE = 37.576533;
    const HOTEL_LONGITUDE = 22.8000101;
    const INTEGRATION_LATITUDE = 37.5695801;
    const INTEGRATION_LONGITUDE = 22.8037386;
    
    const map = L.map('map').setView([WEDDING_LATITUDE, WEDDING_LONGITUDE], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    const weddingMarker = L.icon({
      iconUrl: '/assets/wedding-marker.png', // The URL to your marker image
      iconSize: [50, 55], // Size of the icon
      iconAnchor: [22, 94], // Point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76] // Point from which the popup should open relative to the iconAnchor
    });

    const hotelMarker = L.icon({
      iconUrl: '/assets/hotel-marker.png', // The URL to your marker image
      iconSize: [50, 55], // Size of the icon
      iconAnchor: [22, 94], // Point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76] // Point from which the popup should open relative to the iconAnchor
    });

    const integrationMarker = L.icon({
      iconUrl: '/assets/party-marker.png', // The URL to your marker image
      iconSize: [50, 55], // Size of the icon
      iconAnchor: [22, 94], // Point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76]
    });

    L.marker([WEDDING_LATITUDE, WEDDING_LONGITUDE], { icon: weddingMarker }).addTo(map)
      .bindPopup('Miejsce ślubu')
    L.marker([HOTEL_LATITUDE, HOTEL_LONGITUDE], { icon: hotelMarker }).addTo(map)
      .bindPopup('Hotel')
    L.marker([INTEGRATION_LATITUDE, INTEGRATION_LONGITUDE], { icon: integrationMarker }).addTo(map)
      .bindPopup('Integracja')

  }
  ngOnInit(): void {
  }

}
