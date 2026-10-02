import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals'; 

// Fake data too test with. give it high scope so we can test more with less code
const mssqlMock = {
    input: jest.fn().mockReturnThis(),
    query: jest.fn().mockResolvedValue({
        recordset: [{
            caseID: '1234-abcd',
            CreatedDate: '2026-10-02T12:00:00.000Z'
        }]
    })
};

// we have too fake the DB connection 
jest.unstable_mockModule('../config/ConnectDB.js', () => ({ // using Unstable because ES modules will crash while our code is in Modern js
    default: Promise.resolve({
        request: jest.fn(() => mssqlMock) // pretends we get connected so we can test without DB
    })
}));

// creating the route so we can test
const { default: caseRouter } = await import('../routes/POST/Case.js'); 

// mini server
const app = express();
app.use(express.json());
app.use('/api', caseRouter);

// TESTS
describe('POST /api/createCase', () => {
    
    it('Should create case and return status 201', async () => {
        
        const res = await request(app)
            .post('/api/createCase')
            .send({
                buildingID: 'Hovedbygget',
                roomID: '101',
                description: 'Vasken lekker',
                seriousness: 'Høy',
                namePerson: 'Kari Nordmann'
            });
        
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Case was made!'); // IMPORTANT NEEDS MATCH
        expect(res.body.caseID).toBe('1234-abcd');
        expect(res.body.buildingID).toBe('Hovedbygget');
    });

    it('skal returnere 500 hvis databasen krasjer', async () => {
        mssqlMock.query.mockRejectedValueOnce(new Error('Databasefeil!')); // keeps us from being in a fail loop

        const res = await request(app)
            .post('/api/createCase')
            .send({
                buildingID: 'Hovedbygget',
                roomID: '101',
                description: 'Vasken lekker'
            }); // fake data

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe('Couldnt Create'); // IMPORTANT NEEDS MATCH
    });
});