def convert(profile):
    data = {
        "name": profile.fullName,
        "avatar": "pfp.png",
        "profile_description": profile.summary,
        "email": profile.email,
        "phone": profile.phone_number,
        "github": profile.github,
        "address": profile.address,
        "citizenship": profile.citizenship,
        "family_status": profile.family_status,
        "languages": [lang["label"] for lang in profile.languages],
        "skills": [s["label"] for s in profile.skills],
        "experience": [
            {
                "title": exp.title,
                "company": exp.name,
                "dates": f"{exp.start_date}--{exp.end_date or "present"}",
                "description": exp.bullets,
            }
            for exp in profile.experiences
        ],
        "education": [
            {
                "degree": "edu.degree",
                "institution": edu.name,
                "dates": f"{edu.start_date}--{edu.end_date or "present"}",
                "description": edu.bullets,
            }
            for edu in profile.education
        ],
        "hobbies": [hobby["label"] for hobby in profile.hobbies],
    }

    return data
