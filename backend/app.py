"""
The flask application for our program
"""

# importing required python libraries
from flask import Flask, jsonify, request, send_file, redirect, url_for, session
from flask_mongoengine import MongoEngine
from markupsafe import escape
from flask_cors import CORS, cross_origin
from bs4 import BeautifulSoup
from itertools import islice
from bson.json_util import dumps
from io import BytesIO
from fake_useragent import UserAgent
import pandas as pd
import json
from datetime import datetime, timedelta
import hashlib
import uuid
import requests
import random
from authlib.integrations.flask_client import OAuth
from authlib.common.security import generate_token
import os
from dotenv import load_dotenv
import shutil
import jinja2
import base64

from util import load_and_run_function

load_dotenv()

existing_endpoints = ["/applications", "/resume"]

user_agent = UserAgent()


def create_app():
    """
    Creates a server hosted on localhost

    :return: Flask object
    """
    app = Flask(__name__)
    # # make flask support CORS
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CONF_URL, SECRET_KEY = (
        os.getenv("GOOGLE_CLIENT_ID"),
        os.getenv("GOOGLE_CLIENT_SECRET"),
        os.getenv("CONF_URL"),
        os.getenv("SECRET_KEY"),
    )

    app.secret_key = SECRET_KEY

    oauth = OAuth(app)

    @app.errorhandler(404)
    def page_not_found(e):
        """
        Returns a json object to indicate error 404

        :return: JSON object
        """
        return jsonify({"error": "Not Found"}), 404

    @app.errorhandler(405)
    # pylint: disable=C0103
    def page_not_allowed(e):
        """
        Returns a json object to indicate error 405

        :return: JSON object
        """
        return jsonify({"error": "Method not Allowed"}), 405

    @app.before_request
    def middleware():
        """
        Checks for user authorization tokens and returns message

        :return: JSON object
        """
        try:
            if request.method == "OPTIONS":
                return jsonify({"success": "OPTIONS"}), 200
            if request.path in existing_endpoints:
                headers = request.headers
                try:
                    token = headers["Authorization"].split(" ")[1]
                except:
                    return jsonify({"error": "Unauthorized"}), 401
                userid = token.split(".")[0]
                user = Users.objects(id=userid).first()

                if user is None:
                    return jsonify({"error": "Unauthorized"}), 401

                expiry_flag = False
                for tokens in user["authTokens"]:
                    if tokens["token"] == token:
                        expiry = tokens["expiry"]
                        expiry_time_object = datetime.strptime(
                            expiry, "%m/%d/%Y, %H:%M:%S"
                        )
                        if datetime.now() <= expiry_time_object:
                            expiry_flag = True
                        else:
                            delete_auth_token(tokens, userid)
                        break

                if not expiry_flag:
                    return jsonify({"error": "Unauthorized"}), 401

        except:
            return jsonify({"error": "Internal server error"}), 500

    def get_token_from_header():
        """
        Evaluates token from the request header

        :return: string
        """
        headers = request.headers
        token = headers["Authorization"].split(" ")[1]
        return token

    def get_userid_from_header():
        """
        Evaluates user id from the request header

        :return: string
        """
        headers = request.headers
        token = headers["Authorization"].split(" ")[1]
        print(token)
        userid = token.split(".")[0]
        return userid

    def delete_auth_token(token_to_delete, user_id):
        """
        Deletes authorization token of the given user from the database

        :param token_to_delete: token to be deleted
        :param user_id: user id of the current active user
        :return: string
        """
        user = Users.objects(id=user_id).first()
        auth_tokens = []
        for token in user["authTokens"]:
            if token != token_to_delete:
                auth_tokens.append(token)
        user.update(authTokens=auth_tokens)

    @app.route("/")
    @cross_origin()
    def health_check():
        return jsonify({"message": "Server up and running"}), 200

    @app.route("/users/signupGoogle")
    def signupGoogle():

        oauth.register(
            name="google",
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET,
            server_metadata_url=CONF_URL,
            client_kwargs={"scope": "openid email profile"},
            nonce="foobar",
        )

        # Redirect to google_auth function
        redirect_uri = url_for("authorized", _external=True)
        print(redirect_uri)

        session["nonce"] = generate_token()
        return oauth.google.authorize_redirect(redirect_uri, nonce=session["nonce"])

    @app.route("/users/signupGoogle/authorized")
    def authorized():
        token = oauth.google.authorize_access_token()
        user = oauth.google.parse_id_token(token, nonce=session["nonce"])
        session["user"] = user

        user_exists = Users.objects(email=user["email"]).first()

        users_email = user["email"]
        full_name = user["given_name"] + " " + user["family_name"]

        if user["email_verified"]:
            if user_exists is None:
                userSave = Users(
                    id=get_new_user_id(),
                    fullName=full_name,
                    email=users_email,
                    authTokens=[],
                    applications=[],
                    skills=[],
                    job_levels=[],
                    locations=[],
                    phone_number="",
                    address="",
                )
                userSave.save()
                unique_id = userSave["id"]
            else:
                unique_id = user_exists["id"]

        userSaved = Users.objects(email=user["email"]).first()
        expiry = datetime.now() + timedelta(days=1)
        expiry_str = expiry.strftime("%m/%d/%Y, %H:%M:%S")
        token_whole = str(unique_id) + "." + token["access_token"]
        auth_tokens_new = userSaved["authTokens"] + [
            {"token": token_whole, "expiry": expiry_str}
        ]
        userSaved.update(authTokens=auth_tokens_new)

        return redirect(
            f"{os.environ.get("BASE_FRONTEND_URL")}/?token={token_whole}&expiry={expiry_str}&userId={unique_id}"
        )

    @app.route("/users/signup", methods=["POST"])
    def sign_up():
        """
        Creates a new user profile and adds the user to the database and returns the message

        :return: JSON object
        """
        try:
            # print(request.data)
            data = json.loads(request.data)
            print(data)
            try:
                _ = data["username"]
                _ = data["password"]
                _ = data["fullName"]
            except:
                return jsonify({"error": "Missing fields in input"}), 400

            username_exists = Users.objects(username=data["username"])
            if len(username_exists) != 0:
                return jsonify({"error": "Username already exists"}), 400
            password = data["password"]
            password_hash = hashlib.md5(password.encode())
            user = Users(
                id=get_new_user_id(),
                fullName=data["fullName"],
                username=data["username"],
                password=password_hash.hexdigest(),
                authTokens=[],
                applications=[],
                skills=[],
                job_levels=[],
                locations=[],
                phone_number="",
                address="",
                institution="",
                email="",
            )
            user.save()
            # del user.to_json()["password", "authTokens"]
            return jsonify(user.to_json()), 200
        except:
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/getProfile", methods=["GET"])
    def get_profile_data():
        """
        Gets user's profile data from the database

        :return: JSON object with application data
        """
        try:
            userid = get_userid_from_header()
            user = Users.objects(id=userid).first()

            FIELDS_TO_EXCLUDE = [
                "id",
                "_id",
                "username",
                "password",
                "authTokens",
                "applications",
                "resume",
            ]

            cleaned_user = {
                key: value
                for key, value in user.to_mongo().items()
                if key not in FIELDS_TO_EXCLUDE
            }

            return jsonify(cleaned_user), 200
        except Exception as err:
            print(err)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/updateProfile", methods=["POST"])
    def updateProfilePreferences():
        """
        Update the user profile with preferences: skills, job-level and location
        """
        try:
            print(request.data)
            userid = get_userid_from_header()
            user = Users.objects(id=userid).first()
            data = json.loads(request.data)
            print(user)

            for key in data.keys():
                user[key] = data[key]

            user.save()
            return jsonify(user.to_json()), 200

        except Exception as err:
            print(err)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/getRecommendations", methods=["GET"])
    def getRecommendations():
        """
        Update the user profile with preferences: skills, job-level and location
        """
        try:
            userid = get_userid_from_header()
            user = Users.objects(id=userid).first()
            print(user["skills"])
            skill_sets = [x["value"] for x in user["skills"]]
            job_levels_sets = [x["value"] for x in user["job_levels"]]
            locations_set = [x["value"] for x in user["locations"]]
            recommendedJobs = []
            headers = {
                "User-Agent":
                #    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
                user_agent.random,
                "Referrer": "https://www.google.com/",
            }
            if (
                len(skill_sets) > 0
                or len(job_levels_sets) > 0
                or len(locations_set) > 0
            ):
                random_skill = random.choice(skill_sets)
                random_job_level = random.choice(job_levels_sets)
                random_location = random.choice(locations_set)
                query = f"https://www.google.com/search?q={random_skill}+{random_job_level}+{random_location} &ibp=htl;jobs"
                print(query)

            else:
                query = "https://www.google.com/search?q=" + "sde usa" + "&ibp=htl;jobs"

            page = requests.get(query, headers=headers)
            soup = BeautifulSoup(page.text, "html.parser")
            # KGjGe - div class to get url
            mydivs = soup.find_all("div", class_="mqj2af")
            for div in mydivs:
                job = {}
                job["jobLink"] = div.find("a", class_="MQUd2b").get("href")
                job["jobTitle"] = div.find("div", {"class": "tNxQIb PUpOsf"}).text
                job["companyName"] = div.find(
                    "div", {"class": "wHYlTd MKCbgd a3jPc"}
                ).text
                job["location"] = (
                    div.find("div", {"class": "wHYlTd FqK3wc MKCbgd"})
                    .text.split("•")[0]
                    .split("via")[0]
                )
                recommendedJobs.append(job)
            print(recommendedJobs)
            return jsonify(recommendedJobs)

        except Exception as err:
            print(err)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/users/login", methods=["POST"])
    def login():
        """
        Logs in the user and creates a new authorization token and stores in the database

        :return: JSON object with status and message
        """
        try:
            try:
                data = json.loads(request.data)
                _ = data["username"]
                _ = data["password"]
            except:
                return jsonify({"error": "Username or password missing"}), 400
            password_hash = hashlib.md5(data["password"].encode()).hexdigest()
            user = Users.objects(
                username=data["username"], password=password_hash
            ).first()
            if user is None:
                return jsonify({"error": "Wrong username or password"})
            token = str(user["id"]) + "." + str(uuid.uuid4())
            expiry = datetime.now() + timedelta(days=1)
            expiry_str = expiry.strftime("%m/%d/%Y, %H:%M:%S")
            auth_tokens_new = user["authTokens"] + [
                {"token": token, "expiry": expiry_str}
            ]
            user.update(authTokens=auth_tokens_new)

            FIELDS_TO_EXCLUDE = [
                "_id",
                "username",
                "password",
                "applications",
                "resume",
            ]

            cleaned_user = {
                key: value
                for key, value in user.to_mongo().items()
                if key not in FIELDS_TO_EXCLUDE
            }

            return jsonify(
                {"profile": cleaned_user, "token": token, "expiry": expiry_str}
            )

        except:
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/users/logout", methods=["POST"])
    def logout():
        """
        Logs out the user and deletes the existing token from the database

        :return: JSON object with status and message
        """
        try:
            userid = get_userid_from_header()
            user = Users.objects(id=userid).first()
            auth_tokens = []
            incoming_token = get_token_from_header()
            for token in user["authTokens"]:
                if token["token"] != incoming_token:
                    auth_tokens.append(token)
            user.update(authTokens=auth_tokens)

            return jsonify({"success": ""}), 200

        except:
            return jsonify({"error": "Internal server error"}), 500

    # search function
    # params:
    #   -keywords: string
    @app.route("/search")
    def search():
        """
        Searches the web and returns the job postings for the given search filters keywords, location, and job type.
        We added new functionality of searching for job postings based on location and job type.

        Parameters:
        request: Flask request object
        The incoming request containing search parameters:
        - keywords (str): The search keywords provided by the user. Defaults to "random_test_keyword" if not provided.
        - location (str): The location to search for jobs. Optional.
        - jobType (str): The type of job (e.g., full-time, part-time). Optional.


        :return: JSON object with job results and creates a URL with the search parameters for application
        """
        keywords = (
            request.args.get("keywords")
            if request.args.get("keywords")
            else "random_test_keyword"
        )
        location = request.args.get("location") if request.args.get("location") else ""
        job_type = request.args.get("jobType") if request.args.get("jobType") else ""
        keywords = keywords.replace(" ", "+")
        if keywords == "random_test_keyword":
            return json.dumps({"label": str("successful test search")})
        # create a url for a crawler to fetch job information
        url = "https://www.google.com/search?q=" + keywords

        # Check for location or job type to modify the URL
        if location and job_type:
            url += "%20near%20" + location + "%20" + job_type
        elif location:
            url += "%20near%20" + location
        elif job_type:
            url += "%20" + job_type

        url += "&ibp=htl;jobs"

        print(user_agent.random)
        headers = {
            "User-Agent":
            #    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
            user_agent.random,
            "Referrer": "https://www.google.com/",
        }

        page = requests.get(url, headers=headers)
        soup = BeautifulSoup(page.text, "html.parser")

        # parsing searching results to DataFrame and return
        df = pd.DataFrame(
            columns=[
                "jobTitle",
                "jobLink",
                "companyName",
                "location",
                "date",
                "qualifications",
                "responsibilities",
                "benefits",
            ]
        )
        mydivs = soup.find_all("div", class_="mqj2af")

        for i, div in enumerate(mydivs):
            df.at[i, "jobTitle"] = div.find("div", {"class": "tNxQIb PUpOsf"}).text
            df.at[i, "companyName"] = div.find(
                "div", {"class": "wHYlTd MKCbgd a3jPc"}
            ).text
            df.at[i, "location"] = div.find(
                "div", {"class": "wHYlTd FqK3wc MKCbgd"}
            ).text.split("•")[0]
            df.at[i, "date"] = div.find_all("span", {"class": "Yf9oye"}, limit=1)[
                0
            ].text

            apply_link = div.find("a", class_="MQUd2b")
            if apply_link:
                link_href = apply_link.get("href")
                link_text = apply_link.get("title") or "Apply"
                clickable_link = (
                    f'<a href="{link_href}" target="_blank">{link_text}</a>'
                )

                df.at[i, "jobLink"] = clickable_link

            # Collect Job Description Details
            desc = div.find_all("div", {"class": "JxVj3d"})
            for ele in desc:
                arr = list(x.text for x in ele.find_all("div", {"class": "nDgy9d"}))
                title = ele.find("div", {"class": "iflMsb"}).text
                if arr:
                    df.at[i, str(title).lower()] = arr
        missingCols = list((df.loc[:, df.isnull().sum(axis=0).astype(bool)]).columns)

        for col in missingCols:
            df.loc[df[col].isnull(), [col]] = df.loc[df[col].isnull(), col].apply(
                lambda x: []
            )
        # df.loc[df["benefits"].isnull(), ["benefits"]] = df.loc[df["benefits"].isnull(), "benefits"].apply(lambda x: [])
        return jsonify(df.to_dict("records"))

    # get data from the CSV file for rendering root page
    @app.route("/applications", methods=["GET"])
    def get_data():
        """
        Gets user's applications data from the database

        :return: JSON object with application data
        """
        try:
            userid = get_userid_from_header()
            user = Users.objects(id=userid).first()
            applications = user["applications"]
            return jsonify(applications)
        except:
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/applications", methods=["POST"])
    def add_application():
        """
        Add a new job application for the user

        :return: JSON object with status and message
        """
        try:
            userid = get_userid_from_header()
            try:
                request_data = json.loads(request.data)["application"]
                _ = request_data["jobTitle"]
                _ = request_data["companyName"]
            except:
                return jsonify({"error": "Missing fields in input"}), 400

            user = Users.objects(id=userid).first()
            current_application = {
                "id": get_new_application_id(userid),
                "jobTitle": request_data["jobTitle"],
                "companyName": request_data["companyName"],
                "date": request_data.get("date"),
                "jobLink": request_data.get("jobLink"),
                "location": request_data.get("location"),
                "status": request_data.get("status", "1"),
            }
            applications = user["applications"] + [current_application]

            user.update(applications=applications)
            return jsonify(current_application), 200
        except:
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/applications/<int:application_id>", methods=["PUT"])
    def update_application(application_id):
        """
        Updates the existing job application for the user

        :param application_id: Application id to be modified
        :return: JSON object with status and message
        """
        try:
            userid = get_userid_from_header()
            try:
                request_data = json.loads(request.data)["application"]
            except:
                return jsonify({"error": "No fields found in input"}), 400

            user = Users.objects(id=userid).first()
            current_applications = user["applications"]

            if len(current_applications) == 0:
                return jsonify({"error": "No applications found"}), 400
            else:
                updated_applications = []
                app_to_update = None
                application_updated_flag = False
                for application in current_applications:
                    if application["id"] == application_id:
                        app_to_update = application
                        application_updated_flag = True
                        for key, value in request_data.items():
                            application[key] = value
                    updated_applications += [application]
                if not application_updated_flag:
                    return jsonify({"error": "Application not found"}), 400
                user.update(applications=updated_applications)

            return jsonify(app_to_update), 200
        except:
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/applications/<int:application_id>", methods=["DELETE"])
    def delete_application(application_id):
        """
        Deletes the given job application for the user

        :param application_id: Application id to be modified
        :return: JSON object with status and message
        """
        try:
            userid = get_userid_from_header()
            user = Users.objects(id=userid).first()

            current_applications = user["applications"]

            application_deleted_flag = False
            updated_applications = []
            app_to_delete = None
            for application in current_applications:
                if application["id"] != application_id:
                    updated_applications += [application]
                else:
                    app_to_delete = application
                    application_deleted_flag = True

            if not application_deleted_flag:
                return jsonify({"error": "Application not found"}), 400
            user.update(applications=updated_applications)
            return jsonify(app_to_delete), 200
        except:
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/resume", methods=["POST"])
    def upload_resume():
        """
        Uploads resume file or updates an existing resume for the user

        :return: JSON object with status and message
        """
        try:
            userid = get_userid_from_header()
            try:
                file = request.files["file"]  # .read()
            except:
                return jsonify({"error": "No resume file found in the input"}), 400

            user = Users.objects(id=userid).first()
            if not user.resume.read():
                # There is no file
                user.resume.put(
                    file, filename=file.filename, content_type="application/pdf"
                )
                user.save()
                return jsonify({"message": "resume successfully uploaded"}), 200
            else:
                # There is a file, we are replacing it
                user.resume.replace(
                    file, filename=file.filename, content_type="application/pdf"
                )
                user.save()
                return jsonify({"message": "resume successfully replaced"}), 200
        except Exception as e:
            print(e)
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/resumeTemplates", methods=["GET"])
    def get_resume_templates():
        """
        Returns a list of available resume templates
        """
        try:
            base_path = "../resume_templates"
            templates_names = [
                d
                for d in os.listdir(base_path)
                if os.path.isdir(os.path.join(base_path, d))
                and os.path.exists(os.path.join(base_path, d, "sample.pdf"))
            ]

            return templates_names, 200

        except:
            return jsonify({"error": "Internal server error"}), 500

    @app.route("/generateResume", methods=["POST"])
    def generate_resume():
        """
        Generates a resume based on the provided template and user data
        """
        try:
            userid = get_userid_from_header()
            user = Users.objects(id=userid).first()
            data = json.loads(request.data)
            template_name = data.get("templateName")

            # Make a temp workspace
            temp_dir = f"/tmp/{uuid.uuid4()}"
            os.makedirs(temp_dir, exist_ok=True)

            # Copy the template files to the temp directory
            template_dir = f"../resume_templates/{template_name}"
            for item in os.listdir(template_dir):
                s = os.path.join(template_dir, item)
                d = os.path.join(temp_dir, item)
                if not os.path.isdir(s):
                    shutil.copy2(s, d)

            # Load the template
            env = jinja2.Environment(loader=jinja2.FileSystemLoader(temp_dir))
            template = env.get_template("src.tex")

            # Transform user data into a format suitable for the template
            data = load_and_run_function(
                os.path.join(template_dir, "adapter.py"), "convert", user
            )

            # save the user's profile picture as "pfp.png" in the temp directory
            raw_user_picture = user.picture

            if raw_user_picture and raw_user_picture.startswith(
                "data:image/png;base64,"
            ):
                raw_user_picture = raw_user_picture.replace(
                    "data:image/png;base64,", ""
                )

                with open(os.path.join(temp_dir, "pfp.png"), "wb") as file:
                    image_data = base64.b64decode(raw_user_picture)
                    file.write(image_data)

            rendered_tex = template.render(data)

            # Save the rendered LaTeX to a file
            tex_file_path = os.path.join(temp_dir, "output.tex")
            with open(tex_file_path, "w") as tex_file:
                tex_file.write(rendered_tex)

            # Compile the LaTeX file to PDF
            os.system(
                f"pdflatex -interaction=nonstopmode -output-directory={temp_dir} {tex_file_path}"
            )

            # Send the generated PDF back to the user
            pdf_file_path = os.path.join(temp_dir, "output.pdf")

            resp = send_file(
                pdf_file_path, as_attachment=True, mimetype="application/pdf"
            )

            return resp
        except Exception as e:
            print(e)
            return jsonify({"error": "Internal server error"}), 500
        finally:
            # Cleanup the temp directory
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)

    @app.route("/resume", methods=["GET"])
    def get_resume():
        """
        Retrieves the resume file for the user

        :return: response with file
        """
        try:
            userid = get_userid_from_header()
            try:
                user = Users.objects(id=userid).first()
                if len(user.resume.read()) == 0:
                    raise FileNotFoundError
                else:
                    user.resume.seek(0)

            except:
                return jsonify({"error": "resume could not be found"}), 400

            filename = user.resume.filename
            content_type = user.resume.contentType
            response = send_file(
                user.resume,
                mimetype=content_type,
                download_name=filename,
                as_attachment=True,
            )
            response.headers["x-filename"] = filename
            response.headers["Access-Control-Expose-Headers"] = "x-filename"
            return response, 200
        except:
            return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()

app.config["MONGODB_SETTINGS"] = {
    "db": "appTracker",
    "host": os.getenv("MONGODB_HOST_STRING"),
}

db = MongoEngine()
db.init_app(app)


class Users(db.Document):
    """
    Users class. Holds full name, username, password, as well as applications and resumes
    """

    id = db.IntField(primary_key=True)
    fullName = db.StringField()
    username = db.StringField()
    password = db.StringField()
    authTokens = db.ListField()
    email = db.StringField()
    applications = db.ListField()
    resume = db.FileField()
    skills = db.ListField()
    job_levels = db.ListField()
    locations = db.ListField()
    institution = db.StringField()
    phone_number = db.StringField()
    address = db.StringField()

    ## Additional resume fields
    picture = db.StringField()
    summary = db.StringField()
    github = db.StringField()
    citizenship = db.StringField()
    family_status = db.StringField()
    languages = db.ListField()
    experiences = db.ListField()
    education = db.ListField()
    hobbies = db.ListField()

    def to_json(self):
        """
        Returns the user details in JSON object

        :return: JSON object
        """
        return {"id": self.id, "fullName": self.fullName, "username": self.username}


def get_new_user_id():
    """
    Returns the next value to be used for new user

    :return: key with new user_id
    """
    user_objects = Users.objects()
    if len(user_objects) == 0:
        return 1

    new_id = 0
    for a in user_objects:
        new_id = max(new_id, a["id"])

    return new_id + 1


def get_new_application_id(user_id):
    """
    Returns the next value to be used for new application

    :param: user_id: User id of the active user
    :return: key with new application_id
    """
    user = Users.objects(id=user_id).first()

    if len(user["applications"]) == 0:
        return 1

    new_id = 0
    for a in user["applications"]:
        new_id = max(new_id, a["id"])

    return new_id + 1


# def build_preflight_response():
# response = make_response()
# response.headers.add("Access-Control-Allow-Origin", "*")
# response.headers.add('Access-Control-Allow-Headers', "*")
# response.headers.add('Access-Control-Allow-Methods', "*")
# return response
# def build_actual_response(response):
# response.headers.add("Access-Control-Allow-Origin", "*")
# return response

if __name__ == "__main__":
    app.run()
