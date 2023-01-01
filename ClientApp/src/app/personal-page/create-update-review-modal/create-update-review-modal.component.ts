import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { Observable, debounceTime, firstValueFrom, map } from 'rxjs';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import {
  UploadFile,
  UploadInput,
  UploadOutput,
  UploadStatus,
  UploaderOptions,
} from 'ngx-uploader';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { gfm } from '@milkdown/preset-gfm';
import { menu } from '@milkdown/plugin-menu';
import { nord } from '@milkdown/theme-nord';
import { tokyo } from '@milkdown/theme-tokyo';
import { slash } from '@milkdown/plugin-slash';
import { commonmark } from '@milkdown/preset-commonmark';
import { serializerCtx, Editor, editorViewCtx, rootCtx } from '@milkdown/core';

import { TagService } from 'src/app/shared/services/tag.service';
import { ThemeService } from 'src/app/theme/theme.service';
import { GroupService } from 'src/app/shared/services/group.service';

import { QueryState } from 'src/app/shared/enums/query-state.enum';
import { Theme } from 'src/app/theme/shared/theme.enum';

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
    files: this.formBuilder.array<string[]>(
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
  files: UploadFile[] = [];

  dragFilesHereOr = $localize`Drag files here or`;
  browse = $localize`browse`;
  toUpload = $localize`to upload.`;

  constructor(
    private dialogRef: MatDialogRef<CreateUpdateReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData,
    private formBuilder: FormBuilder,
    private groupService: GroupService,
    private tagService: TagService,
    private themeService: ThemeService
  ) {
    this.options = {
      concurrency: 1,
      maxUploads: 1,
      allowedContentTypes: [
        'image/bmp',
        'image/jpeg',
        'image/x-png',
        'image/png',
        'image/gif',
      ],
    };
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
    const theme = await this.getEditorTheme();
    this.editor = await Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, this.editorRef?.nativeElement);
      })
      .use(theme)
      .use(commonmark)
      .use(slash)
      .use(menu)
      .use(gfm)
      .create();
  }

  async getEditorTheme() {
    const theme = await firstValueFrom(this.themeService.getTheme());
    const editorTheme = {
      [Theme.Dark]: tokyo,
      [Theme.Light]: nord,
    };
    return editorTheme[theme];
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

  uploadActions: Record<UploadOutput['type'], (output: UploadOutput) => void> =
    {
      dragOver: () => {
        this.dragOver = true;
      },
      dragOut: () => {
        this.dragOver = false;
      },
      drop: () => {
        this.dragOver = false;
      },
      addedToQueue: (output: UploadOutput) => {
        const { file } = output;
        if (file === undefined) return;
        this.files.push(file);
      },
      allAddedToQueue: (output: UploadOutput) => {
        const event: UploadInput = {
          type: 'uploadAll',
          url: 'api/images',
          method: 'POST',
        };
        this.uploadInput.emit(event);
      },
      uploading: (output: UploadOutput) => {
        this.updateFile(output.file);
      },
      start: (output: UploadOutput) => {
        this.updateFile(output.file);
      },
      cancelled: (output: UploadOutput) => {
        console.log('cancelled', { output });
        const { file } = output;
        if (file === undefined) return;
        this.notifyRemoveFile(file.id);
      },
      done: (output: UploadOutput) => {
        this.updateFile(output.file);
        const { uri } = output.file?.response;
        if (typeof uri !== 'string') {
          return;
        }
        this.addedFiles.push(new FormControl(uri));
      },
      removed: (output: UploadOutput) => {
        this.files = this.files.filter((file) => file.id !== output.file?.id);
        this.removeFileFromForm(output.file?.response.uri);
      },
      rejected: (output: UploadOutput) => {
        console.log({ output });
      },
      removedAll: () => {
        // TODO: multiply file upload
      },
    };

  get UploadStatus() {
    return UploadStatus;
  }

  updateFile(file?: UploadFile) {
    if (file === undefined) {
      return;
    }
    const index = this.files.findIndex(({ id }) => id === file.id);
    this.files.splice(index, 1, file);
  }

  removeFile(id: string) {
    this.files = this.files.filter((file) => file.id !== id);
  }

  notifyRemoveFile(id: string) {
    this.uploadInput.emit({ type: 'remove', id });
  }

  onUploadOutput(output: UploadOutput) {
    const action = this.uploadActions[output.type];
    action(output);
  }

  onFileDelete(id: string) {
    this.notifyRemoveFile(id);
  }

  onFileCancel(id: string) {
    this.uploadInput.emit({ type: 'cancel', id });
  }

  removeFileFromForm(uri: unknown) {
    if (typeof uri !== 'string') {
      return;
    }
    const fileIndex = this.addedFiles.value.findIndex(
      (addedUri: string) => addedUri === uri
    );
    if (fileIndex === -1) {
      return;
    }
    this.addedFiles.removeAt(fileIndex);
  }

  get addedFiles() {
    return this.reviewForm.get('files') as FormArray;
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
