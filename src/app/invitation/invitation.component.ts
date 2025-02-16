import { Component } from '@angular/core';

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.scss'
})
export class InvitationComponent {

  public navigate() {
    window.open('https://www.icloud.com/invites/003quRBEGYvqnVRlp9KGg2cmw', '_blank');
  }

}
