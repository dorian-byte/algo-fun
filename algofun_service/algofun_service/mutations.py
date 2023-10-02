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
from algofun_service.types import ProblemType, MethodType, ProblemNoteType
from django import forms


class MethodForm(forms.ModelForm):
    class Meta:
        model = Method
        fields = "__all__"


class MethodMutation(DjangoModelFormMutation):
    class Meta:
        form_class = MethodForm
        model_operations = ["create", "update"]
        lookup_field = "id"


class ProblemForm(forms.ModelForm):
    class Meta:
        model = Problem
        fields = "__all__"


class ProblemMutation(DjangoModelFormMutation):
    class Meta:
        form_class = ProblemForm
        model_operations = ["create", "update"]
        lookup_field = "id"
        note = graphene.Field(ProblemNoteType)

    class Argument:
        id = graphene.ID(required=False)
        title = graphene.String(required=False)
        url = graphene.String(required=False)
        difficulty = graphene.String(required=False)
        time_complexity_requirement = graphene.String(required=False)
        space_complexity_requirement = graphene.String(required=False)
        note_title = graphene.String(required=False)
        note_content = graphene.String(required=False)
        companies = graphene.List(graphene.String, required=False)
        topics = graphene.List(graphene.String, required=False)
        source = graphene.String(required=False)

    @classmethod
    def mutate(cls, root, info, input):
        id = input.get("id")
        title = input.get("title")
        difficulty = input.get("difficulty")
        time_complexity_requirement = input.get("time_complexity_requirement")
        space_complexity_requirement = input.get("space_complexity_requirement")
        companies = input.get("companies")
        source = input.get("source")
        source = Source.objects.get(pk=source)

        companies = Company.objects.filter(name__in=companies)

        if not id:
            problem = Problem(
                title=title,
                url=input.get("url"),
                difficulty=input.get("difficulty"),
                time_complexity_requirement=time_complexity_requirement,
                space_complexity_requirement=space_complexity_requirement,
                source=source,
            )

        else:
            # problem = Problem.objects.get(pk=id)
            # input.pop("frequency_errors", None)
            # for field, value in input.items():
            #     setattr(problem, field, value)
            # problem.save()
            pass

        # Now call the super class's mutate method to handle the rest
        return super().mutate(root, info, input)


class Mutation(graphene.ObjectType):
    update_method = MethodMutation.Field()
    update_problem = ProblemMutation.Field()
