from rest_framework import status, viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer, AdminUserSerializer, InstructorApplicationSerializer
from .models import User, InstructorApplication
from apps.courses.models import Course, Enrollment, Category


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'User registered successfully',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'user': UserProfileSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, username=email, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'message': 'Login successful',
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    },
                    'user': UserProfileSerializer(user).data
                }, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InstructorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        instructors = User.objects.filter(role='instructor')
        serializer = UserProfileSerializer(instructors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class InstructorDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            instructor = User.objects.get(pk=pk, role='instructor')
            serializer = UserProfileSerializer(instructor)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Instructor not found'}, status=status.HTTP_404_NOT_FOUND)

class IsAdminUserRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class AdminUserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUserRole]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['role', 'is_active', 'is_suspended']
    search_fields = ['first_name', 'last_name', 'email']

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        action = request.data.get('action')
        
        if action == 'activate':
            user.is_active = True
            user.is_suspended = False
        elif action == 'deactivate':
            user.is_active = False
            user.is_suspended = False
        elif action == 'suspend':
            user.is_active = False
            user.is_suspended = True
            
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

class AdminStatsView(APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        from django.db.models import Count
        from django.db.models.functions import TruncMonth
        
        # User Stats
        total_users = User.objects.count()
        total_students = User.objects.filter(role='student').count()
        total_instructors = User.objects.filter(role='instructor').count()
        total_admins = User.objects.filter(role='admin').count()
        suspended_users = User.objects.filter(is_suspended=True).count()
        
        # Course Stats
        total_courses = Course.objects.count()
        published_courses = Course.objects.filter(is_published=True).count()
        draft_courses = total_courses - published_courses
        total_enrollments = Enrollment.objects.count()
        
        # Category Stats
        total_categories = Category.objects.count()
        
        # Application Stats
        pending_applications = InstructorApplication.objects.filter(status='pending').count()
        approved_applications = InstructorApplication.objects.filter(status='approved').count()
        rejected_applications = InstructorApplication.objects.filter(status='rejected').count()

        recent_registrations = UserProfileSerializer(User.objects.order_by('-date_joined')[:5], many=True).data
        
        recent_pending_apps_qs = InstructorApplication.objects.filter(status='pending').order_by('-created_at')[:3]
        recent_pending_applications = InstructorApplicationSerializer(recent_pending_apps_qs, many=True).data

        return Response({
            'total_users': total_users,
            'total_students': total_students,
            'total_instructors': total_instructors,
            'total_admins': total_admins,
            'suspended_users': suspended_users,
            'pending_applications': pending_applications,
            'approved_applications': approved_applications,
            'rejected_applications': rejected_applications,
            'application_stats': [
                {'name': 'Pending', 'value': pending_applications},
                {'name': 'Approved', 'value': approved_applications},
                {'name': 'Rejected', 'value': rejected_applications},
            ],
            'total_courses': total_courses,
            'published_courses': published_courses,
            'draft_courses': draft_courses,
            'total_categories': total_categories,
            'total_enrollments': total_enrollments,
            'recent_registrations': recent_registrations,
            'recent_pending_applications': recent_pending_applications
        }, status=status.HTTP_200_OK)


from django.utils import timezone
from .models import InstructorApplication
from .serializers import InstructorApplicationSerializer

class StudentInstructorApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            application = InstructorApplication.objects.get(user=request.user)
            serializer = InstructorApplicationSerializer(application)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except InstructorApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        if hasattr(request.user, 'instructor_application'):
            application = request.user.instructor_application
            if application.status == 'rejected':
                # Allow resubmission by deleting the old one
                application.delete()
            else:
                return Response({'error': 'You have already submitted an application.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = InstructorApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminInstructorApplicationViewSet(viewsets.ModelViewSet):
    queryset = InstructorApplication.objects.all()
    serializer_class = InstructorApplicationSerializer
    permission_classes = [IsAdminUserRole]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']

    def update(self, request, *args, **kwargs):
        application = self.get_object()
        new_status = request.data.get('status')
        
        if new_status and new_status in ['approved', 'rejected']:
            application.status = new_status
            application.reviewed_at = timezone.now()
            application.reviewed_by = request.user
            application.save()
            
            # If approved, update user role
            if new_status == 'approved':
                user = application.user
                user.role = 'instructor'
                user.save()
            
            serializer = self.get_serializer(application)
            return Response(serializer.data)
            
        return Response({'error': 'Invalid status update'}, status=status.HTTP_400_BAD_REQUEST)