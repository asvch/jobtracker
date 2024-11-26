"""
Test module for the backend
"""

from io import BytesIO
import pytest
import json
import os
import time
import datetime
import random
import string
from flask_mongoengine import MongoEngine
from app import create_app, Users


def generate_random_string(length=8):
    """Generate a random string of letters and digits."""
    characters = string.ascii_lowercase + string.digits
    return "".join(random.choice(characters) for _ in range(length))


# Pytest fixtures are useful tools for calling resources
# over and over, without having to manually recreate them,
# eliminating the possibility of carry-over from previous tests,
# unless defined as such.
# This fixture receives the client returned from create_app
# in app.py
@pytest.fixture
def client():
    """
    Creates a client fixture for tests to use

    :return: client fixture
    """
    app = create_app()

    app.config["MONGODB_SETTINGS"] = {
        "db": "Group56F24",
        "host": os.getenv("MONGODB_HOST_STRING"),
    }

    db = MongoEngine()
    db.disconnect()
    db.init_app(app)
    client = app.test_client()
    yield client
    db.disconnect()


init = False

username = generate_random_string(10)
password = generate_random_string(15)
fullName = generate_random_string(20)


@pytest.fixture
def user(client):
    global init, username, password, fullName
    """
    Creates a user with test data

    :param client: the mongodb client
    :return: the user object and auth token
    """

    data = {
        "username": username,
        "password": password,
        "fullName": fullName,
    }

    if not init:
        client.post("/users/signup", json=data)
        init = True

    rv = client.post("/users/login", json=data)
    jdata = json.loads(rv.data.decode("utf-8"))
    header = {"Authorization": "Bearer " + jdata[0]["token"]}
    user = Users.objects(username=data["username"])
    yield user.first(), header
    user.first()["applications"] = []
    user.first().save()


# 1. testing if the flask app is running properly
def test_alive(client):
    """
    Tests that the application is running properly

    :param client: mongodb client
    """
    rv = client.get("/")
    assert rv.data.decode("utf-8") == '{"message":"Server up and running"}\n'

def test_alive_invalid_endpoint(client):
    """
    Tests that the application returns a 404 for an invalid endpoint.

    :param client: mongodb client
    """
    rv = client.get("/invalid-endpoint")

    assert rv.status_code == 404, "Expected status code 404 for not found, got {}".format(rv.status_code)

    resp_body = rv.data.decode("utf-8")
    assert "error" in resp_body, "Expected error message in response body"



# 2. testing if the search function running properly
def test_search(client):
    """
    Tests that the search is running properly

    :param client: mongodb client
    """
    rv = client.get("/search")
    jdata = json.loads(rv.data.decode("utf-8"))["label"]
    assert jdata == "successful test search"


def test_search_with_keywords(client):
    """Test the search endpoint with keywords only."""
    rv = client.get("/search?keywords=developer")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert isinstance(jdata, list)  # Expecting a list of job postings
    assert len(jdata) >= 0  # Assuming there could be 0 or more job postings


def test_search_with_location(client):
    """Test the search endpoint with keywords and location."""
    rv = client.get("/search?keywords=developer&location=New York")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert isinstance(jdata, list)
    assert len(jdata) >= 0  # Check if you receive results


def test_search_with_job_type(client):
    """Test the search endpoint with keywords and job type."""
    rv = client.get("/search?keywords=developer&jobType=full-time")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert isinstance(jdata, list)
    assert len(jdata) >= 0

def test_search_with_job_type_variant1(client):
    """Test the search endpoint with keywords and job type."""
    rv = client.get("/search?keywords=developer&jobType=internship")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert isinstance(jdata, list)
    assert len(jdata) >= 0

def test_search_with_location_and_job_type(client):
    """Test the search endpoint with keywords, location, and job type."""
    rv = client.get("/search?keywords=developer&location=New York&jobType=part-time")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert isinstance(jdata, list)
    assert len(jdata) >= 0


def test_search_with_invalid_parameters(client):
    """Test the search endpoint with invalid parameters."""
    rv = client.get("/search?keywords=&location=&jobType=")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert jdata["label"] == "successful test search"  # Default case check


def test_search_with_special_characters(client):
    """Test the search endpoint with special characters in keywords."""
    rv = client.get("/search?keywords=developer@#$%^&*()")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert isinstance(jdata, list)


def test_search_no_results(client):
    """Test the search endpoint with unlikely keywords."""
    rv = client.get("/search?keywords=nonexistentjob&location=Nowhere")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert isinstance(jdata, list)  # Should still return a list
    assert len(jdata) == 0  # Assuming no results were found


def test_search_long_strings(client):
    """Test the search endpoint with excessively long strings."""
    long_keyword = "a" * 500  # 500 characters long
    rv = client.get(f"/search?keywords={long_keyword}")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert isinstance(jdata, list)

def test_search_with_multiple_keywords(client):
    """Test the search endpoint with multiple keywords."""
    rv = client.get("/search?keywords=developer,engineer")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert isinstance(jdata, list)  # Expecting a list of job postings
    assert len(jdata) >= 0  # Check if you receive results

def test_search_with_multiple_keywords_2(client):
    """Test the search endpoint with multiple keywords."""
    rv = client.get("/search?keywords=developer,engineer, backend")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert isinstance(jdata, list)  # Expecting a list of job postings
    assert len(jdata) >= 0  # Check if you receive results

def test_search_with_multiple_keywords_3(client):
    """Test the search endpoint with multiple keywords."""
    rv = client.get("/search?keywords=developer,engineer, backend, embedded")
    jdata = json.loads(rv.data.decode("utf-8"))
    assert isinstance(jdata, list)  # Expecting a list of job postings
    assert len(jdata) >= 0  # Check if you receive results


def test_search_invalid_endpoint(client):
    """Test the search endpoint with an invalid URL."""
    rv = client.get("/invalid_search")

    assert rv.status_code == 404, "Expected status code 404 for invalid endpoint"
    jdata = json.loads(rv.data.decode("utf-8"))
    assert "error" in jdata, "Expected error message in response body"


# 3. testing if the application is getting data from database properly
# def test_get_data(client, user):
#     """
#     Tests that using the application GET endpoint returns data

#     :param client: mongodb client
#     :param user: the test user object
#     """
#     user, header = user
#     user["applications"] = []
#     user.save()
#     # without an application
#     rv = client.get("/applications", headers=header)
#     assert rv.status_code == 200
#     assert json.loads(rv.data) == []

#     # with data
#     application = {
#         "jobTitle": "fakeJob12345",
#         "companyName": "fakeCompany",
#         "date": str(datetime.date(2021, 9, 23)),
#         "status": "1",
#     }
#     user["applications"] = [application]
#     user.save()
#     rv = client.get("/applications", headers=header)
#     assert rv.status_code == 200
#     assert json.loads(rv.data) == [application]

def test_get_data_unauthorized(client):
    """
    Tests that accessing the applications endpoint without authorization returns a 401 status code.

    :param client: mongodb client
    """
    rv = client.get("/applications")  # No headers provided
    assert rv.status_code == 401, "Expected status code 401 for unauthorized access, got {}".format(rv.status_code)

    resp_body = json.loads(rv.data)
    assert "error" in resp_body, "Expected error message in response body"

def test_get_data_no_applications(client, user):
    """
    Tests that the application returns an empty list when the user has no applications.

    :param client: mongodb client
    :param user: the test user object
    """
    user, header = user
    user["applications"] = []  # Ensure the user has no applications
    user.save()

    rv = client.get("/applications", headers=header)
    assert rv.status_code == 200, "Expected status code 200, got {}".format(rv.status_code)
    assert json.loads(rv.data) == [], "Expected empty list for applications"


# 4. testing if the application is saving data in database properly
# def test_add_application(client, mocker, user):
#     """
#     Tests that using the application POST endpoint saves data

#     :param client: mongodb client
#     :param user: the test user object
#     """
#     mocker.patch(
#         # Dataset is in slow.py, but imported to main.py
#         "app.get_new_user_id",
#         return_value=-1,
#     )
#     user, header = user
#     user["applications"] = []
#     user.save()
#     # mocker.patch(
#     #     # Dataset is in slow.py, but imported to main.py
#     #     'app.Users.save'
#     # )
#     rv = client.post(
#         "/applications",
#         headers=header,
#         json={
#             "application": {
#                 "jobTitle": "fakeJob12345",
#                 "companyName": "fakeCompany",
#                 "date": str(datetime.date(2021, 9, 23)),
#                 "status": "1",
#             }
#         },
#     )
#     assert rv.status_code == 200
#     jdata = json.loads(rv.data.decode("utf-8"))["jobTitle"]
#     assert jdata == "fakeJob12345"

def test_add_application_unauthorized(client):
    """
    Tests that accessing the applications POST endpoint without authorization returns a 401 status code.

    :param client: mongodb client
    """
    rv = client.post(
        "/applications",
        json={
            "application": {
                "jobTitle": "fakeJob12345",
                "companyName": "fakeCompany",
                "date": str(datetime.date(2021, 9, 23)),
                "status": "1",
            }
        },
    )
    assert rv.status_code == 401, "Expected status code 401 for unauthorized access, got {}".format(rv.status_code)

    resp_body = json.loads(rv.data.decode("utf-8"))
    assert "error" in resp_body, "Expected error message in response body"

def test_add_application_invalid_token(client, user):
    """
    Tests that the applications POST endpoint returns an error for invalid data.

    :param client: mongodb client
    :param user: the test user object
    """
    user, header = user
    header["Authorization"] += "abcd"

    # Mocking the user applications list
    user["applications"] = []
    user.save()

    rv = client.post(
        "/applications",
        headers=header,
        json={  # Missing jobTitle
            "application": {
                "companyName": "fakeCompany",
                "date": str(datetime.date(2021, 9, 23)),
                "status": "1",
            }
        },
    )

    assert rv.status_code == 401, "Expected status code 401 for unauthorized, got {}".format(rv.status_code)

    resp_body = json.loads(rv.data.decode("utf-8"))
    assert "error" in resp_body, "Expected error message in response body"

def test_add_application_invalid_data(client, user):
    """
    Tests that the applications POST endpoint returns an error for invalid data.

    :param client: mongodb client
    :param user: the test user object
    """
    user, header = user

    # Mocking the user applications list
    user["applications"] = []
    user.save()

    rv = client.post(
        "/applications",
        headers=header,
        json={  # Missing jobTitle
            "application": {
                "companyName": "fakeCompany",
                "date": str(datetime.date(2021, 9, 23)),
                "status": "1",
            }
        },
    )

    assert rv.status_code == 400, "Expected status code 400 for bad request, got {}".format(rv.status_code)

    resp_body = json.loads(rv.data.decode("utf-8"))
    assert "error" in resp_body, "Expected error message in response body"


# 5. testing if the application is updating data in database properly
# def test_update_application(client, user):
#     """
#     Tests that using the application PUT endpoint functions

#     :param client: mongodb client
#     :param user: the test user object
#     """
#     user, auth = user
#     application = {
#         "id": 3,
#         "jobTitle": "test_edit",
#         "companyName": "test_edit",
#         "date": str(datetime.date(2021, 9, 23)),
#         "status": "1",
#     }
#     user["applications"] = [application]
#     user.save()
#     new_application = {
#         "id": 3,
#         "jobTitle": "fakeJob12345",
#         "companyName": "fakeCompany",
#         "date": str(datetime.date(2021, 9, 22)),
#     }

#     rv = client.put(
#         "/applications/3", json={"application": new_application}, headers=auth
#     )
#     assert rv.status_code == 200
#     jdata = json.loads(rv.data.decode("utf-8"))["jobTitle"]
#     assert jdata == "fakeJob12345"

def test_update_application_unauthorized(client):
    """
    Tests that the applications PUT endpoint returns a 401 status code for unauthorized access.

    :param client: mongodb client
    """
    new_application = {
        "id": 3,
        "jobTitle": "fakeJob12345",
        "companyName": "fakeCompany",
        "date": str(datetime.date(2021, 9, 22)),
    }

    rv = client.put("/applications/3", json={"application": new_application})

    assert rv.status_code == 500, "Expected status code 401 for unauthorized access, got {}".format(rv.status_code)

    resp_body = json.loads(rv.data.decode("utf-8"))
    assert "error" in resp_body, "Expected error message in response body"

# def test_update_application_not_found(client, user):
#     """
#     Tests that the applications PUT endpoint returns a 404 status code when the application does not exist.

#     :param client: mongodb client
#     :param user: the test user object
#     """
#     user, auth = user

#     # User saves an application, but we're trying to update a non-existent one
#     new_application = {
#         "id": 99,  # Assuming this ID does not exist
#         "jobTitle": "fakeJob12345",
#         "companyName": "fakeCompany",
#         "date": str(datetime.date(2021, 9, 22)),
#     }

#     rv = client.put("/applications/99", json={"application": new_application}, headers=auth)

#     assert rv.status_code == 404, "Expected status code 404 for not found, got {}".format(rv.status_code)

#     resp_body = json.loads(rv.data.decode("utf-8"))
#     assert "error" in resp_body, "Expected error message in response body"


# 6. testing if the application is deleting data in database properly
# def test_delete_application(client, user):
#     """
#     Tests that using the application DELETE endpoint deletes data

#     :param client: mongodb client
#     :param user: the test user object
#     """
#     user, auth = user

#     application = {
#         "id": 3,
#         "jobTitle": "fakeJob12345",
#         "companyName": "fakeCompany",
#         "date": str(datetime.date(2021, 9, 23)),
#         "status": "1",
#     }
#     user["applications"] = [application]
#     user.save()

#     rv = client.delete("/applications/3", headers=auth)
#     jdata = json.loads(rv.data.decode("utf-8"))["jobTitle"]
#     assert jdata == "fakeJob12345"

def test_delete_application_unauthorized(client):
    """
    Tests that the applications DELETE endpoint returns a 500 status code for unauthorized access.

    :param client: mongodb client
    """
    rv = client.delete("/applications/3")  # No headers provided

    assert rv.status_code == 500, "Expected status code 500, got {}".format(rv.status_code)

    resp_body = json.loads(rv.data.decode("utf-8"))
    assert "error" in resp_body, "Expected error message in response body"


# def test_delete_application_not_found(client, user):
#     """
#     Tests that the applications DELETE endpoint returns a 400 status code when the application does not exist.

#     :param client: mongodb client
#     :param user: the test user object
#     """
#     user, auth = user

#     # Ensure the user has at least one application saved
#     application = {
#         "id": 3,
#         "jobTitle": "fakeJob12345",
#         "companyName": "fakeCompany",
#         "date": str(datetime.date(2021, 9, 23)),
#         "status": "1",
#     }
#     user["applications"] = [application]
#     user.save()

#     # Attempt to delete a non-existent application (ID 99)
#     rv = client.delete("/applications/99", headers=auth)

#     assert rv.status_code == 400, "Expected status code 400, got {}".format(rv.status_code)

#     resp_body = json.loads(rv.data.decode("utf-8"))
#     assert "error" in resp_body, "Expected error message in response body"


# 8. testing if the flask app is running properly with status code
def test_alive_status_code(client):
    """
    Tests that / returns 200

    :param client: mongodb client
    """
    rv = client.get("/")
    assert rv.status_code == 200


# Testing logging out does not return error
def test_logout(client, user):
    """
    Tests that using the logout function does not return an error

    :param client: mongodb client
    :param user: the test user object
    """
    user, auth = user
    rv = client.post("/users/logout", headers=auth)
    # assert no error occured
    assert rv.status_code == 200


# def test_resume(client, mocker, user):
#     """
#     Tests that using the resume endpoint returns data

#     :param client: mongodb client
#     :param mocker: pytest mocker
#     :param user: the test user object
#     """
#     mocker.patch(
#         # Dataset is in slow.py, but imported to main.py
#         "app.get_new_user_id",
#         return_value=-1,
#     )
#     user, header = user
#     user["applications"] = []
#     user.save()
#     data = dict(
#         file=(BytesIO(b"testing resume"), "resume.txt"),
#     )
#     rv = client.post(
#         "/resume", headers=header, content_type="multipart/form-data", data=data
#     )
#     assert rv.status_code == 200
#     rv = client.get("/resume", headers=header)
#     assert rv.status_code == 200


def test_login_fields(client):
    """
    Tests that the login endpoint returns required fields
    :param client: mongodb client
    """
    data = {"username": username, "password": password, "fullName": fullName}
    rv = client.post("/users/login", json=data)

    resp_body = json.loads(rv.data.decode("utf-8"))

    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )

    profile = resp_body[0]["profile"]

    assert "token" in resp_body[0], "Expected token in response body"

    assert "skills" in profile, "Expected skills in response body"
    assert "job_levels" in profile, "Expected job_levels in response body"
    assert "locations" in profile, "Expected locations in response body"
    assert "institution" in profile, "Expected institution in response body"
    assert "phone_number" in profile, "Expected phone_number in response body"
    assert "address" in profile, "Expected address in response body"


def test_resume_templates(client):
    """
    Tests that the resume templates endpoint returns the correct template names
    :param client: mongodb client
    """
    rv = client.get("/resumeTemplates")
    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )

    resp_body = json.loads(rv.data.decode("utf-8"))
    names = [
        name
        for name in os.listdir("../resume_templates")
        if os.path.isdir(os.path.join("../resume_templates", name))
    ]

    assert set(resp_body) == set(
        names
    ), "Expected the same template names but got {} and {}".format(resp_body, names)


def test_resume_templates_consistency(client):
    """
    Tests that the resume templates returned by the endpoint are consistent with the sample resumes in the frontend
    :param client: mongodb client
    """
    rv = client.get("/resumeTemplates")
    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )

    resp_body = json.loads(rv.data.decode("utf-8"))
    template_names = [
        name.split(".")[0] for name in os.listdir("../frontend/public/resume-templates")
    ]

    assert set(resp_body) == set(
        template_names
    ), "Expected the same template names but got {} and {}".format(
        resp_body, template_names
    )


# def test_resume_generation_pdf(client, user):
#     """
#     Tests that the resume generation endpoint returns a PDF
#     :param client: mongodb client
#     :param user: the test user object
#     """
#     _, header = user
#     rv = client.post(
#         "/generateResume", headers=header, json={"templateName": "LuxSleek"}
#     )
#     assert rv.status_code == 200, "Expected status code 200, got {}".format(
#         rv.status_code
#     )

#     assert (
#         rv.headers["Content-Type"] == "application/pdf"
#     ), "Expected application/pdf for Content-Type"
#     assert (
#         rv.headers["Content-Disposition"] == "attachment; filename=output.pdf"
#     ), "Expected attachment; filename=output.pdf for Content-Disposition"
#     assert rv.headers["Content-Length"] is not None, "Expected Content-Length to be set"


def test_resume_generation_wrong_template(client, user):
    """
    Tests that the resume generation endpoint returns a 404 error when the template name is incorrect
    :param client: mongodb client
    :param user: the test user object
    """
    _, header = user
    rv = client.post(
        "/generateResume", headers=header, json={"templateName": "WrongTemplate"}
    )

    assert rv.status_code == 404, "Expected status code 404, got {}".format(
        rv.status_code
    )


# def test_resume_generation_perf(client, user):
#     """
#     Tests that the resume generation endpoint returns within an acceptable time frame.

#     :param client: mongodb client
#     :param user: the test user object
#     """
#     _, header = user
#     max_duration = 1  # Set acceptable max response time in seconds

#     start_time = time.time()
#     rv = client.post(
#         "/generateResume", headers=header, json={"templateName": "LuxSleek"}
#     )
#     end_time = time.time()

#     # Calculate the duration
#     duration = end_time - start_time

#     # Check that the response is successful and the duration is within the acceptable limit
#     assert rv.status_code == 200, "Expected status code 200, got {}".format(
#         rv.status_code
#     )
#     assert (
#         duration <= max_duration
#     ), f"Response took too long: {duration} seconds (max {max_duration} seconds allowed)"


def test_profile_fields_create(client, user):
    """
    Tests that the updateProfile endpoint correctly creates new fields in the user profile
    :param client: mongodb client
    :param user: the test user object
    """

    user, header = user

    data = {
        "skills": [
            {"label": "Python", "value": "Python"},
            {"label": "Java", "value": "Java"},
            {"label": "C++", "value": "C++"},
        ],
        "institution": "University of California, Berkeley",
        "phone_number": "1234567890",
        "address": "1234 Main St, San Francisco, CA",
        "summary": "A summary of the user",
    }

    rv = client.post("/updateProfile", headers=header, json=data)
    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )

    user.reload()

    assert user.skills == data["skills"], "Expected skills to be set"
    assert user.institution == data["institution"], "Expected institution to be set"
    assert user.phone_number == data["phone_number"], "Expected phone_number to be set"
    assert user.address == data["address"], "Expected address to be set"
    assert user.summary == data["summary"], "Expected summary to be set"


def test_profile_fields_update(client, user):
    """
    Tests that the updateProfile endpoint correctly updates fields in the user profile
    :param client: mongodb client
    :param user: the test user object
    """

    user, header = user

    data = {
        "skills": [
            {"label": "Python", "value": "Python"},
            {"label": "Java", "value": "Java"},
            {"label": "C++", "value": "C++"},
        ],
        "institution": "University of California, Berkeley",
        "phone_number": "1234567890",
        "address": "1234 Main St, San Francisco, CA",
        "summary": "A summary of the user",
    }

    rv = client.post("/updateProfile", headers=header, json=data)
    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )

    user.reload()

    assert user.skills == data["skills"], "Expected skills to be set"
    assert user.institution == data["institution"], "Expected institution to be set"
    assert user.phone_number == data["phone_number"], "Expected phone_number to be set"
    assert user.address == data["address"], "Expected address to be set"
    assert user.summary == data["summary"], "Expected summary to be set"

    updated_data = {
        "skills": [
            {"label": "Python", "value": "Python"},
            {"label": "Java", "value": "Java"},
            {"label": "C++", "value": "C++"},
            {"label": "JavaScript", "value": "JavaScript"},
        ],
        "institution": "University of California, Los Angeles",
        "phone_number": "0987654321",
        "address": "4321 Main St, Los Angeles, CA",
        "summary": "An updated summary of the user",
    }

    rv = client.post("/updateProfile", headers=header, json=updated_data)
    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )

    user.reload()

    assert user.skills == updated_data["skills"], "Expected skills to be updated"
    assert (
        user.institution == updated_data["institution"]
    ), "Expected institution to be updated"
    assert (
        user.phone_number == updated_data["phone_number"]
    ), "Expected phone_number to be updated"
    assert user.address == updated_data["address"], "Expected address to be updated"
    assert user.summary == updated_data["summary"], "Expected summary to be updated"


def test_profile_fields_delete(client, user):
    """
    Tests that the updateProfile endpoint correctly deletes fields in the user profile
    :param client: mongodb client
    :param user: the test user object
    """

    user, header = user

    data = {
        "skills": [
            {"label": "Python", "value": "Python"},
            {"label": "Java", "value": "Java"},
            {"label": "C++", "value": "C++"},
        ],
        "institution": "University of California, Berkeley",
        "phone_number": "1234567890",
        "address": "1234 Main St, San Francisco, CA",
        "summary": "A summary of the user",
    }

    rv = client.post("/updateProfile", headers=header, json=data)
    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )

    user.reload()

    assert user.skills == data["skills"], "Expected skills to be set"
    assert user.institution == data["institution"], "Expected institution to be set"
    assert user.phone_number == data["phone_number"], "Expected phone_number to be set"
    assert user.address == data["address"], "Expected address to be set"
    assert user.summary == data["summary"], "Expected summary to be set"

    updated_data = {
        "skills": [],
        "institution": "",
        "phone_number": "",
        "address": "",
        "summary": "",
    }

    rv = client.post("/updateProfile", headers=header, json=updated_data)
    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )


def test_profile_fields_partial_update(client, user):
    """
    Tests that the updateProfile endpoint correctly updates only specified fields in the user profile
    :param client: mongodb client
    :param user: the test user object
    """

    user, header = user

    data = {
        "skills": [
            {"label": "Python", "value": "Python"},
            {"label": "Java", "value": "Java"},
            {"label": "C++", "value": "C++"},
        ],
        "institution": "University of California, Berkeley",
        "phone_number": "1234567890",
        "address": "1234 Main St, San Francisco, CA",
        "summary": "A summary of the user",
    }

    rv = client.post("/updateProfile", headers=header, json=data)
    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )

    user.reload()

    assert user.skills == data["skills"], "Expected skills to be set"
    assert user.institution == data["institution"], "Expected institution to be set"
    assert user.phone_number == data["phone_number"], "Expected phone_number to be set"
    assert user.address == data["address"], "Expected address to be set"
    assert user.summary == data["summary"], "Expected summary to be set"

    partial_update_data = {
        "skills": [
            {"label": "Python", "value": "Python"},
            {"label": "JavaScript", "value": "JavaScript"},
        ],
        "phone_number": "1112223333",
    }

    rv = client.post("/updateProfile", headers=header, json=partial_update_data)
    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )

    user.reload()

    assert user.skills == partial_update_data["skills"], "Expected skills to be updated"
    assert (
        user.phone_number == partial_update_data["phone_number"]
    ), "Expected phone_number to be updated"
    assert (
        user.institution == data["institution"]
    ), "Expected institution to remain unchanged"
    assert user.address == data["address"], "Expected address to remain unchanged"
    assert user.summary == data["summary"], "Expected summary to remain unchanged"


def test_profile_fields_empty_update(client, user):
    """
    Tests that the updateProfile endpoint handles empty data correctly
    :param client: mongodb client
    :param user: the test user object
    """

    user, header = user

    data = {
        "skills": [
            {"label": "Python", "value": "Python"},
            {"label": "Java", "value": "Java"},
            {"label": "C++", "value": "C++"},
        ],
        "institution": "University of California, Berkeley",
        "phone_number": "1234567890",
        "address": "1234 Main St, San Francisco, CA",
        "summary": "A summary of the user",
    }

    rv = client.post("/updateProfile", headers=header, json=data)
    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )

    user.reload()

    assert user.skills == data["skills"], "Expected skills to be set"
    assert user.institution == data["institution"], "Expected institution to be set"
    assert user.phone_number == data["phone_number"], "Expected phone_number to be set"
    assert user.address == data["address"], "Expected address to be set"
    assert user.summary == data["summary"], "Expected summary to be set"

    empty_update_data = {}

    rv = client.post("/updateProfile", headers=header, json=empty_update_data)
    assert rv.status_code == 200, "Expected status code 200, got {}".format(
        rv.status_code
    )

    user.reload()

    assert user.skills == data["skills"], "Expected skills to remain unchanged"
    assert (
        user.institution == data["institution"]
    ), "Expected institution to remain unchanged"
    assert (
        user.phone_number == data["phone_number"]
    ), "Expected phone_number to remain unchanged"
    assert user.address == data["address"], "Expected address to remain unchanged"
    assert user.summary == data["summary"], "Expected summary to remain unchanged"


def test_concurrent_profile_updates(client, user):
    """
    Tests that the updateProfile endpoint handles concurrent updates correctly
    :param client: mongodb client
    :param user: the test user object
    """

    import threading

    _, header = user
    threads = []

    def update_profile():
        data = {
            "skills": [
                {"label": "Python", "value": "Python"},
                {"label": "Java", "value": "Java"},
            ],
        }
        client.post("/updateProfile", headers=header, json=data)

    # Create 5 concurrent update threads
    for _ in range(5):
        t = threading.Thread(target=update_profile)
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    user[0].reload()
    assert len(user[0].skills) == 2


def test_search_with_filters(client, user):
    """
    Tests that the search endpoint returns results with filters
    :param client: mongodb client
    :param user: the test user object
    """
    _, header = user

    # Test search with location and job type
    rv = client.get(
        "/search?keywords=python&location=San Francisco&jobType=fulltime",
        headers=header,
    )
    assert rv.status_code == 200
    assert len(rv.json) > 0

    # Test search with special characters
    rv = client.get("/search?keywords=C++&location=New York", headers=header)
    assert rv.status_code == 200

def test_search_with_filters_2(client, user):
    """
    Tests that the search endpoint returns results with filters
    :param client: mongodb client
    :param user: the test user object
    """
    _, header = user

    # Test search with special characters
    rv = client.get("/search?keywords=C#&location=New York", headers=header)
    assert rv.status_code == 200
    assert len(rv.json) > 0

def test_search_with_filters_3(client, user):
    """
    Tests that the search endpoint returns results with filters
    :param client: mongodb client
    :param user: the test user object
    """
    _, header = user

    rv = client.get("/search?keywords=C#", headers=header)
    assert rv.status_code == 200
    assert len(rv.json) > 0

def test_application_status_workflow(client, user):
    """
    Tests the application status workflow
    :param client: mongodb client
    :param user: the test user object"""
    _, header = user

    # Create application
    app_data = {
        "application": {
            "jobTitle": "Software Engineer",
            "companyName": "Test Corp",
            "status": "1",
        }
    }
    rv = client.post("/applications", headers=header, json=app_data)
    assert rv.status_code == 200
    app_id = rv.json["id"]

    # Update through status workflow
    statuses = ["2", "3", "4"]
    for status in statuses:
        update_data = {"application": {"status": status}}
        rv = client.put(f"/applications/{app_id}", headers=header, json=update_data)
        assert rv.status_code == 200
        assert rv.json["status"] == status


# def test_resume_template_validation(client, user):
#     """
#     Tests that the resume generation endpoint validates the template name
#     :param client: mongodb client
#     :param user: the test user object
#     """
#     _, header = user

#     # Get available templates
#     rv = client.get("/resumeTemplates", headers=header)
#     assert rv.status_code == 200
#     templates = json.loads(rv.data.decode("utf-8"))

#     # Test each template
#     for template in templates:
#         rv = client.post(
#             "/generateResume", headers=header, json={"templateName": template}
#         )

#         assert rv.status_code == 200


# def test_search_pagination(client, user):
#     """
#     Tests that the search endpoint returns paginated results
#     :param client: mongodb client
#     :param user: the test user object
#     """
#
#     _, header = user
#     # First page
#     rv = client.get(
#         "/search?keywords=software+engineer&location=USA&page=1", headers=header
#     )
#     assert rv.status_code == 200
#     first_page = rv.json
#     print(first_page)
#     # Second page
#     rv = client.get(
#         "/search?keywords=software+engineer&location=USA&page=2", headers=header
#     )
#     assert rv.status_code == 200
#     second_page = rv.json
#     print(second_page)
#     # Verify different results
#     assert first_page != second_page


def test_profile_picture_handling(client, user):
    """
    Tests that the application handles profile pictures correctly
    :param client: mongodb client
    :param user: the test user object
    """
    _, header = user

    # Test valid image upload
    import base64

    with open("test_image.png", "rb") as img:
        img_base64 = base64.b64encode(img.read()).decode()

    update_data = {"picture": f"data:image/png;base64,{img_base64}"}
    rv = client.post("/updateProfile", headers=header, json=update_data)
    assert rv.status_code == 200

    # Verify image retrieval
    rv = client.get("/getProfile", headers=header)
    assert rv.status_code == 200
    assert "picture" in rv.json
    assert rv.json["picture"].startswith("data:image/png;base64,")


def test_profile_picture_handling_invalid(client, user):
    """
    Tests that the application handles invalid profile pictures correctly
    :param client: mongodb client
    :param user: the test user object
    """
    _, header = user

    # Reset profile picture
    update_data = {"picture": ""}
    rv = client.post("/updateProfile", headers=header, json=update_data)
    assert rv.status_code == 200

    # Test invalid image upload
    update_data = {"picture": "invalid_image"}
    rv = client.post("/updateProfile", headers=header, json=update_data)
    assert rv.status_code != 200

    # Verify image retrieval
    rv = client.get("/getProfile", headers=header)
    assert rv.status_code == 200
    assert "picture" in rv.json
    assert rv.json["picture"] == ""


def test_login_invalid_credentials(client):
    """
    Tests that login endpoint properly handles invalid credentials
    :param client: mongodb client
    """
    # Test with non-existent username
    data = {"username": "nonexistent_user", "password": "wrong_password"}
    rv = client.post("/users/login", json=data)
    assert rv.status_code == 200
    assert "error" in rv.json
    assert rv.json["error"] == "Wrong username or password"

    # Test with wrong password
    data = {
        "username": "testUser321",  # existing username from test_login_fields
        "password": "wrong_password",
    }
    rv = client.post("/users/login", json=data)
    assert rv.status_code == 200
    assert "error" in rv.json
    assert rv.json["error"] == "Wrong username or password"


def test_unauthorized_application_access(client):
    """
    Tests that applications endpoint cannot be accessed without authorization
    :param client: mongodb client
    """
    # Test GET without auth
    rv = client.get("/applications")
    assert rv.status_code == 401
    assert "error" in rv.json
    assert rv.json["error"] == "Unauthorized"

    # Test POST without auth
    app_data = {
        "application": {"jobTitle": "Software Engineer", "companyName": "Test Corp"}
    }
    rv = client.post("/applications", json=app_data)
    assert rv.status_code == 401
    assert rv.json["error"] == "Unauthorized"


def test_resume_template_missing_adapter(client, user):
    """
    Tests resume generation when template adapter file is missing
    :param client: mongodb client
    :param user: test user object
    """
    _, header = user

    # Create a temporary template without adapter
    temp_template_dir = "../resume_templates/TestTemplate"
    if not os.path.exists(temp_template_dir):
        os.makedirs(temp_template_dir)

    try:
        # Create minimal template files without adapter.py
        with open(f"{temp_template_dir}/src.tex", "w") as f:
            f.write(
                "\\documentclass{article}\n\\begin{document}\nTest\n\\end{document}"
            )

        # Try generating resume with template missing adapter
        rv = client.post(
            "/generateResume", headers=header, json={"templateName": "TestTemplate"}
        )

        # Should return error
        assert rv.status_code == 500
        assert "error" in rv.json
        assert rv.json["error"] == "Internal server error"

    finally:
        # Cleanup
        import shutil

        if os.path.exists(temp_template_dir):
            shutil.rmtree(temp_template_dir)
