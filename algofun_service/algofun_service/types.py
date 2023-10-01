import graphene
from graphene_django.forms.mutation import DjangoModelFormMutation
from algofun.models import (
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
from graphene_django import DjangoObjectType
from django import forms


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
    class Meta:
        model = Submission


class MethodType(DjangoObjectType):
    class Meta:
        model = Method


class SourceType(DjangoObjectType):
    class Meta:
        model = Source


class SubmissionPictureType(DjangoObjectType):
    class Meta:
        model = SubmissionPicture


class TopicType(DjangoObjectType):
    class Meta:
        model = Topic


class SubmissionNoteType(DjangoObjectType):
    class Meta:
        model = SubmissionNote
