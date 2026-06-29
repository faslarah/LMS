from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Course, Section, Enrollment, Wishlist, Review, SectionProgress, Discussion, Certificate
from .serializers import (
    CategorySerializer, CourseSerializer, SectionSerializer,
    EnrollmentSerializer, WishlistSerializer, ReviewSerializer, DiscussionSerializer, CertificateSerializer
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
        section_id = request.data.get('section_id')
        try:
            section = Section.objects.get(id=section_id, course=course)
            progress, created = SectionProgress.objects.get_or_create(student=request.user, section=section)
            progress.is_completed = not progress.is_completed
            progress.save()

            # Check for course completion
            total_sections = course.sections.count()
            completed_sections = SectionProgress.objects.filter(
                student=request.user, 
                section__course=course, 
                is_completed=True
            ).count()
            
            is_course_completed = (total_sections > 0 and total_sections == completed_sections)
            certificate_id = None
            
            if is_course_completed:
                enrollment, _ = Enrollment.objects.get_or_create(student=request.user, course=course)
                enrollment.completed = True
                enrollment.save()
                
                cert, _ = Certificate.objects.get_or_create(student=request.user, course=course)
                certificate_id = str(cert.certificate_id)

            return Response({
                'message': 'Progress toggled', 
                'is_completed': progress.is_completed,
                'is_course_completed': is_course_completed,
                'certificate_id': certificate_id
            }, status=status.HTTP_200_OK)
        except Section.DoesNotExist:
            return Response({'error': 'Section not found in this course'}, status=status.HTTP_404_NOT_FOUND)


class SectionViewSet(viewsets.ModelViewSet):
    serializer_class = SectionSerializer
    permission_classes = [IsInstructorOrAdmin]

    def get_queryset(self):
        return Section.objects.filter(course__instructor=self.request.user)


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


class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'certificate_id'

    def get_queryset(self):
        return Certificate.objects.filter(student=self.request.user)


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
        if 'section' in self.request.query_params:
            queryset = queryset.filter(section_id=self.request.query_params['section'])
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdminCourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated] # Should be IsAdmin

    def get_permissions(self):
        if self.request.user.role != 'admin':
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Course.objects.all()