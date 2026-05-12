from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from .models import User, Domain, Stage, Progress, Question, Reply, Skill, SkillProgress, StudyGroupMessage

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    role = serializers.CharField(required=False)

    def validate(self, attrs):
        data = super().validate(attrs)
        role = self.initial_data.get('role', 'student').lower()
        
        # Admin check
        if role == 'admin' and not (self.user.is_superuser or self.user.is_staff):
            raise AuthenticationFailed('You are not authorized to login as Admin.')
            
        # Student/Senior check
        if role != 'admin' and self.user.role != role:
            raise AuthenticationFailed(f'You are not authorized to login as {role.capitalize()}.')
            
        return data

class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    following_count = serializers.SerializerMethodField()
    mentor_badge = serializers.SerializerMethodField()
    replies_count = serializers.SerializerMethodField()

    questions_count = serializers.SerializerMethodField()
    best_answers_count = serializers.SerializerMethodField()
    experience = serializers.SerializerMethodField()
    achievements = serializers.SerializerMethodField()
    interests = serializers.SerializerMethodField()
    social_links = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'domain', 'has_switched_domain', 
            'is_progress_public', 'college', 'year', 'needs_help', 'following', 
            'following_count', 'mentor_badge', 'replies_count', 'questions_count', 'best_answers_count',
            'profile_photo', 'about', 'skills', 'education', 'experience', 
            'achievements', 'interests', 'social_links', 'reputation_points', 'bookmarks'
        ]
        read_only_fields = ['role', 'has_switched_domain', 'following', 'following_count', 'mentor_badge', 'replies_count', 'questions_count', 'best_answers_count', 'reputation_points']

    def get_following_count(self, obj):
        return obj.following.count()
        
    def get_replies_count(self, obj):
        return obj.replies.count()

    def get_questions_count(self, obj):
        return obj.questions.count()

    def get_best_answers_count(self, obj):
        return obj.replies.filter(is_best_answer=True).count()

    def get_mentor_badge(self, obj):
        if obj.role != 'senior':
            return None
        if obj.reputation_points >= 500:
            return 'Gold'
        elif obj.reputation_points >= 200:
            return 'Silver'
        elif obj.reputation_points >= 50:
            return 'Bronze'
        return None

    def get_experience(self, obj):
        return obj.experience # Assuming experience is a JSONField or similar
    
    def get_achievements(self, obj):
        return obj.achievements # Assuming achievements is a JSONField or similar

    def get_interests(self, obj):
        return obj.interests # Assuming interests is a JSONField or similar

    def get_social_links(self, obj):
        return obj.social_links # Assuming social_links is a JSONField or similar

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'college', 'year']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'student'),
            college=validated_data.get('college', ''),
            year=validated_data.get('year', '')
        )
        return user

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'title', 'order']

class StageSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = Stage
        fields = ['id', 'domain', 'title', 'description', 'order', 'learning_resources', 'practice_exercises', 'skills']

class ProgressSerializer(serializers.ModelSerializer):
    stage = StageSerializer(read_only=True)

    class Meta:
        model = Progress
        fields = ['id', 'stage', 'unlocked', 'completed', 'completed_at']

class ReplySerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    author_photo = serializers.URLField(source='author.profile_photo', read_only=True)
    mentor_badge = serializers.CharField(source='author.mentor_badge', read_only=True)
    upvote_count = serializers.SerializerMethodField()
    has_upvoted = serializers.SerializerMethodField()

    class Meta:
        model = Reply
        fields = ['id', 'question', 'author', 'author_name', 'author_photo', 'mentor_badge', 'content', 'is_best_answer', 'upvote_count', 'has_upvoted', 'created_at']
        read_only_fields = ['author', 'question', 'is_best_answer']

    def get_upvote_count(self, obj):
        return len(obj.upvotes.all())

    def get_has_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.upvotes.all()
        return False

class QuestionSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_photo = serializers.SerializerMethodField()
    author_college = serializers.SerializerMethodField()
    domain_name = serializers.CharField(source='domain.name', read_only=True)
    reply_count = serializers.SerializerMethodField()
    upvote_count = serializers.SerializerMethodField()
    has_upvoted = serializers.SerializerMethodField()
    has_bookmarked = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id', 'author', 'author_name', 'author_photo', 'author_college', 'domain', 'domain_name', 
            'title', 'content', 'tags', 'views', 'is_anonymous', 'upvote_count', 'has_upvoted', 'has_bookmarked',
            'created_at', 'reply_count', 'replies'
        ]
        read_only_fields = ['author', 'domain', 'views']

    def get_author_name(self, obj):
        if obj.is_anonymous:
            return "Anonymous Student"
        return obj.author.username
        
    def get_author_photo(self, obj):
        if obj.is_anonymous:
            return None
        return obj.author.profile_photo
        
    def get_author_college(self, obj):
        if obj.is_anonymous:
            return ""
        return obj.author.college

    def get_reply_count(self, obj):
        return len(obj.replies.all())

    def get_upvote_count(self, obj):
        return len(obj.upvotes.all())

    def get_has_upvoted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.upvotes.all()
        return False
        
    def get_has_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.bookmarks.filter(id=obj.id).exists()
        return False

    def get_replies(self, obj):
        replies = obj.replies.all()
        return ReplySerializer(replies, many=True, context=self.context).data

class StudyGroupMessageSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = StudyGroupMessage
        fields = ['id', 'domain', 'author', 'author_name', 'content', 'created_at']
        read_only_fields = ['domain', 'author']

from .models import Notification
class NotificationSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source='actor.username', read_only=True)
    actor_photo = serializers.URLField(source='actor.profile_photo', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'actor', 'actor_name', 'actor_photo', 'message', 'action_type', 'link', 'is_read', 'created_at']
