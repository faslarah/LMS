from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Course, Section, Lesson, Video, Enrollment, Wishlist, Review, LessonProgress
from .serializers import (
    CategorySerializer, CourseSerializer, SectionSerializer,
    LessonSerializer, VideoSerializer, EnrollmentSerializer,
    WishlistSerializer, ReviewSerializer, DiscussionSerializer
)


class IsInstructorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['instructor', 'admin']


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category__slug', 'difficulty', 'instructor']
    search_fields = ['title', 'subtitle']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsInstructorOrAdmin()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'instructor':
            # Instructors see their own courses, published or not
            return Course.objects.filter(instructor=user)
        # Students see published courses
        return Course.objects.filter(is_published=True)

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        enrollment, created = Enrollment.objects.get_or_create(student=request.user, course=course)
        if not created:
            return Response({'message': 'Already enrolled'}, status=status.HTTP_200_OK)
        return Response({'message': 'Enrolled successfully'}, status=status.HTTP_201_CREATED)


    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_wishlist(self, request, pk=None):
        course = self.get_object()
        wishlist_item = Wishlist.objects.filter(student=request.user, course=course).first()
        if wishlist_item:
            wishlist_item.delete()
            return Response({'message': 'Removed from wishlist', 'is_wishlisted': False}, status=status.HTTP_200_OK)
        Wishlist.objects.create(student=request.user, course=course)
        return Response({'message': 'Added to wishlist', 'is_wishlisted': True}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_progress(self, request, pk=None):
        course = self.get_object()
        lesson_id = request.data.get('lesson_id')
        try:
            lesson = Lesson.objects.get(id=lesson_id, section__course=course)
            progress, created = LessonProgress.objects.get_or_create(student=request.user, lesson=lesson)
            progress.is_completed = not progress.is_completed
            progress.save()
            return Response({'message': 'Progress toggled', 'is_completed': progress.is_completed}, status=status.HTTP_200_OK)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found in this course'}, status=status.HTTP_404_NOT_FOUND)


class SectionViewSet(viewsets.ModelViewSet):
    serializer_class = SectionSerializer
    permission_classes = [IsInstructorOrAdmin]

    def get_queryset(self):
        return Section.objects.filter(course__instructor=self.request.user)


class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer
    permission_classes = [IsInstructorOrAdmin]

    def get_queryset(self):
        return Lesson.objects.filter(section__course__instructor=self.request.user)


class VideoViewSet(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    permission_classes = [IsInstructorOrAdmin]

    def get_queryset(self):
        return Video.objects.filter(lesson__section__course__instructor=self.request.user)


class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)


class WishlistViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(student=self.request.user).order_by('-added_at')


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if 'course' in self.request.query_params:
            return Review.objects.filter(course_id=self.request.query_params['course'])
        return Review.objects.all()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class DiscussionViewSet(viewsets.ModelViewSet):
    serializer_class = DiscussionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Discussion.objects.filter(parent=None)  # Only top-level discussions
        if 'course' in self.request.query_params:
            queryset = queryset.filter(course_id=self.request.query_params['course'])
        if 'lesson' in self.request.query_params:
            queryset = queryset.filter(lesson_id=self.request.query_params['lesson'])
        return queryset

    def perform_create(self, serializer):
        course_id = self.request.data.get('course')
        lesson_id = self.request.data.get('lesson')
        parent_id = self.request.data.get('parent')
        
        course = Course.objects.get(id=course_id)
        lesson = Lesson.objects.get(id=lesson_id) if lesson_id else None
        parent = Discussion.objects.get(id=parent_id) if parent_id else None
        
        serializer.save(user=self.request.user, course=course, lesson=lesson, parent=parent)

class AdminCourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category__slug', 'difficulty', 'instructor', 'is_published']
    search_fields = ['title', 'subtitle']
    
    def get_permissions(self):
        return [IsAdminOrReadOnly()] # Or just require admin? Yes, only Admin
    
    def get_permissions(self):
        # We need an IsAdmin permission class here. Let's define it inside the viewset or just use the logic
        class IsAdmin(permissions.BasePermission):
            def has_permission(self, request, view):
                return request.user.is_authenticated and request.user.role == 'admin'
        return [IsAdmin()]

    def get_queryset(self):
        return Course.objects.all()
    
    @action(detail=True, methods=['post'])
    def toggle_publish(self, request, pk=None):
        course = self.get_object()
        course.is_published = not course.is_published
        course.save()
        return Response({'message': 'Status updated', 'is_published': course.is_published}, status=status.HTTP_200_OK)