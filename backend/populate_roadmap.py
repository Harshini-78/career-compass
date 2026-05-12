import sys
import os
import django

sys.path.append('d:/CareerCompass/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import User, Domain, Stage, Progress, Skill, SkillProgress

# 1. Clean up existing AI/ML data to start fresh with a real roadmap
Domain.objects.filter(name='AI/ML').delete()
Domain.objects.filter(name='AI Engineer').delete()

d, _ = Domain.objects.get_or_create(name='AI Engineer')

u = User.objects.filter(username='admin').first()
if u:
    u.domain = d
    u.save()

# Define the roadmap
roadmap = [
    {
        "order": 1,
        "title": "Programming & CS Foundations",
        "description": "Master the fundamental programming skills required to build AI systems, focusing on Python and version control.",
        "skills": [
            "Python Data Structures & Algorithms",
            "Object-Oriented Programming (OOP)",
            "Version Control (Git & GitHub)",
            "Basic API Development (FastAPI / Flask)"
        ]
    },
    {
        "order": 2,
        "title": "Mathematics & Statistics",
        "description": "Understand the math that powers machine learning algorithms, including algebra, calculus, and probability.",
        "skills": [
            "Linear Algebra (Vectors & Matrices)",
            "Calculus (Derivatives & Gradients)",
            "Probability & Statistics",
            "Data Distributions & Hypothesis Testing"
        ]
    },
    {
        "order": 3,
        "title": "Data Engineering & Preprocessing",
        "description": "Learn how to collect, clean, manipulate, and visualize data before feeding it into models.",
        "skills": [
            "Pandas & NumPy for Data Manipulation",
            "Data Visualization (Matplotlib / Seaborn)",
            "SQL fundamentals for Data Retrieval",
            "Handling Missing Data & Outliers"
        ]
    },
    {
        "order": 4,
        "title": "Machine Learning Fundamentals",
        "description": "Dive into classic ML algorithms and understand model evaluation metrics.",
        "skills": [
            "Scikit-Learn fundamentals",
            "Supervised Learning (Regression, Classification)",
            "Unsupervised Learning (Clustering, PCA)",
            "Model Evaluation & Feature Engineering"
        ]
    },
    {
        "order": 5,
        "title": "Deep Learning Core",
        "description": "Understand artificial neural networks and how to build them using modern frameworks.",
        "skills": [
            "Neural Network Basics & Backpropagation",
            "PyTorch or TensorFlow basics",
            "Convolutional Neural Networks (CNNs)",
            "Recurrent Neural Networks (RNNs)"
        ]
    },
    {
        "order": 6,
        "title": "Natural Language Processing",
        "description": "Learn how machines process human language, up to the modern Transformer architecture.",
        "skills": [
            "Text Preprocessing & Embeddings",
            "Transformer Architecture (Attention Mechanism)",
            "Hugging Face Transformers Library",
            "Fine-Tuning pretrained models (BERT, T5)"
        ]
    },
    {
        "order": 7,
        "title": "Large Language Models (LLMs)",
        "description": "Work with state-of-the-art LLMs, APIs, and advanced prompt engineering techniques.",
        "skills": [
            "Prompt Engineering (Few-shot, Chain-of-Thought)",
            "OpenAI / Anthropic APIs utilization",
            "Parameter-Efficient Fine-Tuning (LoRA, QLoRA)",
            "LLM Evaluation metrics"
        ]
    },
    {
        "order": 8,
        "title": "RAG, Vector DBs & AI Agents",
        "description": "Build advanced AI systems that can search knowledge bases and take autonomous actions.",
        "skills": [
            "Vector Embeddings & Similarity Search",
            "Vector DBs (Pinecone, Milvus, or Chroma)",
            "Retrieval-Augmented Generation (RAG) Architecture",
            "Building AI Agents (LangChain, LlamaIndex)"
        ]
    },
    {
        "order": 9,
        "title": "MLOps & Deployment",
        "description": "Put your AI models into production locally and in the cloud reliably.",
        "skills": [
            "Model Packaging (Docker)",
            "Model Serving (TensorRT, vLLM, Triton)",
            "CI/CD for Machine Learning Pipelines",
            "Model Monitoring & Observability"
        ]
    }
]

# Create Stages and Skills
for stage_data in roadmap:
    # Dummy resources for visual preview
    resources = [
        {"title": f"Read: {skill}", "link": "https://roadmap.sh/ai-engineer"} for skill in stage_data["skills"][:2]
    ]
    
    stage = Stage.objects.create(
        domain=d,
        order=stage_data["order"],
        title=stage_data["title"],
        description=stage_data["description"],
        learning_resources=resources
    )
    
    for idx, skill_title in enumerate(stage_data["skills"], start=1):
        Skill.objects.create(
            stage=stage,
            order=idx,
            title=skill_title
        )

# Unlock first stage for admin
if u:
    Progress.objects.get_or_create(user=u, stage=Stage.objects.get(domain=d, order=1), defaults={'unlocked': True})

print("Successfully seeded the AI Engineer Roadmap!")
