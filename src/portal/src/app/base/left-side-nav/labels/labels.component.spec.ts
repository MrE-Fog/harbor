import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsComponent } from './labels.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '../../../shared/shared.module';

describe('LabelsComponent', () => {
    let component: LabelsComponent;
    let fixture: ComponentFixture<LabelsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedTestingModule,
                BrowserAnimationsModule,
                ClarityModule,
            ],
            declarations: [LabelsComponent],
            providers: [TranslateService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LabelsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
