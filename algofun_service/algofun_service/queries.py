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

from algofun_service.types import (
    ProblemNoteType,
    CompanyType,
    TagType,
    ProblemResourceType,
    NoteResourceType,
    SubmissionResourceType,
    ProblemType,
    SubmissionType,
    SourceType,
    TopicType,
    SubmissionNoteType,
)


class Query(graphene.ObjectType):
    # basic queries
    all_problems = graphene.List(ProblemType)
    problem_by_id = graphene.Field(ProblemType, id=graphene.Int())
    all_submissions = graphene.List(SubmissionType)
    submission_by_id = graphene.Field(SubmissionType, id=graphene.Int())
    all_sources = graphene.List(SourceType)
    source_by_id = graphene.Field(SourceType, id=graphene.Int())
    all_topics = graphene.List(TopicType)
    topic_by_id = graphene.Field(TopicType, id=graphene.Int())
    all_problem_notes = graphene.List(ProblemNoteType)
    problem_note_by_id = graphene.Field(ProblemNoteType, id=graphene.Int())
    all_submission_notes = graphene.List(SubmissionNoteType)
    submission_note_by_id = graphene.Field(SubmissionNoteType, id=graphene.Int())
    all_companies = graphene.List(CompanyType)
    company_by_id = graphene.Field(CompanyType, id=graphene.Int())
    all_tags = graphene.List(TagType)
    tag_by_id = graphene.Field(TagType, id=graphene.Int())
    all_problem_resources = graphene.List(ProblemResourceType)
    problem_resource_by_id = graphene.Field(ProblemResourceType, id=graphene.Int())
    all_submission_resources = graphene.List(SubmissionResourceType)
    submission_resource_by_id = graphene.Field(
        SubmissionResourceType, id=graphene.Int()
    )
    all_note_resources = graphene.List(NoteResourceType)
    note_resource_by_id = graphene.Field(NoteResourceType, id=graphene.Int())
    # more queries like this isn't necessary because can just use problem_by_id and then get submissions
    # submissions_by_problem_id = graphene.List(SubmissionType, problem_id=graphene.Int())

    # basic queries

    def resolve_all_problems(self, info):
        # FIXME: change back after adding pagination
        # return Problem.objects.all()[:50]
        return Problem.objects.all()

    def resolve_problem_by_id(self, info, id):
        return Problem.objects.get(pk=id)

    def resolve_all_submissions(self, info):
        return Submission.objects.all()

    def resolve_submission_by_id(self, info, id):
        return Submission.objects.get(pk=id)

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

    def resolve_all_companies(self, info):
        return Company.objects.all()

    def resolve_company_by_id(self, info, id):
        return Company.objects.get(pk=id)

    def resolve_all_tags(self, info):
        return Tag.objects.all()

    def resolve_tag_by_id(self, info, id):
        return Tag.objects.get(pk=id)

    def resolve_all_problem_resources(self, info):
        return ProblemResource.objects.all()

    def resolve_problem_resource_by_id(self, info, id):
        return ProblemResource.objects.get(pk=id)

    def resolve_all_submission_resources(self, info):
        return SubmissionResource.objects.all()

    def resolve_submission_resource_by_id(self, info, id):
        return SubmissionResource.objects.get(pk=id)

    def resolve_all_note_resources(self, info):
        return NoteResource.objects.all()

    def resolve_note_resource_by_id(self, info, id):
        return NoteResource.objects.get(pk=id)

    # more queries like this isn't necessary
    # def resolve_submissions_by_problem_id(self, info, problem_id):
    #     return Submission.objects.filter(problem=problem_id)
