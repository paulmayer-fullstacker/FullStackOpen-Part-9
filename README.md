# Full Stack Open: Exercises for Part-9 - Type Script

## Introduction:

Herewith my submission of the exercises required for Module-9. The module repo contains eight project directories, accommodating multiple projects (front and back-end), per the various exercise requirements. This module has taken a very long time to complete, punctuated, as it was, with a house move. The module has now been withdrawn. Hence, I feel under pressure to complete.

---

## The Solution:

Solution to the module exercises are presented in six projects:

- backend - A backend Type Script exercise building a bmi calculator and an exercise calculator.
- half-stack-app - A frontend React app offering an educational course prospectus.
- flight-diary-(front/backend) - A full front and backend application providing management of a flight diary.
- patientor-(front/backend) - A basic patient management application.
- grand-finale-patientor-(front/backend) - A full feature extension to the basic patientor offering management of health check entries.

### Development Snapshots (Tags):

Tags have been used to take development snapshots and key milestones. The tags are:

- milestone/part9-exercises-9.1-9.3
- milestone/part9-exercises-9.4-9.5
- milestone/part9-exercises-9.6-9.7
- milestone/part9-exercises-9.8-9.14
- milestone/part9-exercises-9.15
- milestone/part9-exercises-9.17-9.20
- milestone/part9-exercises-9.21-9.30

Please use the milestones to access the relevant exercise development code.

### Documentation:

The scripts have been judiciously commented with inline documentation. So, we will not indulge in further explanation. We will simply cover the bare minimum information required to run the project applications.

### Running the Apps:

Having drawn down the code, within each project, run: npm install. This will install the dependencies listed within the package.json file.

Within each project, run: npm run dev.

### Testing the Apps:

- The first project (backend) is run indelendently, and can be tested directly from the browser. Within the project directory, there is a test_exercises.rest file to run a simple test request.

- The half-stack-app also runs independently. As a frontend application, this is viewed and tested from the browser.

- The flight-diary: Fundamental checks of the backend can be performed in isolation from the frontend, by using the browser. http://localhost:3000/ping should return 'pong', while http://localhost:3000/ping should return preloaded diary entries. Use the frontend to fully test the application.

- The basic patientor app: Once again, the backend can be run, and tested, in isolation. http://localhost:3001/api/ping should return 'pong', localhost:3001/api/patients should return the reloaded list of patients, and localhost:3001/api/diagnoses should return the diagnoses list. patientor-backend also contains a request.rest script, to be used with VSCode's RESTClient. Once confident that the backend is serving correctly, the complete application can be fully tested using the frontend.

- The grand-finaly-patientor app: Fundamental backend tests can be completed from the browser with http://localhost:3001/api/ping, api/patients, and api/diagnoses. More advanced testing can be completed with the two test scrips: tests/request.rest (patient management), and tests/new-entry-validation.rest (for health check management). Then the frontend can be used for full end-to-end testing of the application.

---

## Version Control

All three project files have been pushed to my GitHub repository at https://github.com/paulmayer-fullstacker/FullStackOpen-Part-9.

---

<br/>

<hr style="height: 5px; background-color: black; border: none;">
