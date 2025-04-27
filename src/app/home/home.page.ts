import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonListHeader, 
  IonLabel, 
  IonItem, 
  IonButton, 
  IonIcon, 
  IonFooter, 
  IonButtons 
} from '@ionic/angular/standalone';
import { BleClient, BluetoothLe } from '@capacitor-community/bluetooth-le';
import { AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bluetooth, stopCircle, share } from 'ionicons/icons';

const SERVICE_UUID = '0000fff0-0000-1000-8000-00805f9b34fb';
const TX_CHARACTERISTIC_UUID = '0000fff1-0000-1000-8000-00805f9b34fb';
const RX_CHARACTERISTIC_UUID = '0000fff2-0000-1000-8000-00805f9b34fb';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonButton,
    IonIcon,
    IonFooter,
    IonButtons
  ]
})
export class HomePage {
  pairedDevices: any[] = [];
  scannedDevices: any[] = [];
  isScanning = false;

  constructor(private alertController: AlertController) {
    addIcons({ bluetooth, stopCircle, share });
    this.initializeBluetooth();
  }

  async initializeBluetooth() {
    try {
      await BleClient.initialize();
      this.loadPairedDevices();
    } catch (error) {
      this.showAlert('Error de Bluetooth', 'Falló la inicialización de Bluetooth');
      console.error(error);
    }
  }

  async loadPairedDevices() {
    try {
      const result = await BluetoothLe.getBondedDevices();
      this.pairedDevices = result.devices.map((device: any) => ({
        name: device.name
      }));
    } catch (error) {
      console.error('Error cargando dispositivos emparejados:', error);
    }
  }

  async enableBluetooth() {
    try {
      await BleClient.requestEnable();
      this.startScan();
    } catch (error) {
      this.showAlert('Error de Bluetooth', 'Por favor active Bluetooth para continuar');
    }
  }

  async startScan() {
    if (this.isScanning) return;
    
    this.isScanning = true;
    this.scannedDevices = [];
    
    try {
      await BleClient.requestLEScan({}, (result) => {
        if (result.localName || result.serviceData) {
          const existingIndex = this.scannedDevices.findIndex(
            d => d.address === result.serviceData
          );
          
          if (existingIndex === -1) {
            this.scannedDevices.push({
              name: result.localName || 'N/N',
              address: result.serviceData
            });
          }
        }
      });
      
      setTimeout(() => this.stopScan(), 20000);
    } catch (error) {
      this.isScanning = false;
      this.showAlert('Error de Escaneo', 'Fallo al iniciar el escaneo');
      console.error(error);
    }
  }

  async stopScan() {
    if (!this.isScanning) return;
    
    try {
      await BleClient.stopLEScan();
      this.isScanning = false;
    } catch (error) {
      console.error('Error deteniendo el escaneo:', error);
    }
  }

  async startServer() {
    try {
      this.showAlert('Servidor', 'Servidor activo');
    } catch (error) {
      this.showAlert('Error del Servidor', 'Fallo al iniciar el servidor');
      console.error(error);
    }
  }

  async pairDevice(device: any) {
    try {
      this.showAlert('Emparejando', `Intentando emparejar con ${device.name || device.address}`);
      this.loadPairedDevices();
    } catch (error) {
      this.showAlert('Error de Emparejamiento', 'Fallo al emparejar con el dispositivo');
      console.error(error);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    
    await alert.present();
  }

  async scanAndConnect() {
    try {
      await BleClient.initialize();
      
    
      const device = await BleClient.requestDevice({
        services: [SERVICE_UUID], 
        name: 'Services'
      });
  
      
      await BleClient.connect(device.deviceId, () => {
        this.isScanning = false;
        this.showAlert('Dispositivo desconectado', 'La conexión se ha perdido');
      });
  
      const result = await BluetoothLe.getBondedDevices();
      this.isScanning = true;
      
      
      await BleClient.startNotifications(
        device.deviceId,
        SERVICE_UUID,
        RX_CHARACTERISTIC_UUID,
        (value) => this.handleReceivedData(value)
      );
  
      this.showAlert('Conexión exitosa', `Conectado a ${device.name}`);
      
    } catch (error) {
      this.showAlert('Error', 'No se pudo conectar al dispositivo: ' + error);
      console.error('Error de conexión:', error);
    }
  }

  handleReceivedData(value: DataView) {
   
  }
}