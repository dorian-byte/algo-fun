import graphene
from algofun.models import (
    Problem,
    Submission,
    Source,
    Topic,
    Company,
    Tag,
    Note,
    Resource,
)

from algofun_service.types import (
    CompanyType,
    TagType,
    ResourceType,
    ProblemType,
    SubmissionType,
    SourceType,
    TopicType,
    NoteType,
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
    all_notes = graphene.List(NoteType)
    note_by_id = graphene.Field(NoteType, id=graphene.Int())
    all_companies = graphene.List(CompanyType)
    company_by_id = graphene.Field(CompanyType, id=graphene.Int())
    all_tags = graphene.List(TagType)
    tag_by_id = graphene.Field(TagType, id=graphene.Int())
    all_notes = graphene.List(NoteType)
    note_by_id = graphene.Field(NoteType, id=graphene.Int())
    all_resources = graphene.List(ResourceType)
    resource_by_id = graphene.Field(ResourceType, id=graphene.Int())
    # more queries like this isn't necessary because can just use problem_by_id and then get submissions
    # submissions_by_problem_id = graphene.List(SubmissionType, problem_id=graphene.Int())

    all_notes = graphene.List(NoteType)

    # basic queries

    def resolve_all_problems(self, info):
        # FIXME: change back after adding pagination
        return Problem.objects.all()[:50]
        # return Problem.objects.all()

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

    def resolve_all_notes(self, info):
        return Note.objects.all()

    def resolve_note_by_id(self, info, id):
        return Note.objects.get(pk=id)

    def resolve_all_companies(self, info):
        return Company.objects.all()

    def resolve_company_by_id(self, info, id):
        return Company.objects.get(pk=id)

    def resolve_all_tags(self, info):
        return Tag.objects.all()

    def resolve_tag_by_id(self, info, id):
        return Tag.objects.get(pk=id)

    def resolve_all_resources(self, info):
        return Resource.objects.all()

    def resolve_resource_by_id(self, info, id):
        return Resource.objects.get(pk=id)

    def resolve_note_by_id(self, info, id):
        return Note.objects.get(pk=id)

    # more queries like this isn't necessary
    # def resolve_submissions_by_problem_id(self, info, problem_id):
    #     return Submission.objects.filter(problem=problem_id)
