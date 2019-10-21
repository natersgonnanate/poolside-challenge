# poolside-challenge

Current Coding Deficiencies
- Comments lacking all over
- UI testing lacking
- UI testing failing
- Angular code organization

#API (nodejs / typescript)

Persistence Layer: SQLite 3 In-Memory
NOTE: EVERY TIME YOU RESTART THE API THE DATABASE WILL DROP AND REBUILD

To initialize: npm install
To Test (jest / supertest): npm run test
To Run / Watch (nodemon): npm run dev
API listens over port 8080
To View API Documents: http://localhost:8080/api-docs

#UI (Angular / Bootstrap)

NOTE: The UI is a full SPA within the UI code within the poolside-challenge-ui

To initialize:
cd poolsize-challenge-ui
npm install
npm run start

Listening on http://localhopst:4200
