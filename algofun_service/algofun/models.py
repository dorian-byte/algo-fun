from django.db import models
from polymorphic.models import PolymorphicModel
from django.utils import timezone


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


class ProficiencyLevel(models.TextChoices):
    NO_UNDERSTANDING = "no_understanding", "no understanding"
    CONCEPTUAL_UNDERSTANDING = (
        "conceptual_understanding",
        "conceptual understanding",
    )
    BORROWED_SOLUTION = "borrowed_solution", "borrowed solution"
    CODED_NO_PASS = "coded_no_pass", "coded no pass"
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


class Method(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Problem(models.Model):
    title = models.CharField(max_length=100, unique=True, db_index=True)
    leetcode_number = models.IntegerField(unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    difficulty = models.CharField(
        max_length=6,
        choices=Difficulty.choices,
        default=Difficulty.EASY,
        db_index=True,
        blank=True,
        null=True,
    )
    time_complexity_requirement = models.CharField(
        max_length=20,
        choices=Complexity.choices,
        default=Complexity.O_N,
        db_index=True,
        blank=True,
        null=True,
    )
    space_complexity_requirement = models.CharField(
        max_length=20,
        choices=Complexity.choices,
        default=Complexity.O_N,
        db_index=True,
        blank=True,
        null=True,
    )

    companies = models.ManyToManyField("Company", blank=True)
    topics = models.ManyToManyField("Topic", blank=True)

    # source has where this problem comes from, e.g. leetcode, jzoffer, etc.
    # this should be a multiple choice field with multiple values allowed
    source = models.ForeignKey(
        "Source", on_delete=models.SET_NULL, blank=True, null=True
    )

    url = models.URLField(max_length=200, blank=True, null=True)
    lintcode_equivalent_problem_number = models.IntegerField(blank=True, null=True)
    lintcode_equivalent_problem_url = models.URLField(
        max_length=200, blank=True, null=True
    )

    def resources(self):
        return self.problemresource_set.all()

    def best_solutions(self):
        return self.submission_set.filter(is_best=True)

    def starred_notes(self):
        return self.problemnote_set.filter(is_starred=True)

    def __str__(self):
        return self.title


class Submission(models.Model):
    # NOTE: using string reference (e.g. "Problem") to avoid circular dependency
    problem = models.ForeignKey("Problem", on_delete=models.CASCADE)
    code = models.TextField(blank=True)
    passed = models.BooleanField()
    proficiency_level = models.CharField(
        max_length=100,
        choices=ProficiencyLevel.choices,
        default=ProficiencyLevel.NO_UNDERSTANDING,
    )
    submitted_at = models.DateTimeField(default=timezone.now)
    duration = models.IntegerField(blank=True, null=True)
    is_best = models.BooleanField(default=False)
    is_interview_mode = models.BooleanField(default=False)
    methods = models.ManyToManyField("Topic", blank=True)

    def __str__(self):
        return f"{self.problem.title} - passed: {self.passed}"


class ResourceType(models.TextChoices):
    IMAGE = "image", "image"
    VIDEO = "video", "video"
    ARTICLE = "article", "article"
    SOLUTION_POST = "solution_post", "solution post"


class Resource(PolymorphicModel):
    title = models.CharField(max_length=100, unique=True, db_index=True)
    url = models.URLField(max_length=200, blank=True, null=True)
    resource_type = models.CharField(
        max_length=100,
        choices=ResourceType.choices,
        default=ResourceType.SOLUTION_POST,
        blank=True,
        null=True,
    )


class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True)
    resource = models.ForeignKey("Resource", on_delete=models.CASCADE)


class ProblemResource(Resource):
    problem = models.ForeignKey("Problem", on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class SubmissionResource(Resource):
    submission = models.ForeignKey("Submission", on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class NoteResource(Resource):
    note = models.ForeignKey("Note", on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class NoteTypeChoices(models.TextChoices):
    INTUITION = "intuition", "intuition"
    STUCK_POINT = "stuck_point", "stuck point"
    QNA = "qna", "qna"
    ERR = "err", "err"
    MEMO = "memo", "memo"


class Note(PolymorphicModel):
    # question is optional, answer isn't
    title = models.TextField(blank=True, null=True)
    content = models.TextField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_starred = models.BooleanField(default=False)
    note_type = models.CharField(
        max_length=100,
        choices=NoteTypeChoices.choices,
        blank=True,
        null=True,
    )
    start_line_number = models.IntegerField(blank=True, null=True)
    end_line_number = models.IntegerField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # NOTE: Before saving the Note object, check if only start_line_number is provided.
        # If end_line_number is not provided, set end_line_number equal to start_line_number.
        if self.start_line_number is not None and self.end_line_number is None:
            self.end_line_number = self.start_line_number
        super().save(*args, **kwargs)


class ProblemNote(Note):
    problem = models.ForeignKey("Problem", on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class SubmissionNote(Note):
    submission = models.ForeignKey("Submission", on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Company(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
