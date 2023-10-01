from django.db import models
from polymorphic.models import PolymorphicModel


class Difficulty(models.TextChoices):
    EASY = "easy", "easy"
    MEDIUM = "medium", "medium"
    HARD = "hard", "hard"


class Complexity(models.TextChoices):
    O_N = "n", "n"
    O_LOGN = "logn", "logn"
    O_NLOGN = "nlogn", "nlogn"
    O_N2 = "n2", "n2"
    O_N3 = "n3", "n3"


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
        max_length=5,
        choices=Complexity.choices,
        default=Complexity.O_N,
        db_index=True,
        blank=True,
        null=True,
    )
    space_complexity_requirement = models.CharField(
        max_length=5,
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
        "Source", on_delete=models.DO_NOTHING, blank=True, null=True
    )

    url = models.URLField(max_length=200, blank=True, null=True)
    lintcode_equivalent_problem_number = models.IntegerField(blank=True, null=True)
    lintcode_equivalent_problem_url = models.URLField(
        max_length=200, blank=True, null=True
    )

    def best_solutions(self):
        return self.submission_set.filter(is_best=True)

    def starred_notes(self):
        return self.problemnote_set.filter(is_starred=True)

    def __str__(self):
        return self.title


class Submission(models.Model):
    problem = models.ForeignKey("Problem", on_delete=models.CASCADE)
    code = models.TextField()
    passed = models.BooleanField()
    proficiency_level = models.CharField(
        max_length=100,
        choices=ProficiencyLevel.choices,
        default=ProficiencyLevel.NO_UNDERSTANDING,
    )
    submitted_at = models.DateTimeField()
    duration = models.DurationField(blank=True, null=True)
    is_best = models.BooleanField(default=False)
    reference_solution_url = models.URLField(blank=True, null=True)
    # method used to solve the problem; e.g. recursion, iteration, DP, etc.
    # note that this is similar to the "topic" field in Problem model,
    # so this can have multiple values as well
    method = models.ForeignKey("Method", on_delete=models.DO_NOTHING)

    def __str__(self):
        return f"{self.problem.title} - passed: {self.passed}"


class SubmissionPicture(models.Model):
    submission = models.ForeignKey("Submission", on_delete=models.CASCADE)
    url = models.URLField(max_length=200)


class NoteTypeChoices(models.TextChoices):
    INTUITION = "intuition", "intuition"
    STUCK_POINT = "stuck_point", "stuck point"
    QNA = "qna", "qna"
    ERR = "err", "err"


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
        default=NoteTypeChoices.INTUITION,
        blank=True,
        null=True,
    )


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
