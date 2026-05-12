from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView, RegisterView, DomainListView, SelectDomainView,
    DashboardView, MentorDashboardView, CompleteStageView,
    CompleteStageByNumberView, SkillToggleView, ProfileView,
    LeaderboardView, CommunityView, QuestionListView,
    QuestionDetailView, ReplyCreateView, PublicProfileView,
    TargetFollowView, StudyGroupMessageListCreateView,
    ToggleUpvoteView, ToggleReplyUpvoteView, MarkBestAnswerView,
    ToggleQuestionBookmarkView, NotificationListView,
    MarkNotificationReadView, MarkAllNotificationsReadView,
    TrendingQuestionsListView
)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('domains/', DomainListView.as_view(), name='domain_list'),
    path('domains/select/', SelectDomainView.as_view(), name='domain_select'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('mentor/dashboard/', MentorDashboardView.as_view(), name='mentor_dashboard'),
    path('stages/<int:stage_id>/complete/', CompleteStageView.as_view(), name='complete_stage'),
    path('complete-stage/<int:stage_number>/', CompleteStageByNumberView.as_view(), name='complete_stage_by_number'),
    path('skills/<int:skill_id>/toggle/', SkillToggleView.as_view(), name='skill_toggle'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('community/', CommunityView.as_view(), name='community'),
    path('questions/', QuestionListView.as_view(), name='question_list'),
    path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question_detail'),
    path('questions/<int:question_id>/reply/', ReplyCreateView.as_view(), name='reply_create'),
    path('questions/<int:question_id>/upvote/', ToggleUpvoteView.as_view(), name='toggle_upvote'),
    path('users/<int:user_id>/profile/', PublicProfileView.as_view(), name='public_profile'),
    path('users/<int:user_id>/toggle-follow/', TargetFollowView.as_view(), name='toggle_follow'),
    path('community/chat/', StudyGroupMessageListCreateView.as_view(), name='community_chat'),
    path('replies/<int:reply_id>/upvote/', ToggleReplyUpvoteView.as_view(), name='toggle_reply_upvote'),
    path('replies/<int:reply_id>/best/', MarkBestAnswerView.as_view(), name='mark_best_answer'),
    path('questions/<int:question_id>/bookmark/', ToggleQuestionBookmarkView.as_view(), name='toggle_bookmark'),
    path('trending/questions/', TrendingQuestionsListView.as_view(), name='trending_questions'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:notification_id>/read/', MarkNotificationReadView.as_view(), name='mark_notification_read'),
    path('notifications/read-all/', MarkAllNotificationsReadView.as_view(), name='mark_all_notifications_read'),
]
