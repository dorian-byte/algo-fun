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

    def resolve_companies(self, info):
        return self.companies.all()

    def resolve_starred_notes(self, info):
        return self.starred_notes()

    def resolve_note(self, info):
        return self.note()


class SubmissionType(DjangoObjectType):
    passed = graphene.Boolean()

    class Meta:
        model = Submission

    def resolve_passed(self, info):
        return self.passed()


class SourceType(DjangoObjectType):
    class Meta:
        model = Source


class TopicType(DjangoObjectType):
    class Meta:
        model = Topic


class SubmissionNoteType(DjangoObjectType):
    class Meta:
        model = SubmissionNote
