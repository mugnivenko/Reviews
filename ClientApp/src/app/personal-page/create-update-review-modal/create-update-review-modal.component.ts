import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import {
  Observable,
  catchError,
  debounceTime,
  firstValueFrom,
  map,
  tap,
  throwError,
} from 'rxjs';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import type { UploadInput, UploadOutput, UploaderOptions } from 'ngx-uploader';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { serializerCtx, Editor, editorViewCtx, rootCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { tokyo } from '@milkdown/theme-tokyo';
import { slash } from '@milkdown/plugin-slash';
import { menu } from '@milkdown/plugin-menu';
import { gfm } from '@milkdown/preset-gfm';

import { TagService } from 'src/app/shared/services/tag.service';
import { GroupService } from 'src/app/shared/services/group.service';
import { QueryState } from 'src/app/shared/enums/query-state.enum';

import type { Tag } from 'src/app/shared/models/tag.model';
import type { Group } from 'src/app/shared/models/group.model';

import type { ReviewDialogData } from '../shared/review-dailog-data.model';

@UntilDestroy()
@Component({
  selector: 'app-create-update-review-modal',
  templateUrl: './create-update-review-modal.component.html',
  styleUrls: ['./create-update-review-modal.component.scss'],
})
export class CreateUpdateReviewModalComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('editorRef') editorRef?: ElementRef;
  editor?: Editor;

  reviewForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    group: ['', [Validators.required]],
    piece: ['', [Validators.required]],
    grade: [1],
    tags: this.formBuilder.array<string[]>(
      [],
      [Validators.required, Validators.minLength(1)]
    ),
  });

  tagsState = QueryState.Idle;

  tagsInput = new FormControl('');

  tags?: Observable<Tag[]>;
  groups?: Observable<Group[]>;

  uploadInput: EventEmitter<UploadInput>;
  dragOver: boolean = false;
  options: UploaderOptions;

  constructor(
    private dialogRef: MatDialogRef<CreateUpdateReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData,
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private tagService: TagService
  ) {
    this.options = { concurrency: 1, maxUploads: 1 };
    this.uploadInput = new EventEmitter<UploadInput>();
  }

  ngOnInit() {
    this.getGroups();
    this.getTags();
    this.tagsInputFilters();
  }

  ngAfterViewInit() {
    this.createEditor();
  }

  get QueryState() {
    return QueryState;
  }

  async createEditor() {
    this.editor = await Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, this.editorRef?.nativeElement);
      })
      .use(tokyo)
      .use(commonmark)
      .use(slash)
      .use(menu)
      .use(gfm)
      .create();
  }

  getMarkdown() {
    return this.editor?.action((ctx) => {
      const editorView = ctx.get(editorViewCtx);
      const serializer = ctx.get(serializerCtx);
      return serializer(editorView.state.doc);
    });
  }

  async groupChange(event: MatSelectChange) {
    if (this.groups === undefined) {
      return;
    }
    const groups = await firstValueFrom(this.groups);
    const groupId = groups.find(({ name }) => event.value === name)?.id ?? null;
    this.reviewForm.get('group')?.setValue(groupId);
  }

  get addedTags() {
    return (this.reviewForm.get('tags')?.value ?? []) as string[];
  }

  tagsInputFilters() {
    this.tagsInput.valueChanges
      .pipe(debounceTime(700), untilDestroyed(this))
      .subscribe((value) => {
        if (value === null) {
          return;
        }
        this.tagsState = QueryState.Loading;
        this.getTags(value);
      });
  }

  addTag({ value, chipInput }: MatChipInputEvent) {
    if (value.trim() === '') {
      return;
    }
    this.addTagInForm(value);
    chipInput.clear();
  }

  selectedTag({ option }: MatAutocompleteSelectedEvent) {
    this.addTagInForm(option.value);
  }

  get selectedTags() {
    return this.reviewForm.get('tags') as FormArray;
  }

  addTagInForm(value: string) {
    this.selectedTags.push(new FormControl(value));
  }

  removeTag(tag: string) {
    const tagIndex = this.selectedTags.value.findIndex(
      (selectedTag: string) => selectedTag === tag
    );
    if (tagIndex === -1) return;
    this.selectedTags.removeAt(tagIndex);
  }

  uploadActions: Record<string, (output: UploadOutput) => void> = {
    dragOver: () => {
      this.dragOver = true;
    },
    dragOut: () => {
      this.dragOver = false;
    },
    drop: (output: UploadOutput) => {
      this.dragOver = false;
      console.log({ output });
    },
    done: () => {},
    addedToQueue: (output: UploadOutput) => {
      console.log({ output });
    },
    allAddedToQueue: () => {},
    uploading: () => {},
    start: () => {},
    cancelled: () => {},
    removed: () => {},
    removedAll: () => {},
    rejected: () => {},
  };

  onUploadOutput(output: UploadOutput) {
    const action = this.uploadActions[output.type];
    action(output);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick() {}

  getGroups() {
    this.groups = this.groupService.getGroups();
  }

  getTags(searchValue?: string) {
    const params = new HttpParams({
      fromObject: { search: searchValue ?? '' },
    });
    this.tags = this.tagService.getTags(params).pipe(
      map((tags) => {
        this.tagsState = QueryState.Success;
        return tags;
      })
    );
  }
}
