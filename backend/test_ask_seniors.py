import os
import django
import sys

# Setup Django environment
sys.path.append('d:/CareerCompass/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import User, Domain, Question, Reply

def run_test():
    domain = Domain.objects.first()
    if not domain:
        print("No domain found")
        return

    student = User.objects.filter(role='student').first()
    senior = User.objects.filter(role='senior').first()
    student2 = User.objects.filter(role='student').last()

    if not student or not senior or not student2:
        print("Missing users")
        return

    print("--- Testing Ask Seniors Upgrade ---")
    
    # 1. Anonymous Question
    print("\n1. Posting Anonymous Question...")
    q = Question.objects.create(
        author=student,
        domain=domain,
        title="Test Anonymous Question",
        content="This should be anonymous.",
        is_anonymous=True
    )
    print(f"Created Question ID {q.id}. is_anonymous={q.is_anonymous}")

    # 2. Upvote Question
    print("\n2. Toggling Upvote...")
    q.upvotes.add(student2)
    print(f"Upvote Count: {q.upvotes.count()}")
    
    # 3. Add Reply
    print("\n3. Adding Senior Reply...")
    r1 = Reply.objects.create(
        question=q,
        author=senior,
        content="This is a test reply.",
    )
    r2 = Reply.objects.create(
        question=q,
        author=senior,
        content="This is a second test reply.",
    )
    print(f"Created Replies ID {r1.id}, {r2.id}")

    # 4. Accept Reply
    print("\n4. Accepting Reply...")
    r1.is_accepted = True
    r1.save()
    
    # In API logic, we reset others. Let's manually do it to simulate
    r1.question.replies.all().update(is_accepted=False)
    r1.is_accepted = True
    r1.save()
    
    r1.refresh_from_db()
    r2.refresh_from_db()
    
    print(f"Reply 1 is_accepted={r1.is_accepted}")
    print(f"Reply 2 is_accepted={r2.is_accepted}")

if __name__ == '__main__':
    run_test()
