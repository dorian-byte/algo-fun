import graphene
from graphene_django.forms.mutation import DjangoModelFormMutation
from algofun.models import (
    Problem,
    Submission,
    Source,
    Topic,
    ProblemNote,
    SubmissionNote,
    ProblemResource,
    SubmissionResource,
    NoteResource,
    Company,
    Tag,
    Resource,
    Note,
)

from django import forms
from .types import SubmissionType


class SourceForm(forms.ModelForm):
    class Meta:
        model = Source
        fields = "__all__"


class SourceMutation(DjangoModelFormMutation):
    class Meta:
        form_class = SourceForm
        model_operations = ["create", "update"]
        lookup_field = "id"

    class Argument:
        id = graphene.ID(required=False)
        name = graphene.String(required=False)

    @classmethod
    def mutate(cls, root, info, input):
        return super().mutate(root, info, input)


class ProblemNoteForm(forms.ModelForm):
    class Meta:
        model = ProblemNote
        fields = "__all__"


class ProblemNoteMutation(DjangoModelFormMutation):
    class Meta:
        form_class = ProblemNoteForm
        model_operations = ["create", "update"]
        lookup_field = "id"

    class Argument:
        id = graphene.ID(required=False)
        problem = graphene.String(required=False)
        title = graphene.String(required=False)
        content = graphene.String(required=False)
        created_at = graphene.String(required=False)
        updated_at = graphene.String(required=False)
        note_type = graphene.String(required=False)
        start_line_number = graphene.Int(required=False)
        end_line_number = graphene.Int(required=False)

    @classmethod
    def mutate(cls, root, info, input):
        return super().mutate(root, info, input)


class SubmissionNoteForm(forms.ModelForm):
    class Meta:
        model = SubmissionNote
        fields = "__all__"


class SubmissionNoteMutation(DjangoModelFormMutation):
    class Meta:
        form_class = SubmissionNoteForm
        model_operations = ["create", "update"]
        lookup_field = "id"

    class Argument:
        id = graphene.ID(required=False)
        submission = graphene.String(required=False)
        title = graphene.String(required=False)
        content = graphene.String(required=False)
        created_at = graphene.String(required=False)
        updated_at = graphene.String(required=False)
        note_type = graphene.String(required=False)
        start_line_number = graphene.Int(required=False)
        end_line_number = graphene.Int(required=False)

    @classmethod
    def mutate(cls, root, info, input):
        return super().mutate(root, info, input)


class TagForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = "__all__"


class TagMutation(DjangoModelFormMutation):
    class Meta:
        form_class = TagForm
        model_operations = ["create", "update"]
        lookup_field = "id"

    class Argument:
        id = graphene.ID(required=False)
        name = graphene.String(required=False)
        resource = graphene.String(required=False)

    @classmethod
    def mutate(cls, root, info, input):
        return super().mutate(root, info, input)


class ProblemResourceForm(forms.ModelForm):
    class Meta:
        model = ProblemResource
        fields = "__all__"


class ProblemResourceMutation(DjangoModelFormMutation):
    class Meta:
        form_class = ProblemResourceForm
        model_operations = ["create", "update"]
        lookup_field = "id"

    class Argument:
        id = graphene.ID(required=False)
        problem = graphene.String(required=False)
        title = graphene.String(required=False)
        url = graphene.String(required=False)
        resource_type = graphene.String(required=False)

    @classmethod
    def mutate(cls, root, info, input):
        return super().mutate(root, info, input)


class NoteResourceForm(forms.ModelForm):
    class Meta:
        model = NoteResource
        fields = "__all__"


class NoteResourceMutation(DjangoModelFormMutation):
    class Meta:
        form_class = NoteResourceForm
        model_operations = ["create", "update"]
        lookup_field = "id"

    class Argument:
        id = graphene.ID(required=False)
        problem = graphene.String(required=False)
        title = graphene.String(required=False)
        url = graphene.String(required=False)
        resource_type = graphene.String(required=False)

    @classmethod
    def mutate(cls, root, info, input):
        return super().mutate(root, info, input)


class SubmissionResourceForm(forms.ModelForm):
    class Meta:
        model = SubmissionResource
        fields = "__all__"


class SubmissionResourceMutation(DjangoModelFormMutation):
    class Meta:
        form_class = SubmissionResourceForm
        model_operations = ["create", "update"]
        lookup_field = "id"

    class Argument:
        id = graphene.ID(required=False)
        submission = graphene.String(required=False)
        title = graphene.String(required=False)
        url = graphene.String(required=False)
        resource_type = graphene.String(required=False)

    @classmethod
    def mutate(cls, root, info, input):
        return super().mutate(root, info, input)


class ProblemForm(forms.ModelForm):
    class Meta:
        model = Problem
        fields = "__all__"


class ProblemMutation(DjangoModelFormMutation):
    class Meta:
        form_class = ProblemForm
        model_operations = ["create", "update"]
        lookup_field = "id"

    class Argument:
        id = graphene.ID(required=False)
        title = graphene.String(required=False)
        url = graphene.String(required=False)
        difficulty = graphene.String(required=False)
        time_complexity_requirement = graphene.String(required=False)
        space_complexity_requirement = graphene.String(required=False)
        companies = graphene.List(graphene.String, required=False)
        topics = graphene.List(graphene.String, required=False)
        source = graphene.String(required=False)

    @classmethod
    def mutate(cls, root, info, input):
        # Now call the super class's mutate method to handle the rest
        return super().mutate(root, info, input)


class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = "__all__"


class CompanyMutation(DjangoModelFormMutation):
    class Meta:
        form_class = CompanyForm
        model_operations = ["create", "update"]
        lookup_field = "id"

    class Argument:
        id = graphene.ID(required=False)
        name = graphene.String(required=False)

    @classmethod
    def mutate(cls, root, info, input):
        return super().mutate(root, info, input)


class SubmissionForm(forms.ModelForm):
    class Meta:
        model = Submission
        fields = "__all__"


class UpdateSubmissionInput(graphene.InputObjectType):
    id = graphene.ID(required=False)
    problem = graphene.String(required=False)
    proficiency_level = graphene.String(required=False)
    submitted_at = graphene.String(required=False)
    duration = graphene.String(required=False)
    is_solution = graphene.String(required=False)
    is_interview_mode = graphene.String(required=False)
    is_whiteboard_mode = graphene.String(required=False)
    mothods = graphene.List(graphene.String, required=False)


class SubmissionMutation(DjangoModelFormMutation):
    class Meta:
        form_class = SubmissionForm
        model_operations = ["create", "update"]
        lookup_field = "id"

    class Argument:
        input = UpdateSubmissionInput(required=True)

    submission = graphene.Field(SubmissionType)

    @classmethod
    def mutate(cls, root, info, input):
        return super().mutate(root, info, input)


class TopicForm(forms.ModelForm):
    class Meta:
        model = Topic
        fields = "__all__"


class TopicMutation(DjangoModelFormMutation):
    class Meta:
        form_class = TopicForm
        model_operations = ["create", "update"]
        lookup_field = "id"

    class Argument:
        id = graphene.ID(required=False)
        name = graphene.String(required=False)

    @classmethod
    def mutate(cls, root, info, input):
        return super().mutate(root, info, input)


class DeleteTopic(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            instance = Topic.objects.get(pk=id)
            instance.delete()
            return DeleteTopic(ok=True)
        except Topic.DoesNotExist:
            return DeleteTopic(ok=False)


class DeleteSubmission(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            instance = Submission.objects.get(pk=id)
            instance.delete()
            return DeleteSubmission(ok=True)
        except Submission.DoesNotExist:
            return DeleteSubmission(ok=False)


class DeleteProblem(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            instance = Problem.objects.get(pk=id)
            instance.delete()
            return DeleteProblem(ok=True)
        except Problem.DoesNotExist:
            return DeleteProblem(ok=False)


class DeleteCompany(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            instance = Company.objects.get(pk=id)
            instance.delete()
            return DeleteCompany(ok=True)
        except Company.DoesNotExist:
            return DeleteCompany(ok=False)


class DeleteTag(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            instance = Tag.objects.get(pk=id)
            instance.delete()
            return DeleteTag(ok=True)
        except Tag.DoesNotExist:
            return DeleteTag(ok=False)


class DeleteResource(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            instance = Resource.objects.get(pk=id)
            instance.delete()
            return DeleteResource(ok=True)
        except Resource.DoesNotExist:
            return DeleteResource(ok=False)


class DeleteNote(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            instance = Note.objects.get(pk=id)
            instance.delete()
            return DeleteNote(ok=True)
        except Note.DoesNotExist:
            return DeleteNote(ok=False)


class DeleteSource(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            instance = Source.objects.get(pk=id)
            instance.delete()
            return DeleteSource(ok=True)
        except Source.DoesNotExist:
            return DeleteSource(ok=False)


class Mutation(graphene.ObjectType):
    update_problem = ProblemMutation.Field()
    update_company = CompanyMutation.Field()
    update_tag = TagMutation.Field()
    update_problem_resource = ProblemResourceMutation.Field()
    update_submission = SubmissionMutation.Field()
    update_problem_resource = ProblemResourceMutation.Field()
    update_note_resource = NoteResourceMutation.Field()
    update_submission_resource = SubmissionResourceMutation.Field()
    update_topic = TopicMutation.Field()
    update_source = SourceMutation.Field()
    update_problem_note = ProblemNoteMutation.Field()
    update_submission_note = SubmissionNoteMutation.Field()
    delete_topic = DeleteTopic.Field()
    delete_resource = DeleteResource.Field()
    delete_note = DeleteNote.Field()
    delete_source = DeleteSource.Field()
    delete_problem = DeleteProblem.Field()
    delete_submission = DeleteSubmission.Field()
    delete_company = DeleteCompany.Field()
    delete_tag = DeleteTag.Field()
