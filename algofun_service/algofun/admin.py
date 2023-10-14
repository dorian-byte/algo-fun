from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline

# Register your models here.

from .models import (
    Problem,
    Submission,
    Source,
    Topic,
    ProblemNote,
    SubmissionNote,
    Company,
    ProblemResource,
    SubmissionResource,
    NoteResource,
    Tag,
    TaggedItem,
    # Resource,
    Note,
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


class TaggedItemInline(GenericTabularInline):
    model = TaggedItem
    extra = 1  # the number of empty new forms to display on the admin page


@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ["title"]
    inlines = [
        ProblemSubmissionInline,
        ProblemResourceInline,
        ProblemNoteInline,
        TaggedItemInline,
    ]


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ["__str__"]
    inlines = [SubmissionResourceInline, SubmissionNoteInline]


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


@admin.register(ProblemResource)
class ProblemResourceAdmin(admin.ModelAdmin):
    list_display = ["title"]
    inlines = [TaggedItemInline]


@admin.register(SubmissionResource)
class SubmissionResourceAdmin(admin.ModelAdmin):
    list_display = ["title"]
    inlines = [TaggedItemInline]


@admin.register(NoteResource)
class NoteResourceAdmin(admin.ModelAdmin):
    list_display = ["title"]
    inlines = [TaggedItemInline]


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]  # optional, for easy searching in the admin
