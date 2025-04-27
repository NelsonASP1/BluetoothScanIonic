import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonButtons,
  IonBackButton,
  IonInput,
  IonButton,
  IonIcon,
  NavController
} from '@ionic/angular/standalone';
import { BluetoothLe } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFooter,
    IonButtons,
    IonBackButton,
    IonInput,
    IonButton,
    IonIcon
  ]
})
export class ChatPage {
  device: any;
  messages: { text: string; sent: boolean }[] = [];
  newMessage = '';
  isConnected = false;

  
}