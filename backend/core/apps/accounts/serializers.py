from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, InstructorApplication


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        validated_data['role'] = 'student'  # Force role to student
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'full_name', 'role', 'date_joined')
        read_only_fields = ('email', 'date_joined')


class AdminUserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    enrolled_courses_count = serializers.SerializerMethodField()
    created_courses_count = serializers.SerializerMethodField()
    application_status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role', 
            'is_active', 'is_suspended', 'date_joined',
            'enrolled_courses_count', 'created_courses_count', 'application_status'
        )

    def get_enrolled_courses_count(self, obj):
        return obj.enrollments.count()

    def get_created_courses_count(self, obj):
        if obj.role == 'instructor':
            return obj.courses.count()
        return 0

    def get_application_status(self, obj):
        try:
            return obj.instructor_application.status
        except Exception:
            return None


class InstructorApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    user_name = serializers.ReadOnlyField(source='user.full_name')

    class Meta:
        model = InstructorApplication
        fields = (
            'id', 'user', 'user_email', 'user_name', 'bio', 'experience', 
            'qualification', 'expertise', 'linkedin', 'portfolio', 'resume', 
            'status', 'created_at', 'reviewed_at', 'reviewed_by'
        )
        read_only_fields = ('id', 'user', 'user_email', 'user_name', 'status', 'created_at', 'reviewed_at', 'reviewed_by')

class PublicInstructorSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    bio = serializers.SerializerMethodField()
    expertise = serializers.SerializerMethodField()
    experience = serializers.SerializerMethodField()
    qualification = serializers.SerializerMethodField()
    courses_published = serializers.SerializerMethodField()
    students_taught = serializers.SerializerMethodField()
    recent_courses = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'full_name', 'email', 
            'bio', 'expertise', 'experience', 'qualification',
            'courses_published', 'students_taught', 'recent_courses'
        )

    def get_application(self, obj):
        if not hasattr(self, '_application_cache'):
            self._application_cache = {}
        if obj.id not in self._application_cache:
            try:
                self._application_cache[obj.id] = obj.instructor_application
            except Exception:
                self._application_cache[obj.id] = None
        return self._application_cache[obj.id]

    def get_bio(self, obj):
        app = self.get_application(obj)
        return app.bio if app else ''

    def get_expertise(self, obj):
        app = self.get_application(obj)
        return app.expertise if app else ''

    def get_experience(self, obj):
        app = self.get_application(obj)
        return app.experience if app else ''

    def get_qualification(self, obj):
        app = self.get_application(obj)
        return app.qualification if app else ''

    def get_courses_published(self, obj):
        return obj.courses.filter(is_published=True).count()

    def get_students_taught(self, obj):
        from apps.courses.models import Enrollment
        return Enrollment.objects.filter(course__instructor=obj, course__is_published=True).values('student').distinct().count()

    def get_recent_courses(self, obj):
        from apps.courses.serializers import CourseSerializer
        courses = obj.courses.filter(is_published=True)[:3]
        return CourseSerializer(courses, many=True).data