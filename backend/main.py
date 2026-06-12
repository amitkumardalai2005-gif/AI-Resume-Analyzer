from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import fitz
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SKILLS = [
    "python",
    "java",
    "sql",
    "react",
    "javascript",
    "html",
    "css",
    "docker",
    "git",
    "fastapi",
    "postgresql",
    "machine learning",
    "networking",
    "c programming"
]


@app.get("/")
def home():
    return {"message": "Backend Running"}


@app.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form("")
):

    pdf_bytes = await file.read()

    pdf = fitz.open(
        stream=pdf_bytes,
        filetype="pdf"
    )

    resume_text = ""

    for page in pdf:
        resume_text += page.get_text()

    text_lower = resume_text.lower()
    jd_lower = job_description.lower()

    skills_found = []
    needed_skills = []

    for skill in SKILLS:

        if skill in text_lower:
            skills_found.append(skill)

        if skill in jd_lower:
            needed_skills.append(skill)

    matched_skills = [
        skill for skill in needed_skills
        if skill in skills_found
    ]

    missing_skills = [
        skill for skill in needed_skills
        if skill not in skills_found
    ]

    match_score = 0

    if len(needed_skills) > 0:
        match_score = int(
            len(matched_skills)
            / len(needed_skills)
            * 100
        )

    ats_score = int(
        len(skills_found)
        / len(SKILLS)
        * 100
    )

    suggestions = []

    for skill in missing_skills:
        suggestions.append(
            f"Add projects or experience in {skill}"
        )

    email = ""

    email_match = re.search(
        r'[\w\.-]+@[\w\.-]+',
        resume_text
    )

    if email_match:
        email = email_match.group()

    phone = ""

    phone_match = re.search(
        r'(\+91)?[0-9]{10}',
        resume_text
    )

    if phone_match:
        phone = phone_match.group()

    linkedin = ""

    linkedin_match = re.search(
        r'https?://(?:www\.)?linkedin\.com/[^\s]+',
        resume_text
    )

    if linkedin_match:
        linkedin = linkedin_match.group()

    return {
        "ats_score": ats_score,
        "match_score": match_score,
        "skills_found": skills_found,
        "needed_skills": needed_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "resume_preview": resume_text[:3000]
    }