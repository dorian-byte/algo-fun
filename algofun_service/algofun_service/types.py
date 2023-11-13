import graphene
from graphene_django.forms.mutation import DjangoModelFormMutation
from algofun.models import (
    Problem,
    Submission,
    Source,
    Topic,
    ProblemNote,
    SubmissionNote,
    Company,
    Tag,
    ProblemResource,
    NoteResource,
    SubmissionResource,
)
from graphene_django import DjangoObjectType
from django import forms


class TagType(DjangoObjectType):
    class Meta:
        model = Tag


class ProblemResourceType(DjangoObjectType):
    class Meta:
        model = ProblemResource


class NoteResourceType(DjangoObjectType):
    class Meta:
        model = NoteResource


class SubmissionResourceType(DjangoObjectType):
    class Meta:
        model = SubmissionResource


class ProblemNoteType(DjangoObjectType):
    class Meta:
        model = ProblemNote


class CompanyType(DjangoObjectType):
    class Meta:
        model = Company


class ProblemType(DjangoObjectType):
    class Meta:
        model = Problem

    companies = graphene.List(CompanyType)
    starred_notes = graphene.List(ProblemNoteType)
    note = graphene.Field(ProblemNoteType)
    has_notes = graphene.Boolean()
    notes_count = graphene.Int()
    has_resources = graphene.Boolean()
    resources_count = graphene.Int()
    has_submissions = graphene.Boolean()
    submissions_count = graphene.Int()

    def resolve_companies(self, info):
        return self.companies.all()

    def resolve_starred_notes(self, info):
        return self.starred_notes()

    def resolve_note(self, info):
        return self.note()

    def resolve_has_notes(self, info):
        return self.has_notes()

    def resolve_notes_count(self, info):
        return self.notes_count()

    def resolve_has_resources(self, info):
        return self.has_resources()

    def resolve_resources_count(self, info):
        return self.resources_count()

    def resolve_has_submissions(self, info):
        return self.has_submissions()

    def resolve_submissions_count(self, info):
        return self.submissions_count()


class SubmissionType(DjangoObjectType):
    passed = graphene.Boolean()
    has_notes = graphene.Boolean()
    notes_count = graphene.Int()
    has_resources = graphene.Boolean()

    class Meta:
        model = Submission

    def resolve_passed(self, info):
        return self.passed()

    def resolve_has_notes(self, info):
        return self.has_notes()

    def resolve_notes_count(self, info):
        return self.notes_count()

    def resolve_has_resources(self, info):
        return self.has_resources()


class SourceType(DjangoObjectType):
    class Meta:
        model = Source


class TopicType(DjangoObjectType):
    class Meta:
        model = Topic


class SubmissionNoteType(DjangoObjectType):
    class Meta:
        model = SubmissionNote
