import graphene
from graphene_django.forms.mutation import DjangoModelFormMutation
from algofun.models import (
    Problem,
    Submission,
    Method,
    Source,
    Topic,
    ProblemNote,
    SubmissionNote,
    Company,
)
from graphene_django import DjangoObjectType
from django import forms

from algofun_service.types import (
    ProblemNoteType,
    CompanyType,
    ProblemType,
    SubmissionType,
    MethodType,
    SourceType,
    TopicType,
    SubmissionNoteType,
)


class Query(graphene.ObjectType):
    all_problems = graphene.List(ProblemType)
    all_submissions = graphene.List(SubmissionType)
    all_methods = graphene.List(MethodType)
    all_sources = graphene.List(SourceType)
    all_topics = graphene.List(TopicType)
    all_problem_notes = graphene.List(ProblemNoteType)
    all_submission_notes = graphene.List(SubmissionNoteType)

    def resolve_all_problems(self, info):
        return Problem.objects.all()

    def resolve_problem_by_id(self, info, id):
        return Problem.objects.get(pk=id)

    def resolve_all_submissions(self, info):
        return Submission.objects.all()

    def resolve_submission_by_id(self, info, id):
        return Submission.objects.get(pk=id)

    def resolve_all_methods(self, info):
        return Method.objects.all()

    def resolve_method_by_id(self, info, id):
        return Method.objects.get(pk=id)

    def resolve_all_sources(self, info):
        return Source.objects.all()

    def resolve_source_by_id(self, info, id):
        return Source.objects.get(pk=id)

    def resolve_all_topics(self, info):
        return Topic.objects.all()

    def resolve_topic_by_id(self, info, id):
        return Topic.objects.get(pk=id)

    def resolve_all_problem_notes(self, info):
        return ProblemNote.objects.all()

    def resolve_problem_note_by_id(self, info, id):
        return ProblemNote.objects.get(pk=id)

    def resolve_all_submission_notes(self, info):
        return SubmissionNote.objects.all()

    def resolve_submission_note_by_id(self, info, id):
        return SubmissionNote.objects.get(pk=id)
