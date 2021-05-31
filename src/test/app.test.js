const app = require('../app')
const supertest = require('supertest')
const auth = require('../middleware/auth.middleware')
const request = supertest(app)
process.env.DB_DATABASE = 'epsitest'

let token = null;
let iduser = null;
let iddeck = null;
let idcard = null;

// only at the beginning
beforeAll(async () => {
    let res = null
    // is this user created?
    res = await request.post('/api/v1/users/login')
        .send({
            email: "test@test.fr",
            password:"password"
        });
    // no we create it
    if (res.status !== 200) {
        let resp = await request.post('/api/v1/users')
            .send({
                username: "test",
                email: "test@test.fr",
                password:"password",
                confirm_password:"password"
            });
        expect(resp.status).toBe(201)
        expect(resp.body.message).toBe('User was created!')
        // we want the token
        resp = await request.post('/api/v1/users/login')
            .send({
                email: "test@test.fr",
                password:"password"
            });
        token = res.body.token;
        iduser = res.body.iduser;
    } else {
        // user is created, we get the token
        token = res.body.token;
        iduser = res.body.iduser;
    }
    res = await request.get('/api/v1/decks/deckname/deck')
        .set('Authorization', `Bearer ${token}`);
    if (res.status !== 200) { // deck does not exist, we create it
        let resp = await request.post('/api/v1/decks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                deckname: "deck",
                fkuser: iduser
            });
        expect(resp.status).toBe(201)
        expect(resp.body.message).toBe('Deck was created!')
        resp = await request.get('/api/v1/decks/deckname/deck')
            .set('Authorization', `Bearer ${token}`);
        iddeck = resp.body.iddeck
    } else {
        iddeck = res.body.iddeck
    }
    res = await request.post('/api/v1/cards/front')
        .set('Authorization', `Bearer ${token}`)
        .send({
            front: "question"
        });
    if (res.status !== 200) { // card does not exist, we create it
        let resp = await request.post('/api/v1/cards')
            .set('Authorization', `Bearer ${token}`)
            .send({
                front: "question",
                back: "answer",
                fkdeck: iddeck
            });
        expect(resp.status).toBe(201)
        expect(resp.body.message).toBe('Card was created!')
        resp = await request.post('/api/v1/cards/front')
            .set('Authorization', `Bearer ${token}`)
            .send({
                front: "question"
            });
        idcard = resp.body.idcard
    } else {
        idcard = res.body.idcard
    }
})

describe ('/api/v1/users', () => {

    it('POST user login', async () => {
        const response = await request.post('/api/v1/users/login')
            .send({
                email: "test@test.fr",
                password:"password"
            })
        expect(response.status).toBe(200)
        expect(response.body.username).toBe('test')
        expect(response.body.email).toBe('test@test.fr')
        expect(response.body.role).toBe('Apprenant')
    })

    it('GET users', async () => {
        const response = await request.get('/api/v1/users')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })

    it('GET username', async () => {
        const response = await request.get('/api/v1/users/username/test')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.iduser).toBe(iduser)
        expect(response.body.username).toBe('test')
        expect(response.body.email).toBe('test@test.fr')
        expect(response.body.role).toBe('Apprenant')
    })

    it('GET id', async () => {
        const url = '/api/v1/users/id/'+iduser;
        const response = await request.get(url)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.iduser).toBe(iduser)
        expect(response.body.username).toBe('test')
        expect(response.body.email).toBe('test@test.fr')
        expect(response.body.role).toBe('Apprenant')
    })

    it('GET whoami', async () => {
        const response = await request.get('/api/v1/users/whoami')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.iduser).toBe(iduser)
        expect(response.body.username).toBe('test')
        expect(response.body.email).toBe('test@test.fr')
        expect(response.body.role).toBe('Apprenant')
    })
})

describe ('/api/v1/decks', () => {

    it('GET deckname', async () => {
        const response = await request.get('/api/v1/decks/deckname/deck')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.iddeck).toBe(iddeck)
        expect(response.body.deckname).toBe('deck')
    })

    it('GET iddeck', async () => {
        const response = await request.get('/api/v1/decks/id/'+iddeck)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.iddeck).toBe(iddeck)
        expect(response.body.deckname).toBe('deck')
    })

    it('GET decks', async () => {
        const response = await request.get('/api/v1/decks')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })
})

describe ('/api/v1/cards', () => {

    it('GET idcard', async () => {
        const response = await request.get('/api/v1/cards/id/'+idcard)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.idcard).toBe(idcard)
        expect(response.body.front).toBe('question')
        expect(response.body.back).toBe('answer')
        expect(response.body.frontmedia).toBe(null)
        expect(response.body.backmedia).toBe(null)
        expect(response.body.fkdeck).toBe(iddeck)
    })

    it('GET cards', async () => {
        const response = await request.get('/api/v1/cards')
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)
    })

    it('GET cards by front', async () => {
        const response = await request.post('/api/v1/cards/front')
            .set('Authorization', `Bearer ${token}`)
            .send({
                front: "question"
            });
        expect(response.status).toBe(200)
        expect(response.body.idcard).toBe(idcard)
        expect(response.body.front).toBe('question')
        expect(response.body.back).toBe('answer')
        expect(response.body.frontmedia).toBe(null)
        expect(response.body.backmedia).toBe(null)
        expect(response.body.fkdeck).toBe(iddeck)
    })

    it('GET cards by back', async () => {
        const response = await request.post('/api/v1/cards/back')
            .set('Authorization', `Bearer ${token}`)
            .send({
                back: "answer"
            });
        expect(response.status).toBe(200)
        expect(response.body.idcard).toBe(idcard)
        expect(response.body.front).toBe('question')
        expect(response.body.back).toBe('answer')
        expect(response.body.frontmedia).toBe(null)
        expect(response.body.backmedia).toBe(null)
        expect(response.body.fkdeck).toBe(iddeck)
    })
})