import jinja2

# Define the data
data = {
    "name": "Guillaume Ouancaux",
    "profile_description": "Innovative and passionate data analyst with over 15 years of experience in the chocolate and confectionery industry.",
    "email": "wonky.william123@gmail.com",
    "phone": "+352 123 456 789",
    "github": "https://github.com/WillyWonka",
    "address": "49 Paddocks Spring, Farthingtonshire SG2 9UD, UK",
    "citizenship": "United Kingdom",
    "family_status": "Single without children",
    "languages": [
        "French (B2)",
        "Luxembourgish (A2)",
        "German (A1)",
        "English (native)",
    ],
    "skills": [
        "Python",
        "SQL",
        "PySpark",
        "R",
        "Matlab",
        "Azure Databricks",
        "MS Word",
        "Excel",
        "PowerPoint",
    ],
    "experience": [
        {
            "title": "Senior Data Scientist",
            "company": "Shockelasrull (Luxembourg)",
            "dates": "2021.04--pres.",
            "description": "Natural language processing, topic modelling, olfactory analysis, building chained processes, automation of reports.",
        },
        {
            "title": "Data Scientist",
            "company": "Chocky-Facky SA (United Kingdom)",
            "dates": "2019.02--2020.11",
            "description": "Predictive models for consumer taste preferences, market trend analysis, advanced data visualisation, negotiations with stakeholders.",
        },
        # Add more experience entries as needed
    ],
    "education": [
        {
            "degree": "Master in Economics",
            "specialization": "Mathematical Methods of Economic Analysis",
            "institution": "University of Sweets and Treats",
            "dates": "2013--2015",
            "thesis": "Thesis title: The Effect of Beverage Sugar Content on Their Shelf Life.",
        },
        # Add more education entries as needed
    ],
    "additional_education": [
        {
            "title": "Stanford introduction to food and health",
            "institution": "Coursera",
            "dates": "2021",
            "details": "Contemporary trends in eating, cooking workshop, future directions in health.",
        },
        # Add more additional education entries as needed
    ],
    "hobbies": [
        "Music: imitating birds on the banjo, composing and decomposing (morally)",
        "Poetry: inventing rhymes, surreal art",
        "Miscellaneous: zoology, mycology, trainspotting, 1930s horror films",
    ],
}

# Set up the Jinja2 environment
env = jinja2.Environment(loader=jinja2.FileSystemLoader("."))
template = env.get_template("src.tex")

# Render the template with data
rendered_cv = template.render(data)

# Save to a .tex file
with open("generated_cv.tex", "w") as f:
    f.write(rendered_cv)

print("CV generated successfully as 'generated_cv.tex'")
