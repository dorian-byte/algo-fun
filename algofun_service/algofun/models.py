from django.db.models import Count, Sum
from django.db import models
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
    asked_by_faang = models.BooleanField(default=False)
    acceptance_rate = models.FloatField(blank=True, null=True)
    frequency = models.FloatField(blank=True, null=True)
    difficulty = models.CharField(
        max_length=6,
        choices=Difficulty.choices,
        # null=True,
        blank=True,
    )
    time_complexity_requirement = models.CharField(
        max_length=20,
        choices=Complexity.choices,
        # null=True,
        blank=True,
    )
    space_complexity_requirement = models.CharField(
        max_length=20,
        choices=Complexity.choices,
        # null=True,
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

    similar_problems = models.ManyToManyField(
        "self", symmetrical=False, blank=True, related_name="reverse_similar_problems"
    )

    # NOTE: added below counts to avoid backend's N+1 query problem
    # this helps the frontend's Problem List page to load faster by reducing the number of queries
    # and enables faster display of the conditional button styles based on the counts of notes, submissions, and resources

    def has_submissions(self):
        return self.submissions.exists()

    def submissions_count(self):
        return self.submissions.count()

    def has_notes(self):
        return self.notes_count() > 0

    def notes_count(self):
        submissions_notes_count = (
            self.submissions.annotate(notes_count=Count("notes")).aggregate(
                total=Sum("notes_count")
            )["total"]
            or 0
        )

        return submissions_notes_count

    def tags(self):
        content_type = ContentType.objects.get_for_model(self)
        tagged_items = TaggedItem.objects.filter(
            content_type=content_type, object_id=self.id
        )
        return [item.tag for item in tagged_items]

    def solutions(self):
        return self.submission_set.filter(is_solution=True)

    def __str__(self):
        return str(self.leetcode_number) + " " + self.title

    # def has_resources(self):
    #     pass

    # def resources_count(self):
    #     problem_resources_count = self.resources.count()
    #     submission_resources_count = (
    #         self.submissions.annotate(resources_count=Count("resources")).aggregate(
    #             total=Sum("resources_count")
    #         )["total"]
    #         or 0
    #     )

    #     problem_notes_resources_count = (
    #         self.notes.annotate(resources_count=Count("resources")).aggregate(
    #             total=Sum("resources_count")
    #         )["total"]
    #         or 0
    #     )

    #     return (
    #         problem_resources_count
    #         + submission_resources_count
    #         + problem_notes_resources_count
    #     )


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
    )
    submitted_at = models.DateTimeField(default=timezone.now)
    duration = models.PositiveIntegerField(blank=True, null=True)
    is_solution = models.BooleanField(default=False)
    is_interview_mode = models.BooleanField(default=False)
    is_whiteboard_mode = models.BooleanField(default=False)
    time_complexity = models.CharField(
        max_length=20,
        choices=Complexity.choices,
        blank=True,
    )
    space_complexity = models.CharField(
        max_length=20,
        choices=Complexity.choices,
        blank=True,
    )
    methods = models.ManyToManyField("Topic", blank=True)

    def has_notes(self):
        return self.notes.count() > 0

    def notes_count(self):
        return self.notes.count()

    def passed(self):
        non_passing_levels = [
            ProficiencyLevel.NO_UNDERSTANDING,
            ProficiencyLevel.CONCEPTUAL_UNDERSTANDING,
            ProficiencyLevel.NO_PASS,
        ]
        return self.proficiency_level not in non_passing_levels

    def __str__(self):
        submitted_date = self.submitted_at.strftime("%m/%d/%y")
        return f"PID: {self.problem.id} {self.problem.title} - SID: {self.id} - {submitted_date} - {self.proficiency_level}"


class ResourceType(models.TextChoices):
    IMAGE = "image", "image"
    VIDEO = "video", "video"
    ARTICLE = "article", "article"
    SOLUTION_POST = "solution_post", "solution post"


class Resource(models.Model):
    title = models.CharField(max_length=100, blank=True)
    url = models.URLField(max_length=200, blank=True)
    resource_type = models.CharField(
        max_length=100,
        choices=ResourceType.choices,
        blank=True,
    )
    note = models.ForeignKey(
        "Note", on_delete=models.CASCADE, related_name="resources", default=4
    )

    def __str__(self):
        return f"PID: {self.note.submission.problem.id} {self.note.submission.problem.title} - SID: {self.note.submission.id} - NID: {self.note.id} {self.note.title} - RID: {self.id} - {self.title}"


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


class Note(models.Model):
    # question is optional, answer isn't
    submission = models.ForeignKey(
        "Submission", on_delete=models.CASCADE, related_name="notes", default=4
    )
    title = models.CharField(max_length=100, blank=True)
    content = models.TextField(null=False)
    submitted_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_starred = models.BooleanField(default=False)

    start_line_number = models.PositiveIntegerField(blank=True, null=True)
    end_line_number = models.PositiveIntegerField(blank=True, null=True)

    def tags(self):
        content_type = ContentType.objects.get_for_model(self)
        tagged_items = TaggedItem.objects.filter(
            content_type=content_type, object_id=self.id
        )
        return [item.tag for item in tagged_items]

    def save(self, *args, **kwargs):
        # NOTE: Before saving the Note object, check if only start_line_number is provided.
        # If end_line_number is not provided, set end_line_number equal to start_line_number.
        if self.start_line_number is not None and self.end_line_number is None:
            self.end_line_number = self.start_line_number
        super().save(*args, **kwargs)

    def __str__(self):
        return f"PID: {self.submission.problem.id} {self.submission.problem.title} - SID: {self.submission.id} - NID: {self.id} - {self.title}"


class Company(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
