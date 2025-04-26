import { Component, OnInit, AfterViewInit, Input, SimpleChanges } from '@angular/core';
// import * as L from 'leaflet';
declare var L:any;
import 'leaflet';
import 'leaflet-routing-machine';

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
    const WEDDING_LATITUDE = 37.50180;
    const WEDDING_LONGITUDE = 22.73120;
    const HOTEL_LATITUDE = 37.56610;
    const HOTEL_LONGITUDE = 22.79490;
    const INTEGRATION_LATITUDE = 37.567200;
    const INTEGRATION_LONGITUDE = 22.798483;
    const AIRPORT_LATITUDE = 37.9350;
    const AIRPORT_LONGITUDE = 23.9495;
    
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

    const airportIcon = L.icon({
      iconUrl: 'assets/lotnisko-color.png',
      iconSize: [50, 55],
      iconAnchor: [25, 55],
      popupAnchor: [0, -50]
    });

    

    const weddingMarker = L.marker([WEDDING_LATITUDE, WEDDING_LONGITUDE], { icon: weddingIcon }).addTo(this.map)
      .bindPopup('Villa weselna')
    const hotelMarker = L.marker([HOTEL_LATITUDE, HOTEL_LONGITUDE], { icon: hotelIcon }).addTo(this.map)
      .bindPopup('Hotel')
    const integrationMarker = L.marker([INTEGRATION_LATITUDE, INTEGRATION_LONGITUDE], { icon: integrationIcon }).addTo(this.map)
      .bindPopup('Integracja')
    const airportMarker = L.marker([AIRPORT_LATITUDE, AIRPORT_LONGITUDE], { icon: airportIcon }).addTo(this.map)
      .bindPopup('Lotnisko')

      this.markers = [weddingMarker, hotelMarker, integrationMarker, airportMarker]
      this.fitBoundsToMarkers()

      L.Routing.control({
        waypoints: [
          L.latLng(AIRPORT_LATITUDE, AIRPORT_LONGITUDE),
          L.latLng(HOTEL_LATITUDE, HOTEL_LONGITUDE)
        ],
        createMarker: () => null,
        addWaypoints: false,
        routeWhileDragging: false,
        draggableWaypoints: false,
        show: false,
        fitSelectedRoutes: false,
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        routeLine: function(route: any) {
          const line = L.Routing.line(route, {
            addWaypoints: false,
            extendToWaypoints: false,
            missingRouteTolerance: 0,
            styles: [{ color: '#2196F3', weight: 3 }]
          });

          line.getLayers().forEach((layer: any) => {
            if (layer instanceof L.Polyline) {
              layer.on('mouseover', function(e: any) {
                layer.bindTooltip('Trasa z lotniska do hotelu ≈ 2h', {
                  permanent: false,
                  direction: 'top'
                }).openTooltip(e.latlng);
              });
              layer.on('mousemove', function(e: any) {
                layer.openTooltip(e.latlng);
              });
              layer.on('mouseout', function() {
                layer.closeTooltip();
              });
            }
          });

          return line;
        }
      }).addTo(this.map);

      L.Routing.control({
        waypoints: [
          L.latLng(HOTEL_LATITUDE, HOTEL_LONGITUDE),
          L.latLng(WEDDING_LATITUDE, WEDDING_LONGITUDE)
        ],
        createMarker: () => null,
        addWaypoints: false,
        routeWhileDragging: false,
        draggableWaypoints: false,
        show: false,
        fitSelectedRoutes: false,
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        routeLine: function(route: any) {
          const line = L.Routing.line(route, {
            addWaypoints: false,
            extendToWaypoints: false,
            missingRouteTolerance: 0,
            styles: [{ color: '#FF3B30', weight: 3 }]
          });

          line.getLayers().forEach((layer: any) => {
            if (layer instanceof L.Polyline) {
              layer.on('mouseover', function(e: any) {
                layer.bindTooltip('Trasa z hotelu do willi ≈ 10 min.', {
                  permanent: false,
                  direction: 'top'
                }).openTooltip(e.latlng);
              });
              layer.on('mousemove', function(e: any) {
                layer.openTooltip(e.latlng);
              });
              layer.on('mouseout', function() {
                layer.closeTooltip();
              });
            }
          });

          return line;
        }
      }).addTo(this.map);

      setTimeout(() => {
        document.querySelectorAll('.leaflet-routing-container, .leaflet-routing-alternatives-container')
          .forEach(el => el.remove());
      }, 0);

  }
  ngOnInit(): void {
  }

}
