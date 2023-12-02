from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline

# Register your models here.

from .models import (
    Problem,
    Submission,
    Source,
    Topic,
    Company,
    Resource,
    Tag,
    TaggedItem,
    Note,
)


class ProblemSubmissionInline(admin.TabularInline):
    model = Submission
    extra = 0


class ResourceInline(admin.TabularInline):
    model = Resource
    extra = 0


class TaggedItemInline(GenericTabularInline):
    model = TaggedItem
    extra = 1  # the number of empty new forms to display on the admin page


@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ["__str__"]


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ["__str__"]
    inlines = [
        ProblemSubmissionInline,
        TaggedItemInline,
    ]


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ["__str__"]


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ["__str__"]


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ["__str__"]


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ["__str__"]


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ["__str__"]
    inlines = [TaggedItemInline]


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["__str__"]
    search_fields = ["name"]  # optional, for easy searching in the admin
