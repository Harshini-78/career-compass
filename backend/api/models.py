from django.db import models
from django.contrib.auth.models import AbstractUser

class Domain(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('senior', 'Senior'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    domain = models.ForeignKey(Domain, on_delete=models.SET_NULL, null=True, blank=True)
    has_switched_domain = models.BooleanField(default=False)
    is_progress_public = models.BooleanField(default=True)
    college = models.CharField(max_length=255, null=True, blank=True)
    year = models.CharField(max_length=50, null=True, blank=True)
    needs_help = models.BooleanField(default=False)
    following = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='followers')
    
    # New Profile Fields
    profile_photo = models.URLField(max_length=500, null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=list, blank=True)
    experience = models.JSONField(default=list, blank=True)
    achievements = models.JSONField(default=list, blank=True)
    interests = models.JSONField(default=list, blank=True)
    social_links = models.JSONField(default=dict, blank=True)
    
    # Community & Reputation Fields
    reputation_points = models.IntegerField(default=0)
    bookmarks = models.ManyToManyField('Question', related_name='bookmarked_by', blank=True)

    def switch_domain(self, new_domain):
        if not self.has_switched_domain:
            self.domain = new_domain
            self.has_switched_domain = True
            self.save()
            return True
        return False
        
    def get_progress_percentage(self):
        if not self.domain:
            return 0
        total_stages = Stage.objects.filter(domain=self.domain).count()
        if total_stages == 0:
            return 0
        completed_stages = Progress.objects.filter(user=self, completed=True, stage__domain=self.domain).count()
        return round((completed_stages / total_stages) * 100)

class Stage(models.Model):
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE, related_name='stages')
    title = models.CharField(max_length=255)
    description = models.TextField()
    order = models.PositiveIntegerField()
    learning_resources = models.JSONField(default=list, blank=True)
    practice_exercises = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['order']
        unique_together = ('domain', 'order')

    def __str__(self):
        return f"{self.domain.name} - Stage {self.order}: {self.title}"

class Progress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE)
    unlocked = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'stage')

    def complete_stage(self):
        if self.unlocked and not self.completed:
            # Verify all skills are completed
            total_skills = self.stage.skills.count()
            if total_skills > 0:
                completed_skills = SkillProgress.objects.filter(user=self.user, skill__stage=self.stage, completed=True).count()
                if completed_skills < total_skills:
                    return False

            self.completed = True
            from django.utils import timezone
            self.completed_at = timezone.now()
            self.save()
            
            # Unlock next stage
            next_stage = Stage.objects.filter(domain=self.stage.domain, order__gt=self.stage.order).order_by('order').first()
            if next_stage:
                Progress.objects.get_or_create(user=self.user, stage=next_stage, defaults={'unlocked': True})
            return True
        return False

class Skill(models.Model):
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE, related_name='skills')
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']
        unique_together = ('stage', 'order')

    def __str__(self):
        return f"{self.stage.title} - Skill {self.order}: {self.title}"

class SkillProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skill_progress')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'skill')

class Question(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questions')
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE, related_name='questions')
    title = models.CharField(max_length=255)
    content = models.TextField()
    tags = models.JSONField(default=list, blank=True)
    views = models.PositiveIntegerField(default=0)
    is_anonymous = models.BooleanField(default=False)
    upvotes = models.ManyToManyField(User, related_name='upvoted_questions', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Reply(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='replies')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='replies')
    content = models.TextField()
    is_best_answer = models.BooleanField(default=False)
    upvotes = models.ManyToManyField(User, related_name='upvoted_replies', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Reply by {self.author.username} on {self.question.title}"

class StudyGroupMessage(models.Model):
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username} in {self.domain.name}: {self.content[:20]}"

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    actor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='actions', null=True, blank=True)
    message = models.CharField(max_length=255)
    action_type = models.CharField(max_length=50) # 'reply', 'like_reply', 'best_answer'
    link = models.CharField(max_length=500, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient.username} - {self.message}"
