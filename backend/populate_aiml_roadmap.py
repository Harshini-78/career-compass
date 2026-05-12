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
    domain_name = 'AI/ML'
    domain, created = Domain.objects.get_or_create(name=domain_name)
    
    # Delete existing stages to replace with the 7-stage one
    Stage.objects.filter(domain=domain).delete()
    
    roadmap_data = [
        {
            "order": 1,
            "title": "Python Basics",
            "description": "Build the programming foundation required for machine learning.",
            "skills": [
                "Python syntax",
                "Data types",
                "Functions",
                "Loops",
                "NumPy basics",
                "Pandas basics"
            ],
            "resources": [
                {"title": "Python for Data Science tutorials", "link": "https://roadmap.sh/ai-data-scientist"},
                {"title": "NumPy and Pandas documentation", "link": "https://numpy.org/doc/"}
            ],
            "practice": [
                "Write Python scripts for dataset processing",
                "Perform basic data analysis with Pandas"
            ]
        },
        {
            "order": 2,
            "title": "Machine Learning Algorithms",
            "description": "Introduce the fundamental machine learning algorithms.",
            "skills": [
                "Supervised learning",
                "Linear regression",
                "Logistic regression",
                "Decision trees",
                "KNN",
                "Model evaluation metrics"
            ],
            "resources": [
                {"title": "Scikit-Learn Documentation", "link": "https://scikit-learn.org/stable/"}
            ],
            "practice": [
                "Train a regression model",
                "Train a classification model",
                "Mini project: Predict housing prices using regression."
            ]
        },
        {
            "order": 3,
            "title": "Data Preprocessing & Feature Engineering",
            "description": "Teach students how to prepare data for machine learning.",
            "skills": [
                "Data cleaning",
                "Handling missing values",
                "Feature scaling",
                "Feature selection",
                "Encoding categorical variables"
            ],
            "resources": [
                {"title": "Feature Engineering Guide", "link": "https://roadmap.sh/ai-data-scientist"}
            ],
            "practice": [
                "Clean a messy dataset",
                "Prepare a dataset for ML training",
                "Mini project: Customer churn prediction dataset preprocessing."
            ]
        },
        {
            "order": 4,
            "title": "Machine Learning Projects",
            "description": "Apply machine learning knowledge in real projects.",
            "skills": [
                "End-to-end ML workflow",
                "Dataset exploration",
                "Model training pipeline",
                "Evaluation and improvement"
            ],
            "resources": [
                {"title": "Kaggle Datasets", "link": "https://www.kaggle.com/datasets"}
            ],
            "practice": [
                "Spam email classifier",
                "Movie recommendation system",
                "Sentiment analysis model",
                "Completion Requirement: Students should complete at least one ML project."
            ]
        },
        {
            "order": 5,
            "title": "Deep Learning Fundamentals",
            "description": "Introduce neural networks and deep learning concepts.",
            "skills": [
                "Neural networks",
                "Activation functions",
                "Backpropagation",
                "CNN basics",
                "TensorFlow or PyTorch basics"
            ],
            "resources": [
                {"title": "Deep Learning Specialization", "link": "https://www.coursera.org/specializations/deep-learning"}
            ],
            "practice": [
                "Train a simple neural network",
                "Build a basic image classifier",
                "Mini project: Digit recognition using neural networks."
            ]
        },
        {
            "order": 6,
            "title": "Advanced AI Concepts",
            "description": "Introduce modern AI techniques used in industry.",
            "skills": [
                "NLP basics",
                "Transformers",
                "Transfer learning",
                "Model optimization",
                "Hyperparameter tuning"
            ],
            "resources": [
                {"title": "Hugging Face Course", "link": "https://huggingface.co/course/chapter1/1"}
            ],
            "practice": [
                "Fine tune a pretrained model",
                "Implement an NLP model",
                "Mini project: Text classification using transformers."
            ]
        },
        {
            "order": 7,
            "title": "AI/ML Placement Preparation",
            "description": "Prepare students for AI/ML job roles.",
            "skills": [
                "ML interview questions",
                "ML system design basics",
                "Model explainability",
                "Portfolio building"
            ],
            "resources": [
                {"title": "ML System Design Interview Guide", "link": "https://roadmap.sh/ai"}
            ],
            "practice": [
                "Publish ML projects on GitHub",
                "Create ML portfolio",
                "Practice mock interviews",
                "Final outcome: Student becomes placement ready for AI/ML roles."
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

    print("Successfully populated 7-stage AI/ML roadmap.")

if __name__ == '__main__':
    populate_roadmap()
