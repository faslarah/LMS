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