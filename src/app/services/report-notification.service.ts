import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class ReportNotificationService {
    private hubConnection: signalR.HubConnection;
    private connectionPromise: Promise<void>;

    reportPronto$ = new Subject<{ tipo: string; nome?: string; anno?: number; messaggio: string }>();

    constructor(private authService: AuthService) {
        
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5143/HubReport/ReportHub', {
                accessTokenFactory: () => this.authService.getToken() ?? ''
            })
            .withAutomaticReconnect()
            .build();

        console.log('[SignalR] Avvio connessione a:', 'http://localhost:5143/HubReport/ReportHub');

        // salva la promise della connessione — la useremo in uniscitiAlGruppo
        this.connectionPromise = this.hubConnection.start()
            .then(() => console.log('[SignalR] Connesso con successo, stato:', this.hubConnection.state))
            .catch((err: unknown) => console.error('[SignalR] Errore connessione:', err));

        this.hubConnection.onreconnecting((err: unknown) => console.warn('[SignalR] Riconnessione in corso...', err));
        this.hubConnection.onreconnected((id: string | undefined) => console.log('[SignalR] Riconnesso, connectionId:', id));
        this.hubConnection.onclose((err: unknown) => console.error('[SignalR] Connessione chiusa:', err));

        this.hubConnection.on('ReportPronto', (message: { tipo: string; nome?: string; anno?: number; messaggio: string }) => {
            console.log('[SignalR] Messaggio ricevuto:', message);
            this.reportPronto$.next(message);
        });
    }

    getConnectionId(): string | null {
        return this.hubConnection.connectionId;
    }

    uniscitiAlGruppoUtente(): void {
        this.connectionPromise
            .then(() => this.hubConnection.invoke('UniscitiAlGruppo'))
            .then(() => console.log('[SignalR] Unito al gruppo'))
            .catch((err: unknown) => console.error('[SignalR] Errore join gruppo:', err));
    }

    ngOnDestroy() {
        this.hubConnection.stop().then(() => console.log('SignalR Disconnected'));
    }
}
