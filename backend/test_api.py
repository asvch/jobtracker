import pytest
from flask import Flask, jsonify
from unittest.mock import patch
from app import create_app  
import os
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture
def client():
    """
    Fixture to create a test client for the Flask app.
    """
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

@patch("app.Groq")  # Mock the Groq client to avoid hitting the actual API
def test_getLLMresponse_200(mock_groq, client):
    """
    Test the /getLLMresponse endpoint to ensure the response is not null.
    """
    # Arrange: Create a mock response object
    class MockMessage:
        def __init__(self, content):
            self.content = content  # Make content an attribute of MockMessage

    class MockChoice:
        def __init__(self, content):
            self.message = MockMessage(content)  # Use MockMessage for message

    class MockChatCompletion:
        def __init__(self, choices):
            self.choices = choices  # List of MockChoice objects

    # Mocking Groq's API response
    mock_groq.return_value.chat.completions.create.return_value = MockChatCompletion(
        choices=[MockChoice(content="This is a mocked response from the LLM")]
    )

    # Act: Send a POST request to the endpoint
    response = client.post(
        "/getLLMresponse",
        json={"message": "Test message from user"},
    )


    # Assert: Check that the response is not null
    assert response.status_code == 200


@patch("app.Groq")  # Mock the Groq client to avoid hitting the actual API
def test_getLLMresponse_json(mock_groq, client):
    """
    Test the /getLLMresponse endpoint to ensure the response is not null.
    """
    # Arrange: Create a mock response object
    class MockMessage:
        def __init__(self, content):
            self.content = content  # Make content an attribute of MockMessage

    class MockChoice:
        def __init__(self, content):
            self.message = MockMessage(content)  # Use MockMessage for message

    class MockChatCompletion:
        def __init__(self, choices):
            self.choices = choices  # List of MockChoice objects

    # Mocking Groq's API response
    mock_groq.return_value.chat.completions.create.return_value = MockChatCompletion(
        choices=[MockChoice(content="This is a mocked response from the LLM")]
    )

    # Act: Send a POST request to the endpoint
    response = client.post(
        "/getLLMresponse",
        json={"message": "Test message from user"},
    )


    # Assert: Check that the response is not null
    assert response.status_code == 200
    response_json = response.get_json()
    print("Response", response_json)
    assert "response" in response_json


@patch("app.Groq")  # Mock the Groq client to avoid hitting the actual API
def test_getLLMresponse_not_none(mock_groq, client):
    """
    Test the /getLLMresponse endpoint to ensure the response is not null.
    """
    # Arrange: Create a mock response object
    class MockMessage:
        def __init__(self, content):
            self.content = content  # Make content an attribute of MockMessage

    class MockChoice:
        def __init__(self, content):
            self.message = MockMessage(content)  # Use MockMessage for message

    class MockChatCompletion:
        def __init__(self, choices):
            self.choices = choices  # List of MockChoice objects

    # Mocking Groq's API response
    mock_groq.return_value.chat.completions.create.return_value = MockChatCompletion(
        choices=[MockChoice(content="This is a mocked response from the LLM")]
    )

    # Act: Send a POST request to the endpoint
    response = client.post(
        "/getLLMresponse",
        json={"message": "Test message from user"},
    )


    # Assert: Check that the response is not null
    assert response.status_code == 200
    response_json = response.get_json()
    print("Response", response_json)
    assert "response" in response_json
    assert response_json["response"] is not None  # Ensure response is not null


@patch("app.Groq")  # Mock the Groq client to avoid hitting the actual API
def test_getLLMresponse_not_null(mock_groq, client):
    """
    Test the /getLLMresponse endpoint to ensure the response is not null.
    """
    # Arrange: Create a mock response object
    class MockMessage:
        def __init__(self, content):
            self.content = content  # Make content an attribute of MockMessage

    class MockChoice:
        def __init__(self, content):
            self.message = MockMessage(content)  # Use MockMessage for message

    class MockChatCompletion:
        def __init__(self, choices):
            self.choices = choices  # List of MockChoice objects

    # Mocking Groq's API response
    mock_groq.return_value.chat.completions.create.return_value = MockChatCompletion(
        choices=[MockChoice(content="This is a mocked response from the LLM")]
    )

    # Act: Send a POST request to the endpoint
    response = client.post(
        "/getLLMresponse",
        json={"message": "Test message from user"},
    )


    # Assert: Check that the response is not null
    assert response.status_code == 200
    response_json = response.get_json()
    print("Response", response_json)
    assert "response" in response_json
    assert response_json["response"] is not None  # Ensure response is not null
    assert response_json["response"] == "This is a mocked response from the LLM"

def test_api_key():
    llm_api_key = os.environ.get("GROQ_API_KEY")

    assert llm_api_key is not None

def test_api_key_type():
    llm_api_key = os.environ.get("GROQ_API_KEY")

    assert type(llm_api_key) == str

def test_base_url():
    base_url = os.environ.get("REACT_APP_BACKEND_BASE_URL")

    assert base_url is not None

def test_base_url_type():
    base_url = os.environ.get("REACT_APP_BACKEND_BASE_URL")

    assert type(base_url) == str

def test_mongodb_url():
    mongodb_host = os.environ.get("MONGODB_HOST_STRING")

    assert mongodb_host is not None

def test_mongodb_url_type():
    mongodb_host = os.environ.get("MONGODB_HOST_STRING")

    assert type(mongodb_host) == str