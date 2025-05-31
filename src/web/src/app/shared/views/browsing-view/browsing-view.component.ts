import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ContentDisplayComponent } from '../../components/content-display/content-display.component';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-browsing-view',
  standalone: true,
  imports: [CommonModule, ContentDisplayComponent, MapComponent],
  templateUrl: './browsing-view.component.html',
  styleUrl: './browsing-view.component.scss'
})
export class BrowsingViewComponent {
  // initial content pane width in pixels
  contentWidth = window.innerWidth * 0.7;
  // minimum widths to enforce on panes
  private minContentWidth = 800;
  private minMapWidth = 300;
  private dragging = false;
  private startX = 0;
  private startWidth = 0;

  onDragStart(event: MouseEvent) {
    this.dragging = true;
    this.startX = event.clientX;
    this.startWidth = this.contentWidth;
    event.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onDragMove(event: MouseEvent) {
    if (!this.dragging) return;
    const dx = event.clientX - this.startX;
    const rawWidth = this.startWidth + dx;
    // clamp between minContentWidth and available width minus minMapWidth
    const maxContent = window.innerWidth - this.minMapWidth;
    this.contentWidth = Math.min(
      maxContent,
      Math.max(this.minContentWidth, rawWidth)
    );
    // trigger resize for map components
    window.dispatchEvent(new Event('resize'));
    event.preventDefault();
  }

  @HostListener('window:mouseup', ['$event'])
  onDragEnd(event: MouseEvent) {
    if (!this.dragging) return;
    this.dragging = false;
    // final resize trigger
    window.dispatchEvent(new Event('resize'));
    event.preventDefault();
  }
}
