from django.db import models
from polymorphic.models import PolymorphicModel
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Difficulty(models.TextChoices):
    EASY = "easy", "easy"
    MEDIUM = "medium", "medium"
    HARD = "hard", "hard"


class Complexity(models.TextChoices):
    O_1 = "o1", "o1"
    O_N_SQUARE_ROOT = "nsqrt", "nsqrt"
    O_LOGN = "logn", "logn"
    O_N = "n", "n"
    O_NLOGN = "nlogn", "nlogn"
    O_N2 = "n2", "n2"
    O_N3 = "n3", "n3"
    O_2N = "2n", "2n"
    O_N_FACTORIAL = "nfactorial", "nfactorial"


# NOTE: below uses NAME_OF_CHOICE=DB_VALUE,HUMAN_READABLE_DESCRIPTION format
class ProficiencyLevel(models.TextChoices):
    NO_UNDERSTANDING = "no_understanding", "no understanding"
    CONCEPTUAL_UNDERSTANDING = (
        "conceptual_understanding",
        "conceptual understanding",
    )
    # BORROWED_SOLUTION = "borrowed_solution", "borrowed solution"
    NO_PASS = "no_pass", "no pass"
    GUIDED_PASS = "guided_pass", "guided pass"
    UNSTEADY_PASS = "unsteady_pass", "unsteady pass"
    SMOOTH_PASS = "smooth_pass", "smooth pass"
    SMOOTH_OPTIMAL_PASS = "smooth_optimal_pass", "smooth optimal pass"


class Topic(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Source(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Problem(models.Model):
    title = models.CharField(max_length=100, unique=True, db_index=True)
    leetcode_number = models.PositiveIntegerField(unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    difficulty = models.CharField(
        max_length=6,
        choices=Difficulty.choices,
        default=Difficulty.EASY,
        db_index=True,
        blank=True,
    )
    time_complexity_requirement = models.CharField(
        max_length=20,
        choices=Complexity.choices,
        default=Complexity.O_N,
        db_index=True,
        blank=True,
    )
    space_complexity_requirement = models.CharField(
        max_length=20,
        choices=Complexity.choices,
        default=Complexity.O_N,
        db_index=True,
        blank=True,
    )

    companies = models.ManyToManyField("Company", blank=True)
    topics = models.ManyToManyField("Topic", blank=True)

    # source has where this problem comes from, e.g. leetcode, jzoffer, etc.
    # this should be a multiple choice field with multiple values allowed
    source = models.ForeignKey(
        "Source",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="problems",
    )

    url = models.URLField(max_length=200, blank=True)
    lintcode_equivalent_problem_number = models.PositiveIntegerField(
        blank=True, null=True
    )
    lintcode_equivalent_problem_url = models.URLField(
        max_length=200, blank=True, null=True
    )

    def tags(self):
        content_type = ContentType.objects.get_for_model(self)
        tagged_items = TaggedItem.objects.filter(
            content_type=content_type, object_id=self.id
        )
        return [item.tag for item in tagged_items]

    def resources(self):
        return self.problemresource_set.all()

    def solutions(self):
        return self.submission_set.filter(is_solution=True)

    def starred_notes(self):
        return self.problemnote_set.filter(is_starred=True)

    def __str__(self):
        return str(self.leetcode_number) + " " + self.title


class Submission(models.Model):
    # NOTE: using string reference (e.g. "Problem") to avoid circular dependency
    problem = models.ForeignKey(
        "Problem", on_delete=models.CASCADE, related_name="submissions"
    )
    code = models.TextField(blank=True)
    # passed = models.BooleanField()
    proficiency_level = models.CharField(
        max_length=100,
        choices=ProficiencyLevel.choices,
        default=ProficiencyLevel.NO_UNDERSTANDING,
    )
    submitted_at = models.DateTimeField(default=timezone.now)
    duration = models.PositiveIntegerField(blank=True, null=True)
    is_solution = models.BooleanField(default=False)
    is_interview_mode = models.BooleanField(default=False)
    is_whiteboard_mode = models.BooleanField(default=False)
    methods = models.ManyToManyField("Topic", blank=True)

    def passed(self):
        non_passing_levels = [
            ProficiencyLevel.NO_UNDERSTANDING,
            ProficiencyLevel.CONCEPTUAL_UNDERSTANDING,
            ProficiencyLevel.NO_PASS,
        ]
        return self.proficiency_level not in non_passing_levels

    def __str__(self):
        # NOTE: formats date as MM/YY
        submitted_date = self.submitted_at.strftime("%m/%y")
        return (
            f"{submitted_date} {self.problem.leetcode_number} {self.proficiency_level}"
        )


class ResourceType(models.TextChoices):
    IMAGE = "image", "image"
    VIDEO = "video", "video"
    ARTICLE = "article", "article"
    SOLUTION_POST = "solution_post", "solution post"


class Resource(PolymorphicModel):
    title = models.CharField(max_length=100, blank=True)
    url = models.URLField(max_length=200, blank=True)
    resource_type = models.CharField(
        max_length=100,
        choices=ResourceType.choices,
        # default=ResourceType.SOLUTION_POST,
        blank=True,
    )

    def tags(self):
        content_type = ContentType.objects.get_for_model(self)
        tagged_items = TaggedItem.objects.filter(
            content_type=content_type, object_id=self.id
        )
        return [item.tag for item in tagged_items]

    def __str__(self):
        return self.title


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class TaggedItem(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name="tagged_items")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    def __str__(self):
        return f"{self.content_object} - {self.tag.name}"


class ProblemResource(Resource):
    problem = models.ForeignKey(
        "Problem", on_delete=models.CASCADE, related_name="resources"
    )


class SubmissionResource(Resource):
    submission = models.ForeignKey(
        "Submission", on_delete=models.CASCADE, related_name="resources"
    )


class NoteResource(Resource):
    note = models.ForeignKey("Note", on_delete=models.CASCADE, related_name="resources")


class NoteType(models.TextChoices):
    INTUITION = "intuition", "intuition"
    STUCK_POINT = "stuck_point", "stuck point"
    QNA = "qna", "qna"
    ERR = "err", "err"
    MEMO = "memo", "memo"


class Note(PolymorphicModel):
    # question is optional, answer isn't
    title = models.CharField(max_length=100, blank=True)
    content = models.TextField(null=False)
    submitted_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_starred = models.BooleanField(default=False)
    note_type = models.CharField(
        max_length=100,
        choices=NoteType.choices,
        blank=True,
    )
    start_line_number = models.PositiveIntegerField(blank=True, null=True)
    end_line_number = models.PositiveIntegerField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # NOTE: Before saving the Note object, check if only start_line_number is provided.
        # If end_line_number is not provided, set end_line_number equal to start_line_number.
        if self.start_line_number is not None and self.end_line_number is None:
            self.end_line_number = self.start_line_number
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProblemNote(Note):
    problem = models.ForeignKey(
        "Problem", on_delete=models.CASCADE, related_name="notes"
    )


class SubmissionNote(Note):
    submission = models.ForeignKey(
        "Submission", on_delete=models.CASCADE, related_name="notes"
    )


class Company(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
