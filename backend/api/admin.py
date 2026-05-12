from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Domain, Stage, Progress, Skill, SkillProgress, 
    Question, Reply, StudyGroupMessage, Notification
)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'domain', 'reputation_points')
    fieldsets = UserAdmin.fieldsets + (
        ('CareerCompass Profile', {
            'fields': (
                'role', 'domain', 'college', 'year', 'needs_help',
                'is_progress_public', 'reputation_points'
            )
        }),
    )

@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Stage)
class StageAdmin(admin.ModelAdmin):
    list_display = ('domain', 'order', 'title')
    list_filter = ('domain',)
    ordering = ('domain', 'order')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('stage', 'order', 'title')
    list_filter = ('stage__domain',)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'domain', 'created_at')
    list_filter = ('domain',)

@admin.register(Reply)
class ReplyAdmin(admin.ModelAdmin):
    list_display = ('question', 'author', 'is_best_answer', 'created_at')

admin.site.register(Progress)
admin.site.register(SkillProgress)
admin.site.register(StudyGroupMessage)
admin.site.register(Notification)
