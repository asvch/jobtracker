import jinja2


def generate_cv(profile):
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
        "languages": profile.languages,
        "skills": profile.skills,
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
        "hobbies": profile.hobbies,
        # TODO: @cyril add achievements section
    }

    # Set up the Jinja2 environment
    env = jinja2.Environment(loader=jinja2.FileSystemLoader("."))
    template = env.get_template("src.tex")

    # Render the template with data
    rendered_cv = template.render(data)

    # Save to a .tex file
    with open("out.tex", "w") as f:
        f.write(rendered_cv)
