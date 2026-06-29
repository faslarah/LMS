from django.db.models import Avg
from rest_framework import serializers
from .models import Category, Course, Section, Enrollment, Wishlist, Review, SectionProgress, Discussion, Certificate


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class SectionSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = ['id', 'course', 'title', 'description', 'video_file', 'video_url', 'duration', 'thumbnail', 'order', 'created_at', 'is_completed']

    def get_is_completed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SectionProgress.objects.filter(student=request.user, section=obj, is_completed=True).exists()
        return False


class ReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'course', 'student', 'student_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['student', 'course']

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"


class CourseSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)
    category_detail = CategorySerializer(source='category', read_only=True)
    instructor_name = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    is_wishlisted = serializers.SerializerMethodField()
    total_sections = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    total_enrollments = serializers.SerializerMethodField()
    certificate_id = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'subtitle', 'description', 'category', 'category_detail',
            'instructor', 'instructor_name', 'difficulty', 'language', 'price',
            'thumbnail', 'preview_video', 'requirements', 'learning_outcomes',
            'is_published', 'sections', 'is_enrolled', 'is_wishlisted', 'total_sections', 
            'average_rating', 'reviews_count', 'total_enrollments', 'created_at', 'certificate_id'
        ]
        read_only_fields = ['instructor']

    def get_instructor_name(self, obj):
        return f"{obj.instructor.first_name} {obj.instructor.last_name}"

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(student=request.user, course=obj).exists()
        return False

    def get_is_wishlisted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(student=request.user, course=obj).exists()
        return False

    def get_total_sections(self, obj):
        return obj.sections.count()

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else 0.0

    def get_reviews_count(self, obj):
        return obj.reviews.count()

    def get_total_enrollments(self, obj):
        return obj.enrollments.count()
        
    def get_certificate_id(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            cert = Certificate.objects.filter(student=request.user, course=obj).first()
            if cert:
                return str(cert.certificate_id)
        return None


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'enrolled_at', 'completed', 'progress_percentage']

    def get_progress_percentage(self, obj):
        total_sections = Section.objects.filter(course=obj.course).count()
        if total_sections == 0:
            return 0
        from .models import SectionProgress
        completed_sections = SectionProgress.objects.filter(student=obj.student, section__course=obj.course, is_completed=True).count()
        return int((completed_sections / total_sections) * 100)


class WishlistSerializer(serializers.ModelSerializer):
    course_detail = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'course', 'course_detail', 'added_at']
        read_only_fields = ['student']


class DiscussionSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Discussion
        fields = ['id', 'course', 'section', 'user', 'user_name', 'content', 'parent', 'created_at', 'replies']
        read_only_fields = ['user', 'course']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
        
    def get_replies(self, obj):
        if obj.parent is None:
            return DiscussionSerializer(obj.replies.all(), many=True).data
        return []

class CertificateSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    student_name = serializers.SerializerMethodField()
    instructor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Certificate
        fields = ['certificate_id', 'course', 'course_title', 'student_name', 'instructor_name', 'issued_at']
        
    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"
        
    def get_instructor_name(self, obj):
        return f"{obj.course.instructor.first_name} {obj.course.instructor.last_name}"