from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView, UserProfileView, 
    InstructorListView, InstructorDetailView, AdminUserManagementViewSet, 
    AdminStatsView, StudentInstructorApplicationView, AdminInstructorApplicationViewSet
)

router = DefaultRouter()
router.register(r'admin/users', AdminUserManagementViewSet, basename='admin-users')
router.register(r'admin/applications', AdminInstructorApplicationViewSet, basename='admin-applications')

urlpatterns = [
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('instructors/', InstructorListView.as_view(), name='instructors'),
    path('instructors/<int:pk>/', InstructorDetailView.as_view(), name='instructor_detail'),
    path('applications/', StudentInstructorApplicationView.as_view(), name='applications'),
]