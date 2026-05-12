import sys
import os
import django

sys.path.append('d:/CareerCompass/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import User, Domain, Stage, Progress, Skill, SkillProgress
from django.db import transaction

@transaction.atomic
def populate_all_roadmaps():
    roadmaps = {
        'AI/ML': [
            {
                "order": 1, "title": "Mathematics for ML", "description": "Learn the foundational math required for AI/ML.",
                "skills": ["Linear Algebra", "Calculus", "Probability", "Statistics"],
                "resources": [{"title": "Mathematics for Machine Learning", "link": "https://www.youtube.com/watch?v=CMEWVn1uZpQ"}],
                "practice": ["Solve linear equations", "Calculate derivatives"]
            },
            {
                "order": 2, "title": "Programming Basics", "description": "Master Python for data and ML.",
                "skills": ["Python Fundamentals", "Numpy", "Pandas", "Matplotlib"],
                "resources": [{"title": "Python for Data Science", "link": "https://www.youtube.com/watch?v=hDKCxebp88A"}],
                "practice": ["Data filtering", "Array manipulation"]
            },
            {
                "order": 3, "title": "Machine Learning Algorithms", "description": "Understand core ML models.",
                "skills": ["Scikit-Learn", "Regression", "Classification", "Clustering"],
                "resources": [{"title": "Machine Learning Course", "link": "https://www.youtube.com/watch?v=I9H5a3sxg4Q"}],
                "practice": ["Train a linear regression model", "Use K-Means clustering"]
            },
            {
                "order": 4, "title": "Deep Learning Fundamentals", "description": "Introduction to neural networks.",
                "skills": ["Neural Networks", "TensorFlow/PyTorch", "Backpropagation"],
                "resources": [{"title": "Deep Learning Basics", "link": "https://www.youtube.com/watch?v=p_tpQSY1aTs"}],
                "practice": ["Build a simple neural network", "Train on MNIST"]
            },
            {
                "order": 5, "title": "Computer Vision / NLP", "description": "Specialized AI fields.",
                "skills": ["CNNs", "RNNs", "Transformers", "OpenCV"],
                "resources": [{"title": "CV & NLP Concepts", "link": "https://www.youtube.com/watch?v=IFsVsXAqPto"}],
                "practice": ["Image classification", "Text sentiment analysis"]
            },
            {
                "order": 6, "title": "Advanced Topics & Deployment", "description": "Real-world AI systems.",
                "skills": ["GANs", "Model Deployment", "MLOps", "Model Optimization"],
                "resources": [{"title": "Deploying ML Models", "link": "https://www.youtube.com/watch?v=cLtKAhaUqeo"}],
                "practice": ["Deploy model with Flask/FastAPI", "Optimize for inference"]
            },
            {
                "order": 7, "title": "Interview Prep", "description": "Get ready for AI roles.",
                "skills": ["ML System Design", "Portfolio Projects", "Algorithm Review"],
                "resources": [{"title": "AI/ML Interview Prep", "link": "https://www.youtube.com/watch?v=0vxFN3XQhFY"}],
                "practice": ["Mock interviews", "Complete portfolio"]
            }
        ],
        'Web Development': [
            {
                "order": 1, "title": "Internet & HTML/CSS", "description": "Learn how the web works.",
                "skills": ["HTML5", "CSS3", "DOM", "Responsive Design"],
                "resources": [{"title": "Web Dev Basics", "link": "https://www.youtube.com/watch?v=a_iQb1lnAEQ"}],
                "practice": ["Build a static landing page"]
            },
            {
                "order": 2, "title": "JavaScript Fundamentals", "description": "Add interactivity to pages.",
                "skills": ["ES6+", "Async/Await", "DOM Manipulation", "Fetch API"],
                "resources": [{"title": "JavaScript Course", "link": "https://www.youtube.com/watch?v=yyrq_8-bk0s"}],
                "practice": ["Create an interactive to-do list"]
            },
            {
                "order": 3, "title": "Frontend Frameworks", "description": "Master modern UI development.",
                "skills": ["React/Vue", "State Management", "Routing", "Hooks/Composables"],
                "resources": [{"title": "Frontend Frameworks Guide", "link": "https://www.youtube.com/watch?v=x4rFhThSX04"}],
                "practice": ["Build a single page application (SPA)"]
            },
            {
                "order": 4, "title": "Backend Basics", "description": "Learn server-side programming.",
                "skills": ["Node.js/Python", "REST APIs", "Express/Django", "Authentication"],
                "resources": [{"title": "Backend Development", "link": "https://www.youtube.com/watch?v=MIJt9H69QVc"}],
                "practice": ["Create a CRUD REST API"]
            },
            {
                "order": 5, "title": "Databases", "description": "Store and manage data.",
                "skills": ["SQL (PostgreSQL)", "NoSQL (MongoDB)", "ORMs/ODMs", "Schema Design"],
                "resources": [{"title": "Database Masterclass", "link": "https://www.youtube.com/watch?v=6a24yzO1-ZU"}],
                "practice": ["Design a relational database schema", "Connect API to DB"]
            },
            {
                "order": 6, "title": "DevOps & Deployment", "description": "Ship your applications.",
                "skills": ["Git/GitHub", "Docker", "CI/CD Basics", "Cloud Hosting (AWS/Vercel)"],
                "resources": [{"title": "Deployment & DevOps", "link": "https://www.youtube.com/watch?v=Oaj3RBIoGFc"}],
                "practice": ["Containerize app with Docker", "Deploy to production"]
            },
            {
                "order": 7, "title": "Advanced Web Concepts", "description": "Prepare for senior roles.",
                "skills": ["System Design", "Web Security", "Performance Optimization", "GraphQL/WebSockets"],
                "resources": [{"title": "Advanced Web Dev", "link": "https://www.youtube.com/watch?v=t4L91zH1vG0"}],
                "practice": ["Implement real-time features", "Optimize Core Web Vitals"]
            }
        ],
        'Data Science': [
            {
                "order": 1, "title": "Math & Statistics Fundamentals", "description": "Form the mathematical foundation of data science.",
                "skills": ["Linear Algebra", "Calculus basics", "Probability Theory", "Inferential Statistics", "Hypothesis Testing"],
                "resources": [{"title": "Data Science Math Skills", "link": "https://www.youtube.com/playlist?list=PLqlsKszccgpTLVT3raX8zuK0H4-HA5J28"}],
                "practice": ["Solve probability problems", "Perform a t-test on sample data", "Mini Project: Statistical analysis of a Kaggle dataset"]
            },
            {
                "order": 2, "title": "Programming for Data Science", "description": "Learn Python libraries essential for data manipulation.",
                "skills": ["Python for Data Science", "NumPy", "Pandas", "Matplotlib", "Seaborn"],
                "resources": [{"title": "Python Data Science Handbook", "link": "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU"}],
                "practice": ["Data filtering with Pandas", "Create basic charts", "Mini Project: Exploratory Data Analysis (EDA) dashboard"]
            },
            {
                "order": 3, "title": "Data Wrangling", "description": "Clean and prepare data for modeling.",
                "skills": ["Handling Missing Data", "Outlier Detection", "Data Transformation", "Feature Engineering", "SQL Queries"],
                "resources": [{"title": "SQL for Data Science", "link": "https://www.youtube.com/playlist?list=PLq_oGkGe6xH8f6V2J9L9pYndM3i8T8Z4C"}],
                "practice": ["Clean a messy CSV file", "Write complex SQL joins", "Mini Project: SQL database extraction and cleaning pipeline"]
            },
            {
                "order": 4, "title": "Machine Learning Fundamentals", "description": "Introduction to core ML algorithms.",
                "skills": ["Scikit-Learn", "Linear & Logistic Regression", "Decision Trees", "Clustering (K-Means)", "Model Evaluation"],
                "resources": [{"title": "Intro to Machine Learning", "link": "https://www.youtube.com/playlist?list=PLQVvvaa0QuDfju7guruhmPe9wx2XhJNjB"}],
                "practice": ["Train a regression model", "Evaluate classifier metrics", "Mini Project: Predict customer churn"]
            },
            {
                "order": 5, "title": "Advanced Machine Learning", "description": "Master complex ensemble methods and techniques.",
                "skills": ["Random Forest", "Gradient Boosting (XGBoost)", "PCA", "Hyperparameter Tuning", "Cross Validation"],
                "resources": [{"title": "Advanced ML Techniques", "link": "https://www.youtube.com/playlist?list=PL2zq7klxX5ASFejRl8WbwgbnfoOOWsG1o"}],
                "practice": ["Build an XGBoost model", "Perform Grid Search", "Mini Project: Predicting housing prices with ensemble models"]
            },
            {
                "order": 6, "title": "Deep Learning & Big Data", "description": "Handle large scale data and deep learning networks.",
                "skills": ["Neural Networks", "PyTorch / TensorFlow", "CNNs & RNNs", "Hadoop / Spark Basics", "Unstructured Data Processing"],
                "resources": [{"title": "Deep Learning Specialization", "link": "https://www.youtube.com/playlist?list=PLhhyoLH6IjfxeoooqP9rhU3HJIAVAJ3Vz"}],
                "practice": ["Train a basic PyTorch model", "Process large datasets iteratively", "Mini Project: Image classification model"]
            },
            {
                "order": 7, "title": "Data Science Placement Prep", "description": "Get ready for data science roles.",
                "skills": ["Case Study Interviews", "SQL Whiteboarding", "ML System Design", "A/B Testing Scenarios", "Portfolio Creation"],
                "resources": [{"title": "Data Science Interview Guide", "link": "https://www.youtube.com/playlist?list=PLk1F5kW3Id4gC3l5uH_4z5J3vX1vM9g6O"}],
                "practice": ["Create GitHub portfolio", "Mock interviews", "Final Outcome: Placement ready as Data Scientist"]
            }
        ],
        'Data Structures & Algorithms': [
            {
                "order": 1, "title": "Programming Fundamentals", "description": "Learn the basics of programming and complexity.",
                "skills": ["Python/C++/Java Basics", "Arrays & Strings", "Time Complexity", "Space Complexity", "Big-O Notation"],
                "resources": [{"title": "Big O Cheat Sheet", "link": "https://www.bigocheatsheet.com/"}],
                "practice": ["Solve 10 Array problems", "Analyze time complexity of loops", "Mini Project: Build a complexity analyzer tool"]
            },
            {
                "order": 2, "title": "Basic Data Structures", "description": "Understand core abstract data types.",
                "skills": ["Linked Lists", "Stacks", "Queues", "Hash Tables", "Sets"],
                "resources": [{"title": "Data Structures in CS", "link": "https://roadmap.sh/computer-science"}],
                "practice": ["Implement a Hash Map from scratch", "Reverse a Linked List", "Mini Project: Browser history using Stacks"]
            },
            {
                "order": 3, "title": "Searching & Sorting", "description": "Master algorithmic searching and sorting.",
                "skills": ["Linear & Binary Search", "Two Pointers", "Sliding Window", "Merge Sort", "Quick Sort"],
                "resources": [{"title": "Sorting Algorithms Visualized", "link": "https://visualgo.net/en/sorting"}],
                "practice": ["Implement Binary Search", "Solve max subarray sum", "Mini Project: Sorting visualizer app"]
            },
            {
                "order": 4, "title": "Trees & Recursion", "description": "Solve problems using recursion and tree structures.",
                "skills": ["Recursion", "Binary Trees", "Binary Search Trees", "Tree Traversals (In/Pre/Post)", "Backtracking"],
                "resources": [{"title": "Tree Data Structure Guide", "link": "https://leetcode.com/explore/learn/card/data-structure-tree/"}],
                "practice": ["Invert a Binary Tree", "Solve N-Queens", "Mini Project: File system directory traverser"]
            },
            {
                "order": 5, "title": "Advanced Data Structures", "description": "Learn complex structures for optimization.",
                "skills": ["Heaps / Priority Queues", "Tries", "Disjoint Sets (Union-Find)", "Segment Trees", "Graph Basics"],
                "resources": [{"title": "Advanced Data Structures", "link": "https://cp-algorithms.com/"}],
                "practice": ["Implement a Min Heap", "Autocomplete system using Trie", "Mini Project: Network connectivity checking server"]
            },
            {
                "order": 6, "title": "Graphs & Dynamic Programming", "description": "Master competitive programming techniques.",
                "skills": ["BFS & DFS", "Shortest Path (Dijkstra)", "Minimum Spanning Tree", "1D DP", "2D DP & Knapsack"],
                "resources": [{"title": "Dynamic Programming Patterns", "link": "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns"}],
                "practice": ["Find shortest path in maze", "Solve Unbounded Knapsack", "Mini Project: Maps routing algorithm"]
            },
            {
                "order": 7, "title": "Interview Preparation", "description": "Prepare for FAANG style technical interviews.",
                "skills": ["LeetCode Medium/Hard", "Mock Interviews", "Pattern Recognition", "System Design Basics", "Whiteboarding"],
                "resources": [{"title": "Blind 75 LeetCode", "link": "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions"}],
                "practice": ["Complete Blind 75", "Do 5 Pramp mock interviews", "Final Outcome: Placement ready for SDE roles"]
            }
        ],
        'DevOps': [
            {
                "order": 1, "title": "OS & Linux Basics", "description": "Learn operating systems fundamentals and terminal commands.",
                "skills": ["Linux Commands", "Shell Scripting", "Networking Basics", "Process Management", "SSH & Security"],
                "resources": [{"title": "Linux Journey", "link": "https://linuxjourney.com/"}],
                "practice": ["Write a backup bash script", "Configure SSH keys", "Mini Project: Automated server setup script"]
            },
            {
                "order": 2, "title": "Version Control", "description": "Master Git and collaboration workflows.",
                "skills": ["Git Branching & Merging", "GitHub / GitLab", "Pull Requests", "Resolving Conflicts", "Git Hooks"],
                "resources": [{"title": "Git Documentation", "link": "https://git-scm.com/doc"}],
                "practice": ["Create a branching strategy", "Resolve merge conflicts", "Mini Project: Open source contribution"]
            },
            {
                "order": 3, "title": "Containerization", "description": "Package applications with Docker.",
                "skills": ["Docker Basics", "Image Creation (Dockerfile)", "Docker Compose", "Container Networking", "Volumes & Storage"],
                "resources": [{"title": "Docker Official Docs", "link": "https://docs.docker.com/"}],
                "practice": ["Write Dockerfile for Node app", "Setup multi-container Compose", "Mini Project: Containerize a full-stack app"]
            },
            {
                "order": 4, "title": "CI/CD Pipelines", "description": "Automate testing and deployment.",
                "skills": ["GitHub Actions", "Jenkins Basics", "Automated Testing", "Deployment Strategies", "Artifact Management"],
                "resources": [{"title": "CI/CD Basics", "link": "https://roadmap.sh/devops"}],
                "practice": ["Create GitHub Actions workflow", "Setup test automation", "Mini Project: Auto-deploy pipeline to cloud"]
            },
            {
                "order": 5, "title": "Infrastructure as Code", "description": "Provision servers via code.",
                "skills": ["Terraform Basics", "Ansible", "Server Provisioning", "State Management", "Configuration Management"],
                "resources": [{"title": "Terraform Getting Started", "link": "https://developer.hashicorp.com/terraform/tutorials"}],
                "practice": ["Write Terraform AWS provider", "Provision EC2 instance", "Mini Project: Automated VPC creation"]
            },
            {
                "order": 6, "title": "Container Orchestration", "description": "Manage containers at scale.",
                "skills": ["Kubernetes Architecture", "Pods & Deployments", "K8s Services", "Helm Charts", "Ingress Controllers"],
                "resources": [{"title": "Kubernetes Basics", "link": "https://kubernetes.io/docs/tutorials/kubernetes-basics/"}],
                "practice": ["Deploy app to Minikube", "Write K8s deployment YAML", "Mini Project: Load-balanced microservices cluster"]
            },
            {
                "order": 7, "title": "Monitoring & Placement Prep", "description": "Monitor systems and prepare for roles.",
                "skills": ["Prometheus & Grafana", "ELK Stack", "Cloud Overview (AWS/Azure)", "Incident Response", "DevOps Interview Prep"],
                "resources": [{"title": "Prometheus Guide", "link": "https://prometheus.io/docs/introduction/overview/"}],
                "practice": ["Setup Grafana dashboards", "Practice DevOps interviews", "Final Outcome: Placement ready for DevOps Engineer"]
            }
        ],
        'Cybersecurity': [
            {
                "order": 1, "title": "IT & Networking Fundamentals", "description": "Learn how networks operate to secure them.",
                "skills": ["OSI & TCP/IP Models", "DNS & DHCP", "Linux Networking", "Windows Security Basics", "Ports & Protocols"],
                "resources": [
                    {"title": "Networking Concepts", "link": "https://www.youtube.com/watch?v=a0UIbw1MsUM"},
                    {"title": "IT Fundamentals", "link": "https://www.youtube.com/watch?v=GghRpHGi1oI"},
                    {"title": "Networking Playlist", "link": "https://www.youtube.com/playlist?list=PLw6kwOJVj3MbMZ8B72ZgUryj8OSETC0ds"}
                ],
                "practice": ["Analyze network traffic", "Configure a basic firewall", "Mini Project: Home network mapping"]
            },
            {
                "order": 2, "title": "Information Security Concepts", "description": "Understand the core principles of InfoSec.",
                "skills": ["CIA Triad", "Cryptography Basics", "Hashing vs Encryption", "IAM (Identity Access)", "Threat Modeling"],
                "resources": [
                    {"title": "InfoSec Concepts 1", "link": "https://www.youtube.com/watch?v=cMIGajqJ9gQ"},
                    {"title": "InfoSec Concepts 2", "link": "https://www.youtube.com/watch?v=zx7-yNjXzyU"},
                    {"title": "InfoSec Concepts 3", "link": "https://www.youtube.com/watch?v=Sz0ZgIeGRi0"}
                ],
                "practice": ["Create secure passwords logic", "Encrypt files using GPG", "Mini Project: Threat modeling an app"]
            },
            {
                "order": 3, "title": "Network Security", "description": "Secure infrastructures from external attacks.",
                "skills": ["Firewalls & VPNs", "IDS / IPS", "Network Sniffing", "Wireshark", "Wireless Security"],
                "resources": [
                    {"title": "Network Security 1", "link": "https://www.youtube.com/watch?v=7V0d2ztOm_Q"},
                    {"title": "Network Security 2", "link": "https://www.youtube.com/watch?v=t-ai8JzhHuY"},
                    {"title": "Network Security 3", "link": "https://www.youtube.com/watch?v=WuUeFh8Gg9s"}
                ],
                "practice": ["Capture packets with Wireshark", "Setup OpenVPN", "Mini Project: Network intrusion detection setup"]
            },
            {
                "order": 4, "title": "Vulnerability Assessment", "description": "Find security holes in systems.",
                "skills": ["Nmap Scanning", "Vulnerability Scanning", "Security Audits", "Risk Assessment", "Nessus Basics"],
                "resources": [
                    {"title": "Vulnerability Assessment 1", "link": "https://www.youtube.com/watch?v=5sqotcUD9Zg"},
                    {"title": "Vulnerability Assessment 2", "link": "https://www.youtube.com/watch?v=x87gbgQD4eg"},
                    {"title": "Nmap Network Discovery", "link": "https://nmap.org/book/man.html"}
                ],
                "practice": ["Run Nmap scans (authorized only)", "Execute vulnerability scan", "Mini Project: Audit a vulnerable VM"]
            },
            {
                "order": 5, "title": "Web Application Security", "description": "Secure apps from top web vulnerabilities.",
                "skills": ["OWASP Top 10", "SQL Injection", "XSS & CSRF", "Burp Suite", "Auth Bypass"],
                "resources": [
                    {"title": "Web App Security", "link": "https://www.youtube.com/watch?v=zXT3AhetSYE"},
                    {"title": "Web App Sec Playlist", "link": "https://www.youtube.com/playlist?list=PLlLEPkIWaI8ngzNbPuOyMrmV84-Cc4_88"},
                    {"title": "OWASP Top 10", "link": "https://owasp.org/www-project-top-ten/"}
                ],
                "practice": ["Intercept traffic with Burp Suite", "Perform SQLi on test lab", "Mini Project: Secure a vulnerable web app"]
            },
            {
                "order": 6, "title": "Incident Response & Forensics", "description": "Respond to hacks and analyze malware.",
                "skills": ["SIEM Tools", "Malware Analysis Basics", "Digital Forensics", "Log Analysis", "Threat Hunting"],
                "resources": [
                    {"title": "Incident Response 1", "link": "https://www.youtube.com/watch?v=56hpd3Bvok4"},
                    {"title": "Incident Response 2", "link": "https://www.youtube.com/watch?v=uitU7vzHy9o"},
                    {"title": "Incident Response Guide", "link": "https://www.sans.org/white-papers/33219/"}
                ],
                "practice": ["Analyze server logs", "Extract hidden data (Steganography)", "Mini Project: Investigating a simulated breach"]
            },
            {
                "order": 7, "title": "Certifications & Placement Prep", "description": "Get certified and land a job.",
                "skills": ["CompTIA Security+ Prep", "CEH Overview", "CTF Practice (TryHackMe)", "Cybersecurity Interviews", "Portfolio Building"],
                "resources": [
                    {"title": "Certifications 1", "link": "https://www.youtube.com/watch?v=w2afokvpVEI"},
                    {"title": "Certifications 2", "link": "https://www.youtube.com/watch?v=8vvFESzlDYU"},
                    {"title": "TryHackMe", "link": "https://tryhackme.com/"}
                ],
                "practice": ["Complete 5 TryHackMe rooms", "Practice mock interviews", "Final Outcome: Placement ready as Security Analyst"]
            }
        ],
        'Mobile Development': [
            {
                "order": 1, "title": "Programming Fundamentals", "description": "Learn the languages used for mobile dev.",
                "skills": ["Dart/Kotlin/Swift Basics", "OOP Concepts", "Data Structures", "Async Programming", "Functions & Classes"],
                "resources": [{"title": "Mobile Dev Roadmap", "link": "https://roadmap.sh/android"}],
                "practice": ["Build basic CLI apps", "Understand async/await", "Mini Project: Console based task manager"]
            },
            {
                "order": 2, "title": "Mobile App UI & Layouts", "description": "Design beautiful screens.",
                "skills": ["UI Components", "Layouts & Flex", "Responsive Design", "Navigation & Routing", "Material Design / Cupertino"],
                "resources": [{"title": "Flutter UI Guide", "link": "https://docs.flutter.dev/ui"}],
                "practice": ["Build a static UI", "Implement bottom navigation", "Mini Project: Portfolio App UI"]
            },
            {
                "order": 3, "title": "State Management", "description": "Manage data flow within the app.",
                "skills": ["State Lifting", "Provider / Riverpod", "MVVM Architecture", "App Lifecycle", "Hooks (React Native)"],
                "resources": [{"title": "State Management Docs", "link": "https://docs.flutter.dev/data-and-backend/state-mgmt"}],
                "practice": ["Build a persistent counter", "Implement MVVM", "Mini Project: To-Do App with State"]
            },
            {
                "order": 4, "title": "Local Storage & Databases", "description": "Store data offline on the device.",
                "skills": ["SQLite / Room", "SharedPreferences", "CoreData", "Offline-first Apps", "File I/O"],
                "resources": [{"title": "Local Data Storage", "link": "https://developer.android.com/training/data-storage"}],
                "practice": ["Store user settings", "Create CRUD operations locally", "Mini Project: Offline Notes App"]
            },
            {
                "order": 5, "title": "Networking & APIs", "description": "Connect mobile apps to the internet.",
                "skills": ["REST APIs", "JSON Parsing", "Retrofit / HTTP", "Error Handling", "OAuth Authentication"],
                "resources": [{"title": "API Integration Guide", "link": "https://flutter.dev/docs/cookbook/networking/fetch-data"}],
                "practice": ["Fetch data from public API", "Implement login screen", "Mini Project: Weather App"]
            },
            {
                "order": 6, "title": "Advanced Features", "description": "Interact with device hardware and services.",
                "skills": ["Camera API", "Location & Maps", "Push Notifications", "Background Services", "Animations"],
                "resources": [{"title": "Firebase Notifications", "link": "https://firebase.google.com/docs/cloud-messaging"}],
                "practice": ["Integrate Google Maps", "Show local notifications", "Mini Project: Expense tracker with camera receipts"]
            },
            {
                "order": 7, "title": "App Store Deployment & Prep", "description": "Publish your app and prepare for interviews.",
                "skills": ["App Testing (Unit/Widget)", "Mobile CI/CD", "Google Play / App Store Submission", "App Optimization", "Mobile Dev Interviews"],
                "resources": [{"title": "App Store Guidelines", "link": "https://developer.apple.com/app-store/review/guidelines/"}],
                "practice": ["Write widget tests", "Publish app to internal track", "Final Outcome: Placement ready Mobile Developer"]
            }
        ],
        'Cloud Computing': [
            {
                "order": 1, "title": "IT Fundamentals & Virtualization", "description": "Understand the systems behind the cloud.",
                "skills": ["Virtual Machines vs Containers", "Hypervisors", "Linux Basics for Cloud", "Networking Fundamentals", "IP Addressing & Subnets"],
                "resources": [{"title": "Cloud Computing Fundamentals", "link": "https://aws.amazon.com/what-is-cloud-computing/"}],
                "practice": ["Launch a local VM", "Configure IP subnets", "Mini Project: Local virtualization setup"]
            },
            {
                "order": 2, "title": "Cloud Computing Basics", "description": "Core concepts of public cloud providers.",
                "skills": ["IaaS, PaaS, SaaS", "Public vs Private Cloud", "Cloud Architecture Overview", "AWS/Azure/GCP Intro", "Cloud Economics"],
                "resources": [{"title": "AWS Cloud Practitioner Basics", "link": "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/"}],
                "practice": ["Create cloud provider account", "Set up billing alarms", "Mini Project: Compare cloud provider pricing"]
            },
            {
                "order": 3, "title": "Core Cloud Services", "description": "Virtual instances and storage.",
                "skills": ["Compute Instances (EC2)", "Object Storage (S3)", "Block Storage (EBS)", "Load Balancers (ELB)", "Auto Scaling Groups"],
                "resources": [{"title": "EC2 and S3 Documentation", "link": "https://docs.aws.amazon.com/ec2/"}],
                "practice": ["Launch an EC2 instance", "Host static website on S3", "Mini Project: Highly available web server"]
            },
            {
                "order": 4, "title": "Identity, Access & Security", "description": "Secure your cloud environments.",
                "skills": ["IAM (Identity Access Management)", "Roles and Policies", "VPC & Subnets", "Security Groups", "Encryption (KMS)"],
                "resources": [{"title": "AWS Security Best Practices", "link": "https://aws.amazon.com/architecture/security-identity-compliance/"}],
                "practice": ["Create least-privilege IAM roles", "Build a custom VPC", "Mini Project: Secure network architecture"]
            },
            {
                "order": 5, "title": "Databases & Serverless", "description": "Managed databases and event-driven computing.",
                "skills": ["Relational DBs (RDS)", "NoSQL (DynamoDB)", "Serverless Computing", "AWS Lambda", "API Gateway"],
                "resources": [{"title": "Serverless Architectures", "link": "https://aws.amazon.com/serverless/"}],
                "practice": ["Deploy an RDS instance", "Write a Lambda function", "Mini Project: Serverless REST API"]
            },
            {
                "order": 6, "title": "Cloud Automation & DevOps", "description": "Manage infrastructure via code and monitor it.",
                "skills": ["CloudFormation / Terraform", "Cloud Monitoring (CloudWatch)", "CI/CD Integration", "Event Triggers", "Disaster Recovery"],
                "resources": [{"title": "Infrastructure as Code", "link": "https://roadmap.sh/devops"}],
                "practice": ["Deploy stack via CloudFormation", "Setup CloudWatch alarms", "Mini Project: Automated cloud deployment pipeline"]
            },
            {
                "order": 7, "title": "Cloud Certification & Placement", "description": "Acquire certs and land a cloud role.",
                "skills": ["AWS Solutions Architect Prep", "Cloud Cost Optimization", "System Design", "Whiteboarding Architecture", "Mock Interviews"],
                "resources": [{"title": "Solutions Architect Guide", "link": "https://aws.amazon.com/certification/certified-solutions-architect-associate/"}],
                "practice": ["Draw system architecture diagrams", "Pass practice exam", "Final Outcome: Placement ready Cloud Engineer"]
            }
        ]
    }

    for domain_name, roadmap_data in roadmaps.items():
        domain, created = Domain.objects.get_or_create(name=domain_name)
        
        # Delete existing stages to replace
        Stage.objects.filter(domain=domain).delete()
        
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
        try:
            first_stage = Stage.objects.get(domain=domain, order=1)
            for user in User.objects.filter(domain=domain):
                Progress.objects.get_or_create(user=user, stage=first_stage, defaults={'unlocked': True})
        except Stage.DoesNotExist:
            print(f"Warning: First stage for {domain_name} could not be found.")

        print(f"Successfully populated 7-stage {domain_name} roadmap.")

if __name__ == '__main__':
    populate_all_roadmaps()
