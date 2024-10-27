
[![GitHub license](https://img.shields.io/github/license/Kashika08/application-tracking-system)](https://github.com/Kashika08/application-tracking-system/blob/main/LICENSE)
[![DOI](https://zenodo.org/badge/720131933.svg)](https://zenodo.org/doi/10.5281/zenodo.10211824)
[![codecov](https://codecov.io/gh/Kashika08/application-tracking-system/branch/main/graph/badge.svg)](https://codecov.io/gh/Kashika08/application-tracking-system)
![GitHub issues](https://img.shields.io/github/issues/Kashika08/application-tracking-system)
![GitHub issues](https://img.shields.io/github/issues-closed/Kashika08/application-tracking-system)
![GitHub top language](https://img.shields.io/github/languages/top/Kashika08/application-tracking-system)
![GitHub issues](https://img.shields.io/github/issues/Kashika08/application-tracking-system)
![GitHub issues](https://img.shields.io/github/issues-closed/Kashika08/application-tracking-system)
![GitHub top language](https://img.shields.io/github/languages/top/Kashika08/application-tracking-system)

[![Build and Deploy Frontend](https://github.com/kingan1/application-tracking-system/actions/workflows/frontend_CI_CD.yml/badge.svg)](https://github.com/kingan1/application-tracking-system/actions/workflows/frontend_CI_CD.yml)
[![Super Linter](https://github.com/kingan1/application-tracking-system/actions/workflows/super-linter.yml/badge.svg)](https://github.com/kingan1/application-tracking-system/actions/workflows/super-linter.yml)

# J-Tracker - Your Job Tracking Assistant

https://user-images.githubusercontent.com/43064854/135554150-c06afd4e-d223-47e3-b123-b45f9cd1b87a.mp4

The process of applying for jobs and internships is not a cakewalk. Managing job applications is a time-consuming process. Due to the referrals and deadlines, the entire procedure can be stressful. Our application allows you to track and manage your job application process, as well as regulate it, without the use of cumbersome Excel spreadsheets.

Our application keeps track of the jobs you've added to your wish list. It also keeps track of the companies you've already applied to and keeps a list of any rejections. Rather than having the user browse each company's site for potential prospects, our application allows the applicant to search for them directly using basic keywords. Any prospective work offers can then be added to the applicant's wishlist.

## Table of contents

- [Basic Design](#basic-design)
- [Demo Video](#demo-video)
- [Improvements and Feature Additions](#improvements-and-feature-additions)
- [Future Scope](#future-scope)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Requirements](#requirements)
  - [Strongly Recommended](#strongly-recommended)
- [Getting Started](#getting-started)
  - [Boot](#boot)
  - [Shutdown](#shutdown)
- [Hosting the Database](#hosting-the-database)
  - [Local MongoDB](#local-mongodb)
  - [Hosted database with MongoDB Atlas](#hosted-database-with-mongodb-atlas)
- [License](#license)
- [How to Contribute](#how-to-contribute)
- [Team Members](#team-members)

## Basic Design

![Basic Design](https://github.com/prithvish-doshi-17/application-tracking-system/blob/main/resources/Overall%20Design.PNG)

## Demo Video

https://drive.google.com/file/d/1N096pIbiZH9cPoxaPnRfjno452qQZjZ9/view

## Improvements and Feature Additions

## 1) Apply via job portals:
To enhance user interaction and simplify the application process, the platform includes direct links for applying for each job listing from the corresponding job board where the job was originally posted. These links enable users to seamlessly connect with the job poster and apply to the job, facilitating a direct and efficient application process. This feature not only saves users valuable time but also improves the overall user experience by eliminating unnecessary steps and ensuring a smoother journey through the platform. With a single click, users can initiate the application process, contributing to a more user-friendly and streamlined platform.
![WhatsApp Image 2023-11-27 at 7 52 12 PM](https://github.com/Kashika08/application-tracking-system/assets/73926660/2ec9ad8b-656a-43c1-b876-c188c8ad7a97)


## 2) Added a new page for My Applications:
This page is a visual board that helps manage work in progress and optimize workflow. It is a useful way to organize and visualize the different stages of your job application process.

_Rejected:_
This column represents the stage where applications that have been reviewed and rejected by the prospective employers are placed.
Applicants can use this column to keep track of the positions that did not progress further in the hiring process.

_Applied:_
This column is for applications that have been submitted but are still awaiting a response from the employers.
It helps candidates to easily identify the positions they've applied for and are currently under consideration.

_Wishlist:_
The Wishlist column is for positions that the applicant is interested in but hasn't applied for yet.
This can serve as a reminder of potential job opportunities, and applicants can move them to the "Applied" column once they submit their applications.

_Waiting for Referral:_
In this column, applicants can track positions for which they are waiting for a referral or some kind of internal recommendation.
Networking and referrals are crucial in the job search process, and this column helps candidates keep track of such opportunities.

Move Cards: Applications can be represented as cards, with each card moving across the columns as the application progresses.
Visualize Progress: The board provides a visual representation of the overall status of your job applications.
Prioritize: Applicants can prioritize applications in the Wishlist column and focus on applying for those positions.
Identify Bottlenecks: If many applications are stuck in a particular column, it may indicate a bottleneck or an area that needs attention in the job search process.
<img width="1286" alt="Screenshot 2023-11-27 at 9 06 38 PM" src="https://github.com/Kashika08/application-tracking-system/assets/73926660/6358758a-c5de-43fd-831a-27d7bb822831">




## 3) Filtering applications: 
To enhance user convenience, especially for students managing a multitude of applications, the inclusion of filters is crucial. These filters enable users to categorize applications based on their status—such as accepted, rejected, waitlisted, wish-listed, or awaiting referrals. Additionally, the filter functionality extends to sorting applications based on location, job title, and even the company name, providing a comprehensive and efficient way to organize and navigate through the application process.
<img width="1286" alt="Screenshot 2023-11-27 at 9 08 47 PM" src="https://github.com/Kashika08/application-tracking-system/assets/73926660/627a673d-c0d7-4e5e-b95d-9ef8212fb65d">


## 4) Adding Notes to Applications:
Applicant Tracking Systems (ATS) traditionally cater to hiring professionals, but an innovative addition involves enabling applicants to add notes and updates to their applications. The integration of a notes feature is a powerful tool that enables users, particularly applicants, to add real-time, personalized notes and updates for each application. This dynamic feature allows candidates to actively document their application journey, noting essential dates, interactions, and any pertinent details they find important. By doing so, applicants maintain a heightened sense of organization and stay well-informed throughout the entire hiring process.
The real-time nature of this notes feature becomes a valuable asset for applicants. It empowers them to reflect on their progress and express their thoughts, motivations, and distinctive qualifications instantaneously.
<img width="1086" alt="Screenshot 2023-11-27 at 9 12 50 PM" src="https://github.com/Kashika08/application-tracking-system/assets/73926660/e17415bd-9a70-41f4-8048-e530fbdccbbb">


## 5) Setting preferences: 
Upon logging in, the application empowers users to establish their preferences promptly. This includes selecting their experience level from a dropdown menu, specifying preferred locations, and indicating proficiency in various skills through an intuitive pop-up interface. These defined parameters play a pivotal role in generating precise predictions and aligning the user's requirements with the most suitable job opportunities.
<img width="1440" alt="Screenshot 2023-11-27 at 9 16 52 PM" src="https://github.com/Kashika08/application-tracking-system/assets/73926660/5426d481-254f-4173-8fe5-fcff931bd03e">


## 6) Added Job links: 
Implemented web scraping to enhance user interaction, enabling direct access to recommended job matches. This eliminates the need for users, particularly students, to manually search for their desired positions again. The incorporation of direct job links saves significant time and streamlines the user experience.
<img width="1440" alt="Screenshot 2023-11-27 at 9 19 01 PM" src="https://github.com/Kashika08/application-tracking-system/assets/73926660/8328b1aa-514f-4bc9-9384-e0c0612a6790">


## 7) Error Handling:
   a) Resolved the issue where only half of the countries were initially visible for location on the website. The error has been addressed, and the website now displays the entire list of countries. As a result, the website is functioning correctly, and users can access the complete list of countries for location purposes.
   
   
   b) Previously, certain pages were redirecting to undefined or error pages, a practice deemed undesirable for a high-quality application. All errors within the application have now been effectively addressed, ensuring users are seamlessly redirected to the appropriate pages.


<p align="center"><img width="700" src="./resources/Recommendjobspage.png"></p>

## Future Scope:

- Include deadline reminders for the application and interview.
- Add a feature that allows users to attach these reminders to their Google calendar.
- Incorporate notifications for upcoming deadlines.
- Include a link to the university’s career fair page.
- Drag and drop functionality to change the status of the applications in MyApplications page.

## Modules:

Currently, we have four fundamental steps in our project:

1. The SearchPage where users can search about the Job Postings
2. The MatchesPage where users get recommendation about the jobs according to their preferences
3. The ApplicationsPage where users can add and see the position they applied to and can update/delete the the information. Any details in any table can be modified at any time during the process
4. The ProfilePage where user can add his skills, experience level and preffered location. This information is used to recommend user jobs that require similar skillsets.
5. The My Applications page enables the user to keep track of all the applications on a visual board with various sections for applied, rejected, waiting for referrals, wishlist applications.

## Technologies Used:

- Python
- Node.Js
- Flask
- MongoDB
- React

## Installation:

### Requirements:

- [Python](https://www.python.org/downloads/) (recommended >= 3.8)
- [pip](https://pip.pypa.io/en/stable/installation/) (Latest version 21.3 used as of 11/3)
- [npm](https://nodejs.org/en/) (Latest version 6.14.4 used as of 11/3)

### Strongly Recommended:

- A terminal environment capable of handling bash scripts.

To install all required packages, while within the context of project root directory, run:

./setup.sh

This will handle all npm and pip package installations required for both the front and backend.

If the script says "command not found" or something similar, run chmod +x ./setup.sh. This grants the script execution privileges. Depending on your setup, this may occur for the boot_dockerless files, amongst others. The same command will fix the issue.

## Getting Started:

### Boot:

To run a testing environment, run:

./startup.sh

This will run flask and npm simultaneously, booting both the front and backend. Note - npm takes substantially longer to boot compared to flask.

### Shutdown:

To ensure that flask is no longer occupying a port, run:

./shutdown.sh

This will search for any active process containing "flask" and kill the process.

## Hosting the Database:

### Local MongoDB:

1. Download [MongoDB Community Server](https://docs.mongodb.com/manual/administration/install-community/)
2. Follow the [Installion Guide](https://docs.mongodb.com/guides/server/install/)
3. In app.py set 'host' string to 'localhost'
4. Run the local database:

mongodb

- Recommended: Use a GUI such as [Studio 3T](https://studio3t.com/download/) to more easily interact with the database

### Hosted database with MongoDB Atlas:

1. [Create account](https://account.mongodb.com/account/register) for MongoDB

- **If current MongoDB Atlas owner adds your username/password to the cluster, skip to step 4** \*

2. Follow MongoDB Atlas [Setup Guide](https://docs.atlas.mongodb.com/getting-started/) to create a database collection for hosting applications
3. In app.py set 'host' string to your MongoDB Atlas connection string
4. Create an application.yml file in the /backend directory with the specifications:

username: <MongoDB Atlas cluster username>
password: <MongoDB Atlas cluster password>

5. For testing through CI to function as expected, repository secrets will need to be added through the settings. Create individual secrets with the following keys/values:

MONGO_USER: <MongoDB Atlas cluster username>
MONGO_PASS: <MongoDB Atlas cluster password>

## License

The project is licensed under the [MIT](https://github.com/Kashika08/application-tracking-system/blob/main/LICENSE) license.

## How to Contribute?

Please see our CONTRIBUTING.md for instructions on how to contribute to the repository and assist us in improving the project.

## Team Members

<table>
  <tr>
    <td align="center"><a href="https://github.com/balaji305"><img src="https://avatars.githubusercontent.com/u/98479241?v=4" width="75px;" alt=""/><br /><sub><b>Balaji Sankar</b></sub></a></td>
    <td align="center"><a href="https://github.com/Bhushan0504"><img src="https://avatars.githubusercontent.com/u/79035033?v=4" width="75px;" alt=""/><br /><sub><b>Bhushan Patil</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/siriscmv"><img src="https://avatars.githubusercontent.com/u/40269790?v=4" width="75px;" alt=""/><br /><sub><b>Cyril Melvin Vincent</b></sub></a><br /></td>
  </tr>
</table>
