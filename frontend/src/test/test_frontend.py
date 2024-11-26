from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import pytest
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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

def test_invalid_login(driver):
    username_field = driver.find_element(By.ID, "uname")
    password_field = driver.find_element(By.ID, "pwd")
    login_button = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/div/div[1]/form/div[3]/button[1]")

    username_field.send_keys("sponge9")   # invalid login and pword
    password_field.send_keys("sponge9")
    login_button.click()

    time.sleep(5)

    alert = driver.switch_to.alert
    alert_text = alert.text
    alert.accept()
    assert "Error while login" in alert_text, "Alert message is not as expected"


def test_signup_tab_user(driver):

    signup_tab = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/nav/a[2]")

    signup_tab.click()
    time.sleep(3)

    fullname = driver.find_element(By.ID, "fullname")

    assert fullname is not None

    
def test_signup_tab_pword(driver):

    signup_tab = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/nav/a[2]")

    signup_tab.click()
    time.sleep(3)

    pword = driver.find_element(By.ID, "spwd")

    assert pword is not None

def test_signup_tab_fullname(driver):

    signup_tab = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/nav/a[2]")

    signup_tab.click()
    time.sleep(3)

    fullname = driver.find_element(By.ID, "fullname")

    assert fullname is not None

## We faced a lot of issues with this so doing extra testing for this signup button

def test_signup_tab_signupbutton(driver):

    signup_tab = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/nav/a[2]")

    signup_tab.click()
    time.sleep(3)

    signup_button = driver.find_element(By.XPATH, '//button[contains(text(),"Sign Up")]')

    assert signup_button is not None

def test_signup_tab_buttonview(driver):

    signup_tab = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/nav/a[2]")

    signup_tab.click()
    time.sleep(3)

    signup_button = driver.find_element(By.XPATH, '//button[contains(text(),"Sign Up")]')

    assert signup_button.is_displayed()

def test_signup_tab_clickable(driver):

    signup_tab = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/nav/a[2]")

    signup_tab.click()
    time.sleep(3)

    signup_button = driver.find_element(By.XPATH, '//button[contains(text(),"Sign Up")]')

    assert signup_button.is_enabled()

def test_signup_tab_clickit(driver):

    signup_tab = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/nav/a[2]")

    signup_tab.click()
    time.sleep(3)

    signup_button = driver.find_element(By.XPATH, '//button[contains(text(),"Sign Up")]')

    signup_button.click()
    time.sleep(3)

    alert = driver.switch_to.alert
    alert_text = alert.text
    alert.accept()
    assert "Proceed to Login" in alert_text, "Alert message is not as expected"

# def test_signup(driver):

#     signup_tab = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/nav/a[2]")
#     fullname = driver.find_element(By.ID, "fullname")
#     username_field = driver.find_element(By.ID, "suname")
#     password_field = driver.find_element(By.ID, "spwd")
#     # signup_button = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/div/div[2]/form/div[4]/button[1]")

#     signup_tab.click()
#     time.sleep(3)
#     signup_button = WebDriverWait(driver, 10).until(
#         EC.element_to_be_clickable((By.XPATH, '//button[contains(text(),"Sign Up")]'))
#     )
#     # driver.save_screenshot("screenshot.png")  # Save a screenshot for debugging
#     fullname.send_keys("sponge10")
#     username_field.send_keys("sponge10")
#     password_field.send_keys("sponge10")
#     # signup_button.click()
#     driver.execute_script("arguments[0].scrollIntoView(true);", signup_button)
#     signup_button.click()

#     time.sleep(5)

#     alert = driver.switch_to.alert
#     alert_text = alert.text
#     assert "Proceed to Login" in alert_text, "Alert message is not as expected"


# def test_login(driver):
#     # Locate username and password fields and login button
#     username_field = driver.find_element(By.ID, "uname")
#     password_field = driver.find_element(By.ID, "pwd")
#     login_button = driver.find_element(By.XPATH, "/html/body/div/div/div/div/div[2]/div/div/div[1]/form/div[3]/button[1]")

#     # Input test credentials
#     username_field.send_keys("sponge7")
#     password_field.send_keys("sponge7")
#     login_button.click()

#     time.sleep(5)

#     left_nav = driver.find_element(By.CLASS_NAME, "left-nav")

#     assert left_nav.is_displayed(), "Left navigation is not visible when the page loads"

# def test_