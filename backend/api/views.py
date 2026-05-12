from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from django.db import models
from django.db.models import Count, Q
from django.core.cache import cache
from .models import User, Domain, Stage, Progress, Question, Reply, Skill, SkillProgress, StudyGroupMessage, Notification
from .serializers import (
    UserSerializer, RegisterSerializer, DomainSerializer, 
    StageSerializer, ProgressSerializer, QuestionSerializer, ReplySerializer,
    SkillSerializer, StudyGroupMessageSerializer, NotificationSerializer,
    CustomTokenObtainPairSerializer
)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class DomainListView(generics.ListAPIView):
    queryset = Domain.objects.all()
    serializer_class = DomainSerializer
    permission_classes = (permissions.IsAuthenticated,)

class SelectDomainView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        domain_id = request.data.get('domain_id')
        try:
            domain = Domain.objects.get(id=domain_id)
            if request.user.switch_domain(domain):
                # Unlock first stage
                first_stage = Stage.objects.filter(domain=domain).order_by('order').first()
                if first_stage:
                    Progress.objects.get_or_create(user=request.user, stage=first_stage, defaults={'unlocked': True})
                return Response({'status': 'Domain updated'}, status=status.HTTP_200_OK)
            return Response({'error': 'Domain can only be switched once'}, status=status.HTTP_400_BAD_REQUEST)
        except Domain.DoesNotExist:
            return Response({'error': 'Domain not found'}, status=status.HTTP_404_NOT_FOUND)

class DashboardView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        if not user.domain:
            return Response({'error': 'No domain selected'}, status=status.HTTP_400_BAD_REQUEST)

        total_stages = Stage.objects.filter(domain=user.domain).count()
        progresses = Progress.objects.filter(user=user, stage__domain=user.domain)
        
        unlocked_stages = progresses.filter(unlocked=True).count()
        
        # Fallback: if user has no unlocked stages but stages exist, unlock the first one
        if unlocked_stages == 0 and total_stages > 0:
            first_stage = Stage.objects.filter(domain=user.domain).order_by('order').first()
            if first_stage:
                Progress.objects.get_or_create(user=user, stage=first_stage, defaults={'unlocked': True})
                # Refetch progresses
                progresses = Progress.objects.filter(user=user, stage__domain=user.domain)
                unlocked_stages = progresses.filter(unlocked=True).count()

        completed_stages = progresses.filter(completed=True).count()
        remaining_stages = total_stages - completed_stages
        progress_percentage = user.get_progress_percentage()
        is_completed = completed_stages == total_stages and total_stages > 0

        # Get skill progress
        skill_progresses = SkillProgress.objects.filter(user=user, skill__stage__domain=user.domain)

        # Also return the stages 
        stages = Stage.objects.prefetch_related('skills').filter(domain=user.domain).order_by('order')
        stages_data = []
        for stage in stages:
            prog = progresses.filter(stage=stage).first()
            skills_data = []
            for skill in stage.skills.all():
                sk_prog = skill_progresses.filter(skill=skill).first()
                skills_data.append({
                    'id': skill.id,
                    'title': skill.title,
                    'order': skill.order,
                    'completed': sk_prog.completed if sk_prog else False
                })

            stages_data.append({
                'id': stage.id,
                'title': stage.title,
                'description': stage.description,
                'order': stage.order,
                'learning_resources': stage.learning_resources,
                'practice_exercises': stage.practice_exercises,
                'unlocked': prog.unlocked if prog else False,
                'completed': prog.completed if prog else False,
                'skills': skills_data
            })

        return Response({
            'domain': user.domain.name,
            'user_role': user.role,
            'total_stages': total_stages,
            'unlocked_stages': unlocked_stages,
            'completed_stages': completed_stages,
            'remaining_stages': remaining_stages,
            'progress_percentage': progress_percentage,
            'is_completed': is_completed,
            'stages': stages_data
        })

class MentorDashboardView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        if user.role != 'senior':
            return Response({'error': 'Only seniors can view mentor dashboard'}, status=status.HTTP_403_FORBIDDEN)
            
        domain = user.domain
        if not domain:
            return Response({'error': 'No domain selected for mentor'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Get count of questions in domain that need answers (0 replies)
        unanswered_qs = Question.objects.filter(domain=domain).annotate(reply_count=Count('replies')).filter(reply_count=0).count()
        
        # Get count of distinct students helped (students whose questions this mentor replied to)
        helped_count = Reply.objects.filter(author=user).values('question__author').distinct().count()
        
        # Total answers provided
        total_answers = Reply.objects.filter(author=user).count()

        # Upvotes received on questions they answered
        upvotes_received = Question.objects.filter(replies__author=user).annotate(upvote_count=Count('upvotes')).aggregate(total_upvotes=models.Sum('upvote_count'))['total_upvotes'] or 0

        recent_questions = Question.objects.select_related('author', 'domain').prefetch_related(
            'upvotes', 'replies__author', 'replies__upvotes'
        ).filter(domain=domain, replies__isnull=True).order_by('-created_at')[:5]
        qs_data = QuestionSerializer(recent_questions, many=True).data
        
        return Response({
            'domain': domain.name,
            'user_role': user.role,
            'students_helped': helped_count,
            'questions_to_answer': unanswered_qs,
            'total_answers': total_answers,
            'upvotes_received': upvotes_received,
            'recent_questions': qs_data
        })

class CompleteStageView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, stage_id):
        try:
            progress = Progress.objects.get(user=request.user, stage_id=stage_id)
            if progress.complete_stage():
                # Clear leaderboard cache since progress changed
                if request.user.domain:
                    cache.delete(f'leaderboard_{request.user.domain.id}')
                return Response({'status': 'Stage completed'}, status=status.HTTP_200_OK)
            return Response({'error': 'Stage not unlocked or already completed'}, status=status.HTTP_400_BAD_REQUEST)
        except Progress.DoesNotExist:
            return Response({'error': 'Progress not found'}, status=status.HTTP_404_NOT_FOUND)

class CompleteStageByNumberView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, stage_number):
        user = request.user
        if not user.domain:
            return Response({'error': 'No domain selected'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            stage = Stage.objects.get(domain=user.domain, order=stage_number)
            progress = Progress.objects.get(user=user, stage=stage)
            if progress.complete_stage():
                # Clear leaderboard cache since progress changed
                cache.delete(f'leaderboard_{user.domain.id}')
                return Response({'status': 'Stage completed'}, status=status.HTTP_200_OK)
            return Response({'error': 'Stage not unlocked or already completed'}, status=status.HTTP_400_BAD_REQUEST)
        except Stage.DoesNotExist:
            return Response({'error': 'Stage not found'}, status=status.HTTP_404_NOT_FOUND)
        except Progress.DoesNotExist:
            return Response({'error': 'Progress not found'}, status=status.HTTP_404_NOT_FOUND)

class SkillToggleView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, skill_id):
        user = request.user
        try:
            skill = Skill.objects.get(id=skill_id)
            # Ensure stage is unlocked
            stage_progress = Progress.objects.filter(user=user, stage=skill.stage).first()
            if not stage_progress or not stage_progress.unlocked:
                return Response({'error': 'Stage is locked'}, status=status.HTTP_400_BAD_REQUEST)

            sk_prog, created = SkillProgress.objects.get_or_create(user=user, skill=skill)
            
            # Toggle logic
            completed_status = request.data.get('completed', None)
            if completed_status is not None:
                # If explicit status is passed (e.g., from checkbox exact state)
                sk_prog.completed = bool(completed_status)
            else:
                sk_prog.completed = not sk_prog.completed
            
            sk_prog.save()

            stage_completed = False
            # If completing, check if stage should also complete
            if sk_prog.completed:
                total_skills = skill.stage.skills.count()
                completed_count = SkillProgress.objects.filter(user=user, skill__stage=skill.stage, completed=True).count()
                
                if total_skills == completed_count:
                    # All skills completed -> auto complete stage
                    if stage_progress.complete_stage():
                        stage_completed = True
                        if user.domain:
                            cache.delete(f'leaderboard_{user.domain.id}')

            return Response({
                'status': 'Skill toggled', 
                'completed': sk_prog.completed,
                'stage_completed': stage_completed
            }, status=status.HTTP_200_OK)
            
        except Skill.DoesNotExist:
            return Response({'error': 'Skill not found'}, status=status.HTTP_404_NOT_FOUND)

class ProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data
        data['progress_percentage'] = request.user.get_progress_percentage()
        return Response(data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            if request.user.domain:
                cache.delete(f'leaderboard_{request.user.domain.id}')
            return Response({'status': 'Profile updated', 'user': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LeaderboardView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        domain = user.domain
        
        # Gamification: Top Mentors
        top_mentors_data = cache.get('top_mentors')
        if not top_mentors_data:
            from django.db.models import Count
            mentors = User.objects.filter(role='senior').order_by('-reputation_points')[:10]
            top_mentors_data = UserSerializer(mentors, many=True).data
            cache.set('top_mentors', top_mentors_data, 60 * 60) # Cache for 1 hour

        if not domain:
            return Response({
                'leaderboard': [],
                'top_mentors': top_mentors_data,
                'your_rank': None,
                'total_participants': 0,
                'ahead_of_percentage': 0
            })

        cache_key = f'leaderboard_{domain.id}'
        leaderboard_data = cache.get(cache_key)

        if not leaderboard_data:
            # We need to sort by progress. Since we have a complex progress calc, 
            # and it's a small app, we can calculate for everyone in domain and sort.
            # In a huge app, we'd cache progress in the user model or do a complex annotation.
            # For this, let's just do a Python-side sort or database annotation.
            
            users = User.objects.filter(role='student', domain=domain, is_progress_public=True)
            leaderboard_list = []
            for u in users:
                leaderboard_list.append({
                    'id': u.id,
                    'username': u.username,
                    'progress_percentage': u.get_progress_percentage()
                })
            
            leaderboard_list.sort(key=lambda x: x['progress_percentage'], reverse=True)
            
            # Assign ranks
            for idx, u in enumerate(leaderboard_list):
                u['rank'] = idx + 1
                
            leaderboard_data = leaderboard_list
            cache.set(cache_key, leaderboard_data, 60 * 15)  # Cache for 15 minutes

        # Find current user's rank
        your_rank = None
        total_participants = len(leaderboard_data)
        ahead_of_percentage = 0

        for u in leaderboard_data:
            if u['id'] == user.id:
                your_rank = u['rank']
                break
                
        if your_rank:
            ahead_of = total_participants - your_rank
            if total_participants > 1:
                ahead_of_percentage = round((ahead_of / (total_participants - 1)) * 100)
            else:
                ahead_of_percentage = 100

        return Response({
            'leaderboard': leaderboard_data,
            'top_mentors': top_mentors_data,
            'your_rank': your_rank,
            'total_participants': total_participants,
            'ahead_of_percentage': ahead_of_percentage
        })

class CommunityView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        domain_id = request.query_params.get('domain')
        year = request.query_params.get('year')
        search = request.query_params.get('search', '')
        needs_help = request.query_params.get('needs_help')
        alumni = request.query_params.get('alumni')

        users = User.objects.filter(role='student', is_progress_public=True).exclude(id=request.user.id)
        
        if domain_id:
            users = users.filter(domain_id=domain_id)
        if year:
            users = users.filter(year__icontains=year)
        if search:
            users = users.filter(username__icontains=search)
        if needs_help == 'true':
            users = users.filter(needs_help=True)

        user_list = []
        for u in users:
            user_stages = Stage.objects.filter(domain=u.domain).order_by('order') if u.domain else []
            current_stage = 0
            for s in user_stages:
                prog = Progress.objects.filter(user=u, stage=s).first()
                if not prog or not prog.completed:
                    current_stage = s.order
                    break
                current_stage = s.order
            
            progress_percentage = u.get_progress_percentage()
            
            if alumni == 'true' and progress_percentage < 100:
                continue

            user_list.append({
                'id': u.id,
                'username': u.username,
                'domain': u.domain.name if u.domain else None,
                'college': u.college or 'Unknown College',
                'year': u.year or 'Unknown Year',
                'stage': current_stage,
                'total_stages': len(user_stages),
                'progress_percentage': progress_percentage,
                'needs_help': u.needs_help,
                'is_followed_by_me': request.user.following.filter(id=u.id).exists()
            })
            
        # Sort and calculate rank percentile for styling
        user_list.sort(key=lambda x: x['progress_percentage'], reverse=True)
        total_users = len(user_list)
        for idx, u_dict in enumerate(user_list):
            rank = idx + 1
            percentile = ((total_users - rank + 1) / total_users) * 100 if total_users > 0 else 100
            u_dict['rank_percentile'] = min(percentile, 100)

        return Response(user_list)

class PublicProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, user_id):
        try:
            target_user = User.objects.get(id=user_id, is_progress_public=True)
        except User.DoesNotExist:
            return Response({'error': 'User not found or private'}, status=status.HTTP_404_NOT_FOUND)
            
        domain = target_user.domain
        if not domain:
            return Response({'error': 'User has no domain'}, status=status.HTTP_400_BAD_REQUEST)
            
        stages = Stage.objects.filter(domain=domain).order_by('order')
        stages_data = []
        
        for s in stages:
            stage_prog = Progress.objects.filter(user=target_user, stage=s).first()
            skills = Skill.objects.filter(stage=s).order_by('order')
            skills_data = []
            
            for sk in skills:
                sk_prog = SkillProgress.objects.filter(user=target_user, skill=sk).first()
                skills_data.append({
                    'id': sk.id,
                    'title': sk.title,
                    'completed': sk_prog.completed if sk_prog else False
                })
                
            stages_data.append({
                'id': s.id,
                'order': s.order,
                'title': s.title,
                'description': s.description,
                'unlocked': stage_prog.unlocked if stage_prog else False,
                'completed': stage_prog.completed if stage_prog else False,
                'skills': skills_data
            })
            
        return Response({
            'username': target_user.username,
            'college': target_user.college,
            'year': target_user.year,
            'domain': domain.name,
            'progress_percentage': target_user.get_progress_percentage(),
            'stages': stages_data,
            'needs_help': target_user.needs_help,
        })

class TargetFollowView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, user_id):
        if request.user.id == int(user_id):
            return Response({'error': 'Cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            target_user = User.objects.get(id=user_id)
            if request.user.following.filter(id=user_id).exists():
                request.user.following.remove(target_user)
                return Response({'status': 'Unfollowed'})
            else:
                request.user.following.add(target_user)
                return Response({'status': 'Followed'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class StudyGroupMessageListCreateView(generics.ListCreateAPIView):
    serializer_class = StudyGroupMessageSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        domain_id = self.request.query_params.get('domain')
        if domain_id:
            return StudyGroupMessage.objects.filter(domain_id=domain_id).order_by('created_at')
        elif self.request.user.domain:
            return StudyGroupMessage.objects.filter(domain=self.request.user.domain).order_by('created_at')
        return StudyGroupMessage.objects.none()

    def perform_create(self, serializer):
        domain_id = self.request.query_params.get('domain') or self.request.data.get('domain')
        if not domain_id:
            # check if user has domain
            if not self.request.user.domain:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'error': 'No domain provided or selected.'})
            domain_id = self.request.user.domain.id
        serializer.save(author=self.request.user, domain_id=domain_id)

class QuestionListView(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        # We can order by -created_at but we can also order by upvotes count using annotation
        # For simplicity we'll just order by -created_at as specified, but also annotate upvotes 
        from django.db.models import Count
        qs = Question.objects.select_related('author', 'domain').prefetch_related(
            'upvotes', 'replies__author', 'replies__upvotes'
        ).annotate(upvote_count=Count('upvotes', distinct=True)).order_by('-created_at', '-upvote_count')
        search = self.request.query_params.get('search')
        tag = self.request.query_params.get('tag')
        bookmarked = self.request.query_params.get('bookmarked')
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(content__icontains=search))
        if tag:
            # Simple string search inside JSON via string casting, robust enough for our tags
            qs = qs.filter(tags__icontains=tag)
        if bookmarked == 'true':
            qs = qs.filter(id__in=self.request.user.bookmarks.all())
        return qs

    def perform_create(self, serializer):
        if not self.request.user.domain:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'error': 'You must select a domain before posting a question.'})
        serializer.save(author=self.request.user, domain=self.request.user.domain)

class QuestionDetailView(generics.RetrieveAPIView):
    queryset = Question.objects.select_related('author', 'domain').prefetch_related(
        'upvotes', 'replies__author', 'replies__upvotes'
    )
    serializer_class = QuestionSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class ReplyCreateView(generics.CreateAPIView):
    serializer_class = ReplySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        question_id = self.kwargs.get('question_id')
        question = Question.objects.get(id=question_id)
        reply = serializer.save(author=self.request.user, question=question)

        # Gamification
        if self.request.user.role == 'senior':
            self.request.user.reputation_points += 10
            self.request.user.save(update_fields=['reputation_points'])
            cache.delete('top_mentors')
            
        # Notification
        if question.author != self.request.user:
            Notification.objects.create(
                recipient=question.author,
                actor=self.request.user,
                message="answered your question.",
                action_type='reply',
                link=f"/community/question/{question.id}"
            )

class ToggleUpvoteView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
            if request.user in question.upvotes.all():
                question.upvotes.remove(request.user)
                return Response({'status': 'Upvote removed'})
            else:
                question.upvotes.add(request.user)
                return Response({'status': 'Upvote added'})
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)

class ToggleReplyUpvoteView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, reply_id):
        try:
            reply = Reply.objects.get(id=reply_id)
            if request.user in reply.upvotes.all():
                reply.upvotes.remove(request.user)
                if reply.author.role == 'senior':
                    reply.author.reputation_points -= 5
                    reply.author.save(update_fields=['reputation_points'])
                return Response({'status': 'Upvote removed'})
            else:
                reply.upvotes.add(request.user)
                if reply.author.role == 'senior':
                    reply.author.reputation_points += 5
                    reply.author.save(update_fields=['reputation_points'])
                
                # Notification
                if reply.author != request.user:
                    Notification.objects.create(
                        recipient=reply.author,
                        actor=request.user,
                        message="liked your answer.",
                        action_type='like_reply'
                    )
                return Response({'status': 'Upvote added'})
        except Reply.DoesNotExist:
            return Response({'error': 'Reply not found'}, status=status.HTTP_404_NOT_FOUND)

class MarkBestAnswerView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, reply_id):
        try:
            reply = Reply.objects.get(id=reply_id)
            question = reply.question
            if question.author != request.user:
                return Response({'error': 'Only the question author can mark the best answer'}, status=status.HTTP_403_FORBIDDEN)
            
            old_best = question.replies.filter(is_best_answer=True).first()
            if old_best:
                old_best.is_best_answer = False
                old_best.save(update_fields=['is_best_answer'])
                if old_best == reply:
                    return Response({'status': 'Already best answer'})
            
            reply.is_best_answer = True
            reply.save(update_fields=['is_best_answer'])

            if reply.author.role == 'senior':
                reply.author.reputation_points += 25
                reply.author.save(update_fields=['reputation_points'])
                cache.delete('top_mentors')

            if reply.author != request.user:
                Notification.objects.create(
                    recipient=reply.author,
                    actor=request.user,
                    message="marked your answer as Best Answer!",
                    action_type='best_answer'
                )

            return Response({'status': 'Marked as best answer'})
        except Reply.DoesNotExist:
            return Response({'error': 'Reply not found'}, status=status.HTTP_404_NOT_FOUND)

class ToggleQuestionBookmarkView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
            if request.user.bookmarks.filter(id=question_id).exists():
                request.user.bookmarks.remove(question)
                return Response({'status': 'Bookmark removed'})
            else:
                request.user.bookmarks.add(question)
                return Response({'status': 'Bookmark added'})
        except Question.DoesNotExist:
             return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)[:50]

class MarkNotificationReadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, notification_id):
        try:
            notif = Notification.objects.get(id=notification_id, recipient=request.user)
            notif.is_read = True
            notif.save(update_fields=['is_read'])
            return Response({'status': 'Marked as read'})
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

class MarkAllNotificationsReadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'All marked as read'})

class TrendingQuestionsListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        from django.db.models import Count
        qs = Question.objects.select_related('author', 'domain').prefetch_related(
            'upvotes', 'replies__author', 'replies__upvotes'
        ).annotate(
            upvote_count=Count('upvotes', distinct=True),
            reply_c=Count('replies', distinct=True)
        ).order_by('-views', '-reply_c', '-upvote_count')[:10]
        return qs

