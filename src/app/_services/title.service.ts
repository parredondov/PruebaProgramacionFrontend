import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TitleService {
    private subject = new Subject<any>();

    setTitle(message: string) {
        this.subject.next({ text: message });
    }

    clearTitle() {
        this.subject.next();
    }

    getTitle(): Observable<any> {
        return this.subject.asObservable();
    }
}
