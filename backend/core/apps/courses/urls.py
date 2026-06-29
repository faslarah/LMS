from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, CourseViewSet, SectionViewSet,
    EnrollmentViewSet, WishlistViewSet, ReviewViewSet, 
    DiscussionViewSet, AdminCourseViewSet, CertificateViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'sections', SectionViewSet, basename='section')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'wishlists', WishlistViewSet, basename='wishlist')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'discussions', DiscussionViewSet, basename='discussion')
router.register(r'certificates', CertificateViewSet, basename='certificate')
router.register(r'admin/courses', AdminCourseViewSet, basename='admin-courses')
router.register(r'', CourseViewSet, basename='course')  # Mount courses at /api/courses/

urlpatterns = [
    path('', include(router.urls)),
]