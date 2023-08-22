import { Component } from '@angular/core';

import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { SignalrService } from './services/signalr.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ngrx-chat';

  userNameFormControl = new FormControl('');

  constructor(private modalService: NgbModal, private signalRService: SignalrService) {}
  
  open(content: any) {
		this.modalService.open(content)
	}

  ngOnInit() {
    document.getElementById('open-modal-btn')?.click();
  }

  startConnection(modal: any) {
    modal.close();
    const userName = this.userNameFormControl.value;
    this.signalRService.connect(userName)
  }
}
