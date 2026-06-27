from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, CourseViewSet, SectionViewSet,
    LessonViewSet, VideoViewSet, EnrollmentViewSet,
    WishlistViewSet, ReviewViewSet, DiscussionViewSet, AdminCourseViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'sections', SectionViewSet, basename='section')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'wishlists', WishlistViewSet, basename='wishlist')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'discussions', DiscussionViewSet, basename='discussion')
router.register(r'admin/courses', AdminCourseViewSet, basename='admin-courses')
router.register(r'', CourseViewSet, basename='course')  # Mount courses at /api/courses/

urlpatterns = [
    path('', include(router.urls)),
]