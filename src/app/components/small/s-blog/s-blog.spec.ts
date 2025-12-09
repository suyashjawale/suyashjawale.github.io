import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SBlog } from './s-blog';

describe('SBlog', () => {
  let component: SBlog;
  let fixture: ComponentFixture<SBlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SBlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SBlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
