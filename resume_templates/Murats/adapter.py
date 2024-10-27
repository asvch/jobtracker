from datetime import datetime


def format_date(date_str):
    if not date_str:
        return ""

    date_obj = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    return date_obj.strftime("%b %Y")


def convert(profile):
    names = profile.fullName.split(" ")
    firstName, lastName = " ".join(names[:-1]), names[-1]
    data = {
        "firstName": firstName,
        "lastName": lastName,
        "avatar": "pfp.png",
        "summary": profile.summary,
        "email": profile.email,
        "phone": profile.phone_number,
        "github": profile.github,
        "address": profile.address,
        "family_status": profile.family_status,
        "languages": [lang["label"] for lang in profile.languages],
        "skills": [s["label"] for s in profile.skills],
        "experience": [
            {
                "title": exp["title"],
                "company": exp["companyName"],
                "dates": f"{format_date(exp['startDate'])}--{format_date(exp['endDate']) or 'present'}",
                "description": exp["bullets"],
            }
            for exp in profile.experiences
        ],
        "education": [
            {
                "degree": edu["degree"],
                "institution": edu["institutionName"],
                "dates": f"{format_date(edu['startDate'])}--{format_date(edu['endDate']) or "present"}",
                "description": edu["bullets"],
            }
            for edu in profile.education
        ],
        "hobbies": [hobby["label"] for hobby in profile.hobbies],
    }

    return data
