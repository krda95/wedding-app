import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountdownService } from '../countdown.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { AbstractControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FirestoreService } from './firestore.service';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


import { MapComponentComponent } from './map-component/map-component.component';
import { Subscription } from 'rxjs';
import { InvitationComponent } from './invitation/invitation.component';


interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
  text?: string;
}

interface MapItem {
  icon?: string;
  name?: string;
  description?: string;
  url?: string;
  lat: number;
  long: number;
  extension?: string;
  address?: string;
  google?: string;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
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
    ,ConfirmDialogModule
    ,ToastModule
    ,InvitationComponent
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit, OnDestroy {
  title = 'wedding-app';
  events: EventItem[];
  mapItems: MapItem[];
  selectedLocation = new EventEmitter<any>();
  public screenWidth = 1000;
  desktopImg = "assets/desktop-wedding.png"
  mobileImg = "assets/mobile-wedding.png"
  
  countdown: {difference: number, days: number, hours: number, minutes: number, seconds: number} | undefined;
  safeUrl: SafeHtml;
  userForm: FormGroup;
  userCount: number = 0;
  presentCount: number = 0;
  private countSub: Subscription | undefined;
  public timelineAlign: string = 'alternate';
  public imgWidth: number = 400;
  

  constructor(private countdownService: CountdownService, private sanitizer: DomSanitizer, private firestoreService: FirestoreService, private fb: FormBuilder, private renderer: Renderer2, private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.updateTimelineAlign()
    this.userForm = this.fb.group({
      name: ['', [this.customRequired, Validators.minLength(3)]],
      surname: ['', [this.customRequired, Validators.minLength(3)]],
      phoneNumber: ['', [this.customRequired, this.phoneNumberLength]],
      allergies: [''],
      menuPreference: ['any', Validators.required],
      presence: ['true'],
      message: ['']
    });

    const embedCode = `<iframe class="iframe" src="https://www.youtube.com/embed/yMYLQTDwv2M?si=iCjjlL6OTtteXgpp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
    this.safeUrl = this.sanitizer.bypassSecurityTrustHtml(embedCode);
    this.events = [
      { status: 'Zameldowanie w hotelu', date: '08/05/2025 14:00', icon: 'hotel', color: '#0047AB', image: 'reception.png', text: "Gotowi na niezapomniane chwile - zameldowanie na recepcji!" },
      { status: 'Poznajmy się', date: '08/05/2025 18:00', icon: 'liquor', color: '#0047AB', image: 'fun.png', text: "Dla tych którzy jeszcze się nie poznali będzie to okazja na integrację, a Ci którzy już się znają będą mogli po prostu napić się wina w dobrym towarzystwie." },
      { status: 'Ceremonia & Wesele', date: '09/05/2025 17:00', icon: 'nightlife', color: '#0047AB', image: 'wedding.png', text: "Zarówno Ślub jak i Wesele odbędą się w Villi Merika. O godzinie i transporcie jeszcze Was poinformujemy." },
      { status: 'Śniadanie', date: '10/05/2025 10:00', icon: 'restaurant', color: '#0047AB', image: 'breakfast.png', text: "Śniadanie to najważniejszy posiłek dnia, wiec nie zapomnijcie o nim. Tym bardziej po zbyt dużej ilości wina ;)" },
      { status: 'Check out', date: '10/05/2025 12:00', icon: 'waving_hand', color: '#0047AB', image: 'bye.png', text: "Pożegnanie z uśmiechem - podziękowania za wspólnie spędzony, magiczny czas!" },
    ];

    this.mapItems = [
      { icon: 'assets/willa.png', name: 'Villa weselna', description: 'Villa Merika', address: 'Epar.Od. Kiveriou - Astrous, Kato Vervena 220 01', google:'https://www.google.com/maps/place//data=!4m2!3m1!1s0x149fe6de46520389:0x96700dcb2db88ac2?sa=X&ved=1t:8290&ictx=111', url: 'https://villamerika.gr/', lat: 37.50180, long: 22.73120},
      { icon: 'assets/hotel.png', name: 'Hotel', description: 'Nafplio Hotel Ippoliti', url: 'https://www.ippoliti.gr/', lat: 37.56610, long: 22.79490 , address: 'Ilia Miniati 9, Nafplio', google: 'https://www.google.com/maps/place/Hotel+Ippoliti/@37.5663875,22.7926116,17z/data=!3m1!4b1!4m9!3m8!1s0x149ffa96517745fd:0x60e09df80cd1b9c6!5m2!4m1!1i2!8m2!3d37.5663833!4d22.7951865!16s%2Fg%2F1vf_2x3p?entry=ttu'},
      { icon: 'assets/integracja.png', name: 'Integracja', extension: '"Poznajmy się"', description: 'Szczegóły wkrótce...', lat: 37.5695801, long: 22.8037386},
      { icon: 'assets/lotnisko.png', name: 'Lotnisko', description: 'Port Lotniczy Ateny', url: 'https://www.aia.gr/traveler/', address: 'Attiki Odos, Spata 190 04', google:'https://www.google.pl/maps/place/Port+lotniczy+Ateny/@37.9362142,23.945476,17z/data=!3m1!4b1!4m6!3m5!1s0x14a1901ad9e75c61:0x38b215df0aeeb3aa!8m2!3d37.9362142!4d23.9480509!16zL20vMGQyMHM?entry=ttu', lat: 37.9350, long: 23.9495},
    ]
  }
  ngOnDestroy(): void { }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateTimelineAlign();
  }

  updateTimelineAlign() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 500) {
      this.timelineAlign = 'left';
    } else {
      this.timelineAlign = 'alternate';
    }
  }

  private customRequired(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value.trim() === '') {
      return { required: true };
    }
    return null;
  }
  
  private phoneNumberLength(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value.length < 9) {
      return { minLength: { requiredLength: 9, actualLength: value.length } };
    }
    return null;
  }

  onItemSelect(item: any) {
    this.selectedLocation.emit(item);
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const section = this.renderer.selectRootElement(`#${sectionId}`, true);
    section.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit(): void {
    const weddingDate = new Date('2025-05-09T18:00:00');
    this.countdownService.countdownToDate(weddingDate).subscribe(countdown => {
      this.countdown = countdown;
      if(this.countdown!.difference <= 0) {
        this.userForm.disable();
      }
    });

    this.countSub = this.firestoreService.observeUserCount2().subscribe({
      next: (counts) => {
        this.userCount = counts.total;
        this.presentCount = counts.present;
      },
      error: (error) => console.error('Error observing user count:', error),
    });
  }

  confirm() {
    this.confirmationService.confirm({
      message: 'Czy na pewno chcesz wysłać zgłoszenie?',
      header: 'Potwierdzenie',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      rejectButtonStyleClass: 'secondary-button',
      accept: () => {
        this.onSubmit()
      },
      reject: () => { 
      }
    });
  }

  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Super!', detail: 'Para młoda potwierdzi jeszcze Waszą obecność telefonicznie 🥳', life: 10000});
  }

  showFailure(error?: string) {
    this.messageService.add({severity:'danger', summary: error ? 'Coś poszło nie tak...' : 'Oj...', detail: error ?? 'Bardzo nam przykro. Szkoda, że Cię nie będzie.', life: 5000});
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
        if(this.userForm.value.presence === 'true') {
          this.showSuccess()
        } else {

          this.showFailure()
        }
        this.userForm.reset({
          name: '',
          surname: '',
          phoneNumber: '',
          allergies: '',
          menuPreference: 'any',
          presence: 'true',
          message: ''
        });
      }).catch(error => {
        this.showFailure(error);
        console.error('Error saving data: ', error);
      });
    }
  }

  
}
