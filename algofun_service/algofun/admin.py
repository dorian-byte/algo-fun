from django.contrib import admin

# Register your models here.

from .models import (
    Problem,
    Submission,
    Method,
    Source,
    SubmissionPicture,
    Topic,
    ProblemNote,
    SubmissionNote,
    Company,
)


@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ["title"]


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ["__str__"]


@admin.register(SubmissionPicture)
class SubmissionPictureAdmin(admin.ModelAdmin):
    list_display = ["url"]


@admin.register(Method)
class MethodAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(ProblemNote)
class ProblemNoteAdmin(admin.ModelAdmin):
    list_display = ["title", "content"]


@admin.register(SubmissionNote)
class SubmissionNoteAdmin(admin.ModelAdmin):
    list_display = ["submission", "title", "content"]


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ["name"]
