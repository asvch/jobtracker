# Resume Templates

- Resume templates is a feature that allows generating a resume using pre-defined templates with user data.

- It works using Jinja2 (Mustache style templating engine for Python) templated latex files.

- To create a new resume template, create a new folder in `resume_templates` with the following files:

  - `src.tex` - Latex file with Jinja2 templating.
  - `adapter.py` - A Python file that has a function named `convert` accepting a profile/user object (see the Users Class in app.py) and returning a hashmap (key-value pairs) that will be used to replace the mustache variables in the src.tex file
  - `sample.pdf` - A sample pdf file of the resume template with some fake data.

- Be careful while combining Jinja and Latex syntaxes as both make use of curly braces.
  Eg: `Name: \textbf{ {{ name }} }` would not be rendered correctly by jinja. You should escape the outermost pair of curly braces like `Name: \textbf{{'{'}}{{ name }}{{'}'}}`, this would be correctly rendered to `Name: \textbf{<name>}`.

- Once a new template is created run the below script to copy the sample pdf files to the frontend's public folder:

  ```bash
  mkdir -p public/resume-templates && \
      for dir in /resume_templates/*; do \
          if [ -d "$dir" ]; then \
              folder_name=$(basename "$dir"); \
              cp "$dir/sample.pdf" "public/resume-templates/${folder_name}.pdf"; \
          fi; \
      done
  ```
