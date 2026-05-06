import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent implements OnInit, OnDestroy {
  private previousTheme: string | null = null;
  private disableIntervalId: number | null = null;
  dashboardButtonTransform = 'translate(0px, 0px)';
  loginPackTransform = 'translate(0px, 0px)';
  isDisabled = false;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    //const body = this.document.body;
    //this.previousTheme = body.getAttribute('data-theme');
    //this.renderer.setAttribute(body, 'data-theme', 'light');

    //this.disableIntervalId =
     window.setInterval(() => {
      this.isDisabled = !this.isDisabled;
    }, 2000);

  //  this.startDisableToggle();
  }

  ngOnDestroy(): void {
   // this.stopDisableToggle();
    if (this.disableIntervalId !== null) {
      clearInterval(this.disableIntervalId);
      this.disableIntervalId = null;
    }

    const body = this.document.body;
    if (this.previousTheme === null) {
      this.renderer.removeAttribute(body, 'data-theme');
      return;
    }

    this.renderer.setAttribute(body, 'data-theme', this.previousTheme);
  }

  startDisableToggle(): void {
    //this.stopDisableToggle();
    //this.disableIntervalId = 
    //window.
    setInterval(() => {
      this.isDisabled = !this.isDisabled;
    }, 2000);
  }

  stopDisableToggle(): void {
    if (this.disableIntervalId === null) return;
    clearInterval(this.disableIntervalId);
    this.disableIntervalId = null;
  }

  jitterLoginButton(): void {
    const delta = 100;
    const dx = Math.random() < 0.5 ? -delta : delta;
    const dy = Math.random() < 0.5 ? -delta : delta;
    // Sposta insieme immagine + bottone Login nella stessa direzione
    this.loginPackTransform = `translate(${dx}px, ${dy}px)`;
  }

  jitterDashboardButton(): void {
    const delta = 80;
    const dx = Math.random() < 0.5 ? -delta : delta;
    const dy = Math.random() < 0.5 ? -delta : delta;
    this.dashboardButtonTransform = `translate(${dx}px, ${dy}px)`;
  }

  goBack(): void {
    console.log('Going back');
    //this.document.defaultView?.history.back();
  }
}
