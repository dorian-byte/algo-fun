from django.contrib import admin

# Register your models here.

from .models import (
    Problem,
    Submission,
    Method,
    Source,
    Topic,
    ProblemNote,
    SubmissionNote,
    Company,
    ProblemResource,
    SubmissionResource,
    NoteResource,
    Tag,
)


class ProblemSubmissionInline(admin.TabularInline):
    model = Submission
    extra = 0


class ProblemNoteInline(admin.TabularInline):
    model = ProblemNote
    extra = 0


class ProblemResourceInline(admin.TabularInline):
    model = ProblemResource
    extra = 0


class SubmissionNoteInline(admin.TabularInline):
    model = SubmissionNote
    extra = 0


class SubmissionResourceInline(admin.TabularInline):
    model = SubmissionResource
    extra = 0


class NoteResourceInline(admin.TabularInline):
    model = NoteResource
    extra = 0


@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ["title"]
    inlines = [ProblemSubmissionInline, ProblemResourceInline, ProblemNoteInline]


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ["__str__"]
    inlines = [SubmissionResourceInline, SubmissionNoteInline]


@admin.register(Method)
class MethodAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(ProblemNote)
class ProblemNoteAdmin(admin.ModelAdmin):
    list_display = ["title", "content"]
    inlines = [NoteResourceInline]


@admin.register(SubmissionNote)
class SubmissionNoteAdmin(admin.ModelAdmin):
    list_display = ["submission", "title", "content"]
    inlines = [NoteResourceInline]


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ["name"]


class NoteResourceTagInline(admin.TabularInline):
    model = Tag
    extra = 0


@admin.register(ProblemResource)
class ProblemResourceAdmin(admin.ModelAdmin):
    list_display = ["title"]
    inlines = [NoteResourceTagInline]


@admin.register(SubmissionResource)
class SubmissionResourceAdmin(admin.ModelAdmin):
    list_display = ["title"]


@admin.register(NoteResource)
class NoteResourceAdmin(admin.ModelAdmin):
    list_display = ["title"]
