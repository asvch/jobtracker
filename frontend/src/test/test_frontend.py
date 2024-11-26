from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import pytest
import time

@pytest.fixture(scope="module")
def driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=chrome_options)
    # driver = webdriver.Chrome()
    driver.get("http://localhost:3000")  
    yield driver
    driver.quit()

def test_login_page(driver):

    time.sleep(3)

    element = driver.find_element(By.CSS_SELECTOR, "h1.text-center")

    assert "Job Tracker" in element.text, "Text 'Job Tracker' is not displayed on the page"

    print("Text 'Job Tracker' is displayed on the page")

def test_login(driver):
    # Locate username and password fields and login button
    username_field = driver.find_element(By.ID, "uname")
    password_field = driver.find_element(By.ID, "pwd")
    login_button = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/div/div[1]/form/div[3]/button[1]")

    # Input test credentials
    username_field.send_keys("sponge7")
    password_field.send_keys("sponge7")
    login_button.click()

    time.sleep(5)

    left_nav = driver.find_element(By.CLASS_NAME, "left-nav")

    assert left_nav.is_displayed(), "Left navigation is not visible when the page loads"

# def test_