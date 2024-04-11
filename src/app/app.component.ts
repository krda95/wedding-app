import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountdownService } from '../countdown.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TimelineModule } from 'primeng/timeline';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { FirestoreService } from './firestore.service';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { KeyFilterModule } from 'primeng/keyfilter';

import { MapComponentComponent } from './map-component/map-component.component';
import { Subscription } from 'rxjs';


interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

interface MapItem {
  icon?: string;
  name?: string;
  description?: string;
  url?: string;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet
    ,TimelineModule
    ,CardModule
    ,CommonModule
    ,ReactiveFormsModule
    ,InputTextModule
    ,ButtonModule
    ,RadioButtonModule
    ,CheckboxModule
    ,InputTextareaModule
    ,KnobModule
    ,FormsModule
    ,MapComponentComponent
    ,KeyFilterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit, OnDestroy {
  title = 'wedding-app';
  events: EventItem[];
  mapItems: MapItem[];

  countdown: {days: number, hours: number, minutes: number, seconds: number} | undefined;
  safeUrl: SafeHtml;
  userForm: FormGroup;
  userCount: number = 0;
  presentCount: number = 0;
  private countSub: Subscription | undefined;
  

  constructor(private countdownService: CountdownService, private sanitizer: DomSanitizer, private firestoreService: FirestoreService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
      allergies: [''],
      menuPreference: ['any', Validators.required],
      presence: ['true'],
      message: ['']
    });

    const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/tujJhy5kvnE?si=yPVC42uo9fIEifz_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    this.safeUrl = this.sanitizer.bypassSecurityTrustHtml(embedCode);
    this.events = [
      { status: 'Poznajmy się', date: '08/05/2025', icon: 'pi pi-users', color: '#9C27B0', image: 'game-controller.jpg' },
      { status: 'Wesele', date: '09/05/2025', icon: 'pi pi-gift', color: '#673AB7' },
      // { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
      // { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
    ];

    this.mapItems = [
      { icon: '/assets/hotel-marker.png', name: 'Hotel', description: 'Nazwa hotelu', url: 'https://www.wp.pl'},
      { icon: '/assets/wedding-marker.png', name: 'Willa weselna', description: 'Adres/nazwa wilii', url: 'https://www.google.com'},
      { icon: '/assets/party-marker.png', name: 'Integracja', description: 'Adres/nazwa restauracji', url: 'https://www.google.com'},
    ]
  }
  ngOnDestroy(): void {
    
  }
  ngOnInit(): void {
    const weddingDate = new Date('2025-05-09T00:00:00');
    this.countdownService.countdownToDate(weddingDate).subscribe(countdown => {
      this.countdown = countdown;
    });

    // this.firestoreService.observeUserCount(count => {
    //   this.userCount = count;
    // });
    this.countSub = this.firestoreService.observeUserCount2().subscribe({
      next: (counts) => {
        this.userCount = counts.total;
        this.presentCount = counts.present;
      },
      error: (error) => console.error('Error observing user count:', error),
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
    this.firestoreService.addUser(
        this.userForm.value.name,
        this.userForm.value.surname,
        this.userForm.value.phoneNumber,
        this.userForm.value.allergies.split(',').map((allergy: string) => allergy.trim()),
        this.userForm.value.menuPreference,
        this.userForm.value.presence,
        this.userForm.value.message,
      ).then(() => {
        console.log('Data saved successfully');
        this.userForm.reset({
          name: '',
          surname: '',
          phoneNumber: '',
          allergies: '',
          menuPreference: 'any', // Reset to default value if you have one
          presence: 'true', // Assuming 'yes' is a default value
          message: ''
        });
      }).catch(error => {
        console.error('Error saving data: ', error);
      });
    }
  }

  
}
