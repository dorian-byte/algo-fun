import graphene
from graphene_django.forms.mutation import DjangoModelFormMutation
from algofun.models import (
    Problem,
    Submission,
    Source,
    Topic,
    Company,
    Tag,
    Note,
    Resource,
    TaggedItem,
)
from graphene_django import DjangoObjectType
from django.contrib.contenttypes.models import ContentType


class ResourceType(DjangoObjectType):
    class Meta:
        model = Resource


class CompanyType(DjangoObjectType):
    class Meta:
        model = Company


class TaggedItemType(DjangoObjectType):
    class Meta:
        model = TaggedItem


class TagType(DjangoObjectType):
    class Meta:
        model = Tag

    # Define a field to get tagged items
    tagged_items = graphene.List(lambda: ProblemNoteUnion)

    def resolve_tagged_items(self, info):
        # Fetch related problems and notes through TaggedItem
        content_type_problem = ContentType.objects.get_for_model(Problem)
        content_type_note = ContentType.objects.get_for_model(Note)

        related_problems = Problem.objects.filter(
            tags__content_type=content_type_problem, tags__tag_id=self.id
        )
        related_notes = Note.objects.filter(
            tags__content_type=content_type_note, tags__tag_id=self.id
        )

        return list(related_problems) + list(related_notes)


class ProblemType(DjangoObjectType):
    class Meta:
        model = Problem

    companies = graphene.List(CompanyType)
    has_notes = graphene.Boolean()
    notes_count = graphene.Int()
    resources_count = graphene.Int()
    has_submissions = graphene.Boolean()
    submissions_count = graphene.Int()
    tags = graphene.List(TagType)

    def resolve_tags(self, info):
        return Tag.objects.filter(
            tagged_items__content_type=ContentType.objects.get_for_model(Problem),
            tagged_items__object_id=self.id,
        )

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

    class Meta:
        model = Submission

    def resolve_passed(self, info):
        return self.passed()

    def resolve_has_notes(self, info):
        return self.has_notes()

    def resolve_notes_count(self, info):
        return self.notes_count()


class SourceType(DjangoObjectType):
    class Meta:
        model = Source


class TopicType(DjangoObjectType):
    class Meta:
        model = Topic


class NoteType(DjangoObjectType):
    has_resources = graphene.Boolean()

    class Meta:
        model = Note

    tags = graphene.List(TagType)

    def resolve_tags(self, info):
        return Tag.objects.filter(
            tagged_items__content_type=ContentType.objects.get_for_model(Note),
            tagged_items__object_id=self.id,
        )

    def resolve_has_resources(self, info):
        return self.has_resources()


class ProblemNoteUnion(graphene.Union):
    class Meta:
        types = (ProblemType, NoteType)
