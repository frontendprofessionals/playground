import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { VirtualFsService } from './virtual-fs.service';
import { Http } from '@angular/http';

@Directive({
  selector: '[appUpdateIframe]'
})
export class UpdateIframeDirective implements OnChanges {

  @Input('appUpdateIframe') generatedBundle;

  constructor(private iframeContainer: ElementRef,
    private fsService: VirtualFsService, private http: Http) { }

  private updateIFrame(generatedBundle) {
    const files: string[] = Object.keys(generatedBundle.fileSystem);

    for (let filename of files) {
      this.fsService.writeFile(filename, generatedBundle.fileSystem[filename].text);
    }

    const container = this.iframeContainer.nativeElement;
    while (container.hasChildNodes()) {
      container.removeChild(container.lastChild);
    }
    const iframe = document.createElement("iframe");
    iframe.src = "/assets/iframe.html";
    iframe.style.cssText = "width: 100%";
    container.appendChild(iframe);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];

      if (propName === "generatedBundle" && chng.currentValue) {
        this.updateIFrame(chng.currentValue);
      }
    }
  }

}
