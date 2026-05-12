import sys
import os
import django

sys.path.append('d:/CareerCompass/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import User, Domain, Stage, Progress, Skill, SkillProgress
from django.db import transaction

@transaction.atomic
def populate_roadmap():
    domain_name = 'Web Development'
    domain, created = Domain.objects.get_or_create(name=domain_name)
    
    # Delete existing stages to replace with the 7-stage one
    Stage.objects.filter(domain=domain).delete()
    
    roadmap_data = [
        {
            "order": 1,
            "title": "Web Foundations",
            "description": "Teach the fundamental technologies used to build web pages.",
            "skills": [
                "HTML",
                "CSS",
                "Responsive design",
                "Flexbox and Grid",
                "Basic JavaScript"
            ],
            "resources": [
                {"title": "Web Development Basics", "link": "https://roadmap.sh/frontend"}
            ],
            "practice": [
                "Create static web pages",
                "Build a responsive landing page",
                "Mini Project: Personal portfolio website."
            ]
        },
        {
            "order": 2,
            "title": "Modern JavaScript",
            "description": "Build strong JavaScript fundamentals for interactive web applications.",
            "skills": [
                "ES6+ JavaScript",
                "DOM manipulation",
                "Event handling",
                "Fetch API",
                "Async / Await"
            ],
            "resources": [
                {"title": "JavaScript Mastery", "link": "https://roadmap.sh/javascript"}
            ],
            "practice": [
                "Create interactive UI components",
                "Fetch data from public APIs",
                "Mini Project: Weather application using API."
            ]
        },
        {
            "order": 3,
            "title": "Frontend Frameworks",
            "description": "Learn modern frontend frameworks used in industry.",
            "skills": [
                "React fundamentals",
                "Components",
                "State management",
                "React Router",
                "API integration"
            ],
            "resources": [
                {"title": "React Documentation", "link": "https://react.dev/"}
            ],
            "practice": [
                "Build reusable components",
                "Create multi-page React applications",
                "Mini Project: Task manager web app."
            ]
        },
        {
            "order": 4,
            "title": "Backend Development",
            "description": "Teach server-side development.",
            "skills": [
                "Node.js or Django backend",
                "REST API development",
                "Authentication",
                "JWT tokens",
                "Server architecture"
            ],
            "resources": [
                {"title": "Backend Roadmap", "link": "https://roadmap.sh/backend"}
            ],
            "practice": [
                "Build REST APIs",
                "Implement authentication",
                "Mini Project: User authentication system."
            ]
        },
        {
            "order": 5,
            "title": "Databases",
            "description": "Teach data storage and retrieval.",
            "skills": [
                "SQL databases",
                "PostgreSQL / MySQL",
                "Database design",
                "ORM usage",
                "CRUD operations"
            ],
            "resources": [
                {"title": "PostgreSQL Tutorial", "link": "https://www.postgresqltutorial.com/"}
            ],
            "practice": [
                "Create relational databases",
                "Connect backend with database",
                "Mini Project: Blog system with database."
            ]
        },
        {
            "order": 6,
            "title": "DevOps & Deployment",
            "description": "Teach students how to deploy real applications.",
            "skills": [
                "Git and GitHub",
                "Docker basics",
                "CI/CD concepts",
                "Cloud deployment",
                "Hosting platforms"
            ],
            "resources": [
                {"title": "DevOps Roadmap", "link": "https://roadmap.sh/devops"}
            ],
            "practice": [
                "Deploy a web application",
                "Configure CI/CD pipeline",
                "Mini Project: Deploy a full stack application online."
            ]
        },
        {
            "order": 7,
            "title": "Placement Preparation",
            "description": "Prepare students for web developer jobs.",
            "skills": [
                "Web development interview questions",
                "System design basics",
                "Performance optimization",
                "Security best practices"
            ],
            "resources": [
                {"title": "System Design Primer", "link": "https://github.com/donnemartin/system-design-primer"}
            ],
            "practice": [
                "Build portfolio projects",
                "Create GitHub project repository",
                "Practice mock interviews",
                "Final Outcome: Student becomes placement ready as a Full Stack Web Developer."
            ]
        }
    ]

    for stage_info in roadmap_data:
        stage = Stage.objects.create(
            domain=domain,
            order=stage_info["order"],
            title=stage_info["title"],
            description=stage_info["description"],
            learning_resources=stage_info["resources"],
            practice_exercises=stage_info["practice"]
        )
        
        for idx, skill_title in enumerate(stage_info["skills"], start=1):
            Skill.objects.create(
                stage=stage,
                title=skill_title,
                order=idx
            )
            
    # Unlock the first stage for users who are already in this domain
    first_stage = Stage.objects.get(domain=domain, order=1)
    for user in User.objects.filter(domain=domain):
        Progress.objects.get_or_create(user=user, stage=first_stage, defaults={'unlocked': True})

    print("Successfully populated 7-stage Web Development roadmap.")

if __name__ == '__main__':
    populate_roadmap()
